import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentRequests } from '@/hooks/useDocumentRequests';
import { DocumentRequest } from '@/types/documents';
import { documentTypeLabels, statusColors, statusLabels, calculateSLAProgress, formatDuration } from '@/utils/documentHelpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MyRequests() {
  const navigate = useNavigate();
  const { requests, loading } = useDocumentRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      documentTypeLabels[request.document_type].toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const RequestCard = ({ request }: { request: DocumentRequest }) => {
    const slaProgress = calculateSLAProgress(request);
    
    return (
      <Card className="hover:shadow-md transition-shadow backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">
                  {documentTypeLabels[request.document_type]}
                </h3>
                <Badge className={statusColors[request.status]}>
                  {statusLabels[request.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {request.purpose}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Requested {new Date(request.created_at).toLocaleDateString()}</span>
                </div>
                {request.period_start && (
                  <div>
                    Period: {new Date(request.period_start).toLocaleDateString()} - {request.period_end ? new Date(request.period_end).toLocaleDateString() : 'N/A'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SLA Progress */}
          {request.status !== 'completed' && request.status !== 'rejected' && request.due_by && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Time</span>
                <span className={slaProgress.isBreached ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                  {slaProgress.isBreached ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      SLA Breached
                    </span>
                  ) : (
                    `${formatDuration(slaProgress.hoursRemaining)} remaining`
                  )}
                </span>
              </div>
              <Progress 
                value={slaProgress.percentage} 
                className={slaProgress.isBreached ? 'bg-red-200' : ''}
              />
            </div>
          )}

          {/* Rejection/Changes Reason */}
          {(request.status === 'rejected' || request.status === 'changes_requested') && request.rejection_reason && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Reason:</strong> {request.rejection_reason}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Navigate to request detail page
              }}
            >
              View Details
            </Button>
            {request.status === 'completed' && (
              <Button
                size="sm"
                onClick={() => {
                  // TODO: Download document
                }}
              >
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Requests</h1>
          <p className="text-muted-foreground">
            Track your document requests and download completed documents
          </p>
        </div>
        <Button onClick={() => navigate('/documents/request')}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by document type or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You haven\'t submitted any document requests yet'}
            </p>
            <Button onClick={() => navigate('/documents/request')}>
              <Plus className="mr-2 h-4 w-4" />
              Submit Your First Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
