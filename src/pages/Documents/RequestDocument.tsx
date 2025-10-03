import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentRequests } from '@/hooks/useDocumentRequests';
import { DocumentType, DocumentFormat, DeliveryMethod, EligibilityCheckResult } from '@/types/documents';
import { documentTypeLabels } from '@/utils/documentHelpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Clock, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RequestDocument() {
  const navigate = useNavigate();
  const { createRequest, checkEligibility } = useDocumentRequests();
  const { toast } = useToast();
  
  const [documentType, setDocumentType] = useState<DocumentType>('salary_slip');
  const [purpose, setPurpose] = useState('');
  const [period, setPeriod] = useState('');
  const [format, setFormat] = useState<DocumentFormat>('pdf');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('both');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const [eligibility, setEligibility] = useState<EligibilityCheckResult | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckEligibility = async () => {
    setCheckingEligibility(true);
    try {
      const result = await checkEligibility(documentType);
      setEligibility(result);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eligibility?.eligible) {
      toast({
        title: 'Not Eligible',
        description: eligibility?.reason || 'Please check eligibility first',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const requestData = {
        document_type: documentType,
        purpose,
        period: documentType === 'salary_slip' ? period : undefined,
        format,
        delivery_method: deliveryMethod,
        status: eligibility.requiresApproval ? ('awaiting_approval' as any) : ('auto_generating' as any),
      };

      await createRequest(requestData);
      
      toast({
        title: 'Request Submitted',
        description: eligibility.requiresApproval 
          ? 'Your request has been submitted for approval'
          : 'Your document is being generated',
      });
      
      navigate('/documents/my-requests');
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Request Document</h1>
        <p className="text-muted-foreground">
          Submit a request for HR documents. We'll verify your eligibility and process it accordingly.
        </p>
      </div>

      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Request Form
          </CardTitle>
          <CardDescription>
            Fill in the details below to request a document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type *</Label>
              <Select
                value={documentType}
                onValueChange={(value) => {
                  setDocumentType(value as DocumentType);
                  setEligibility(null);
                }}
              >
                <SelectTrigger id="docType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="e.g., Loan application, Job application, Personal records..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                rows={3}
              />
            </div>

            {/* Period (for salary slips) */}
            {documentType === 'salary_slip' && (
              <div className="space-y-2">
                <Label htmlFor="period">Period *</Label>
                <Input
                  id="period"
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as DocumentFormat)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Method */}
            <div className="space-y-2">
              <Label htmlFor="delivery">Delivery Method</Label>
              <Select value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}>
                <SelectTrigger id="delivery">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Portal + Email</SelectItem>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="portal">Portal Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Eligibility Check Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckEligibility}
              disabled={checkingEligibility}
              className="w-full"
            >
              {checkingEligibility ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Eligibility...
                </>
              ) : (
                'Check Eligibility'
              )}
            </Button>

            {/* Eligibility Result */}
            {eligibility && (
              <Alert variant={eligibility.eligible ? 'default' : 'destructive'}>
                {eligibility.eligible ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {eligibility.eligible ? 'Eligible!' : 'Not Eligible'}
                    </p>
                    {eligibility.reason && <p className="text-sm">{eligibility.reason}</p>}
                    {eligibility.autoGenerateAvailable && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Estimated time: {eligibility.estimatedTime}</span>
                      </div>
                    )}
                    {eligibility.requiresApproval && (
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        ⚠️ This request requires HR approval
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/documents/my-requests')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!eligibility?.eligible || submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
