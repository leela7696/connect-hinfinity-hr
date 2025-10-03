// Document Request & Generation Types

export type DocumentType = 
  | 'offer_letter'
  | 'experience_letter'
  | 'salary_slip'
  | 'employment_verification'
  | 'relieving_letter'
  | 'custom';

export type RequestStatus = 
  | 'pending'
  | 'auto_generating'
  | 'awaiting_approval'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'changes_requested'
  | 'sla_breached';

export type DeliveryMethod = 'portal' | 'email' | 'both';

export type DocumentFormat = 'pdf' | 'docx';

export type DocumentRequestStatus = RequestStatus;

export interface DocumentRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  document_type: DocumentType;
  purpose: string;
  period?: string;
  format: DocumentFormat;
  delivery_method: DeliveryMethod;
  status: RequestStatus;
  attachments?: any;
  approver_id?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  comment?: string;
  generated_document_url?: string;
  created_at: string;
  updated_at: string;
  due_by?: string;
  sla_hours: number;
  escalation_level: number;
  template_id?: string;
  metadata?: any;
}

export interface DocumentComment {
  id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  uploaded_at: string;
  version: number;
  expires_at?: string;
  tags: string[];
  generated_by_request_id?: string;
  signed: boolean;
  signer_metadata?: any;
  is_sensitive: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  document_type: DocumentType;
  content: string; // HTML with placeholders
  placeholders: string[]; // e.g., ["{{fullName}}", "{{designation}}"]
  default_approver_role: 'hr' | 'admin' | 'manager';
  default_sla_hours: number;
  default_delivery_method: DeliveryMethod;
  eligibility_rules: EligibilityRule[];
  header_asset_url?: string;
  footer_asset_url?: string;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface EligibilityRule {
  type: 'tenure' | 'status' | 'confidential' | 'custom';
  value: any;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'includes';
  message: string;
}

export interface EligibilityCheckResult {
  eligible: boolean;
  requiresApproval: boolean;
  reason?: string;
  prefillData?: Record<string, any>;
  autoGenerateAvailable?: boolean;
  estimatedTime?: string;
}

export interface DocumentAuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  request_id?: string;
  document_id?: string;
  before?: any;
  after?: any;
  ip_address?: string;
  timestamp: string;
}

export interface SLAMetrics {
  total_requests: number;
  pending_approvals: number;
  average_completion_time: number;
  sla_compliance_rate: number;
  documents_generated_today: number;
  top_requested_types: { type: DocumentType; count: number }[];
  breached_requests: number;
}

// API Stub Interfaces (for serverless endpoints)

/**
 * POST /api/doc/eligibility
 * Check if employee is eligible for document type
 */
export interface EligibilityCheckRequest {
  employeeId: string;
  docType: DocumentType;
  params?: Record<string, any>;
}

/**
 * POST /api/doc/generate
 * Generate document from template
 * Authentication: Service role key required
 */
export interface GenerateDocumentRequest {
  requestId: string;
  templateId: string;
  params: Record<string, any>;
}

export interface GenerateDocumentResponse {
  jobId: string;
  statusUrl: string;
  docUrl?: string;
  pdfUrl?: string;
  signed: boolean;
}

/**
 * GET /api/job/status?jobId=xxx
 * Check status of document generation job
 */
export interface JobStatusResponse {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  resultUrl?: string;
  error?: string;
}

/**
 * POST /api/doc/sign
 * Request digital signature for document
 * Integration: DocuSign, Adobe Sign, or similar
 */
export interface SignDocumentRequest {
  documentUrl: string;
  signers: { email: string; name: string; role: string }[];
}

export interface SignDocumentResponse {
  signedUrl?: string;
  signRequestId: string;
  auditId: string;
  status: 'sent' | 'pending' | 'completed';
}

/**
 * POST /api/ai/validate-doc
 * AI-powered document validation
 */
export interface ValidateDocumentRequest {
  fileUrl: string;
  docType: DocumentType;
}

export interface ValidateDocumentResponse {
  valid: boolean;
  issues: string[];
  confidence: number; // 0-1
  metadata?: Record<string, any>;
}

/**
 * POST /api/notify
 * Send notification via email/SMS
 * Integration: SendGrid, Twilio
 * Rate limiting: 100/hour per user
 */
export interface NotifyRequest {
  to: string | string[];
  subject: string;
  body: string;
  attachments?: { filename: string; url: string }[];
  channel: 'email' | 'sms' | 'slack';
}

/**
 * POST /api/doc/generate/batch
 * Bulk document generation (e.g., monthly salary slips)
 * Authentication: Admin/HR only
 */
export interface BatchGenerateRequest {
  templateId: string;
  filterParams: {
    employeeIds?: string[];
    department?: string;
    startDate: string;
    endDate: string;
  };
}

export interface BatchGenerateResponse {
  jobId: string;
  estimatedCount: number;
  statusUrl: string;
}
