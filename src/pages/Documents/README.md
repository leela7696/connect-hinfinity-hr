# Document Request & Generation Module

## Setup & Configuration

### Demo Mode
Toggle demo mode: `localStorage.setItem('demo_mode', 'true')` in browser console
- Demo mode uses seed data without backend calls
- Useful for testing UI and workflows

### Admin Configuration

#### 1. Adding Templates
- Navigate to `/documents/templates` (Admin only)
- Click "New Template"
- Configure:
  - Template name
  - Document type
  - Default approver role (HR/Manager/Admin)
  - Default SLA (hours)
  - HTML content with placeholders
- Available placeholders: `{{fullName}}`, `{{designation}}`, `{{department}}`, `{{startDate}}`, `{{endDate}}`, `{{basicSalary}}`, `{{netSalary}}`, etc.

#### 2. SLA Configuration
- Set in template: `default_sla_hours`
- System monitors and escalates breached requests
- Escalation levels: 0 (normal) → 1 (manager notified) → 2 (admin notified)

#### 3. Notification Templates
Configure in serverless endpoints:
- Email subject/body templates
- SMS templates (if enabled)
- Slack webhook messages

### Serverless API Endpoints

#### Required Endpoints (implement as Supabase Edge Functions):

1. **POST /api/doc/eligibility**
   - Check employee eligibility for document type
   - Returns: `{ eligible, requiresApproval, reason, prefillData }`

2. **POST /api/doc/generate**
   - Generate document from template
   - Authentication: Service role key required
   - Returns: `{ jobId, statusUrl, docUrl, pdfUrl, signed }`

3. **GET /api/job/status?jobId=xxx**
   - Check generation job status
   - Returns: `{ status, progress, resultUrl, error }`

4. **POST /api/doc/sign**
   - Request digital signature (DocuSign/Adobe Sign integration)
   - Returns: `{ signedUrl, signRequestId, auditId, status }`

5. **POST /api/ai/validate-doc**
   - AI validation of uploaded documents
   - Returns: `{ valid, issues[], confidence, metadata }`

6. **POST /api/notify**
   - Send notifications (email/SMS/Slack)
   - Rate limit: 100/hour per user
   - Integration: SendGrid, Twilio

7. **POST /api/doc/generate/batch**
   - Bulk document generation
   - Admin/HR only
   - Returns: `{ jobId, estimatedCount, statusUrl }`

### Environment Variables (Supabase Secrets)

Required secrets:
- `SENDGRID_API_KEY` - Email delivery
- `TWILIO_API_KEY` - SMS notifications (optional)
- `DOCUSIGN_API_KEY` - Digital signatures (optional)
- `OPENAI_API_KEY` - AI validation (optional)

### Security Configuration

1. **RLS Policies**: Ensure proper policies on `document_requests`, `employee_documents` tables
2. **Storage Security**: Files encrypted at rest, signed URLs expire in 15 minutes
3. **Sensitive Documents**: Require MFA for salary slips, bank references
4. **Virus Scanning**: Integrate ClamAV or similar for file uploads
5. **Rate Limiting**: Apply on all generation and notification endpoints

### Data Retention

Configure in Admin settings:
- Document retention period (default: 7 years for compliance)
- Soft-delete vs hard-delete policy
- GDPR export functionality

### Monitoring & SLA

- Monitor SLA compliance in dashboard metrics
- Automated escalation on breach (email → Slack → admin dashboard)
- Background job: runs every 15 minutes to check pending requests

## User Roles & Permissions

- **Employee**: Request documents, view own requests/documents
- **Manager**: Approve team member requests (if configured)
- **HR**: Approve all requests, access queue, generate/upload documents
- **Admin**: Full access + template management + system configuration

## Testing

### Acceptance Criteria Checklist
- ✅ Employee can submit request with eligibility check
- ✅ Auto-generation for eligible documents (salary slips)
- ✅ HR approval workflow with approve/reject/request changes
- ✅ Document versioning and secure storage
- ✅ SLA monitoring with breach indicators
- ✅ Audit logs for all actions
- ✅ RBAC enforced throughout
- ✅ Demo mode available for testing
- ✅ Responsive UI with 21st.dev design principles

### Test Scenarios
1. Employee requests salary slip → auto-generated
2. Employee requests experience letter → requires HR approval
3. HR approves request → document generated and delivered
4. SLA breach → escalation notification sent
5. Sensitive document download → MFA prompt (when implemented)

## Next Steps

1. Create Supabase tables via migrations (not auto-generated)
2. Implement serverless endpoints as Edge Functions
3. Configure notification services (SendGrid, etc.)
4. Set up file storage buckets with proper RLS
5. Enable MFA for sensitive document access
6. Implement batch generation worker
7. Set up monitoring and alerting
