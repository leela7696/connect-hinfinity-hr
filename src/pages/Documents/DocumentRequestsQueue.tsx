import { useState } from 'react';
import { useDocumentRequests } from '@/hooks/useDocumentRequests';
import { DocumentRequest } from '@/types/documents';
import { documentTypeLabels, statusColors, statusLabels, calculateSLAProgress, formatDuration } from '@/utils/documentHelpers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, CheckCircle, XCircle, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentRequestsQueue() {
  const { requests, loading, updateRequestStatus } = useDocumentRequests();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [comment, setComment] = useState('');

  // Filter requests based on user role
  const filteredRequests = requests
    .filter((request) => {
      // Only show requests that need attention or are in queue
      if (profile?.role === 'employee') return false;
      
      const matchesSearch = 
        request.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documentTypeLabels[request.document_type].toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      const sla = calculateSLAProgress(request);
      let matchesSLA = true;
      if (slaFilter === 'breached') matchesSLA = sla.isBreached;
      if (slaFilter === 'at_risk') matchesSLA = sla.percentage > 75 && !sla.isBreached;
      if (slaFilter === 'on_track') matchesSLA = sla.percentage <= 75;
      
      return matchesSearch && matchesStatus && matchesSLA;
    })
    .sort((a, b) => {
      // Sort by SLA breach first, then by creation date
      const slaA = calculateSLAProgress(a);
      const slaB = calculateSLAProgress(b);
      if (slaA.isBreached && !slaB.isBreached) return -1;
      if (!slaA.isBreached && slaB.isBreached) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    await updateRequestStatus(selectedRequest.id, 'approved');
    setActionDialog(null);
    setSelectedRequest(null);
    setComment('');
    
    toast({
      title: 'Request Approved',
      description: 'Document generation will begin shortly',
    });
  };

  const handleReject = async () => {
    if (!selectedRequest || !comment) {
      toast({
        title: 'Comment Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }
    
    await updateRequestStatus(selectedRequest.id, 'rejected', { reason: comment });
    setActionDialog(null);
    setSelectedRequest(null);
    setComment('');
  };

  const handleRequestChanges = async () => {
    if (!selectedRequest || !comment) {
      toast({
        title: 'Comment Required',
        description: 'Please specify what changes are needed',
        variant: 'destructive',
      });
      return;
    }
    
    await updateRequestStatus(selectedRequest.id, 'changes_requested', { comment });
    setActionDialog(null);
    setSelectedRequest(null);
    setComment('');
  };

  const SLAIndicator = ({ request }: { request: DocumentRequest }) => {
    const sla = calculateSLAProgress(request);
    
    if (request.status === 'completed' || request.status === 'rejected') {
      return null;
    }
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">SLA</span>
          {sla.isBreached ? (
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <AlertTriangle className="w-3 h-3" />
              Breached
            </span>
          ) : (
            <span className="text-muted-foreground">
              {formatDuration(sla.hoursRemaining)}
            </span>
          )}
        </div>
        <Progress 
          value={sla.percentage} 
          className={`h-1 ${sla.isBreached ? 'bg-red-200' : ''}`}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Document Requests Queue</h1>
        <p className="text-muted-foreground">
          Review and process pending document requests from employees
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by employee, document type, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="sla_breached">SLA Breached</SelectItem>
              </SelectContent>
            </Select>
            <Select value={slaFilter} onValueChange={setSlaFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="SLA Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SLA</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
                <SelectItem value="at_risk">At Risk (&gt;75%)</SelectItem>
                <SelectItem value="on_track">On Track</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{requests.filter(r => r.status === 'awaiting_approval').length}</div>
            <div className="text-sm text-muted-foreground">Awaiting Approval</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{requests.filter(r => r.status === 'in_progress').length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => calculateSLAProgress(r).isBreached).length}
            </div>
            <div className="text-sm text-muted-foreground">SLA Breached</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || slaFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No pending requests at the moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employee_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {documentTypeLabels[request.document_type]}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.purpose}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <SLAIndicator request={request} />
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'awaiting_approval' && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setActionDialog('approve');
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setActionDialog('changes');
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setActionDialog('reject');
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Action Dialogs */}
      <Dialog open={actionDialog === 'approve'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve this document request? The document will be generated and sent to the employee.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4 space-y-2">
              <p><strong>Employee:</strong> {selectedRequest.employee_name}</p>
              <p><strong>Document:</strong> {documentTypeLabels[selectedRequest.document_type]}</p>
              <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'reject'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'changes'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Specify what changes are needed from the employee
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Please describe what changes are needed..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleRequestChanges}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
