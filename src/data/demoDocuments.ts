// Demo seed data for Document Request & Generation module

import { DocumentRequest, EmployeeDocument, DocumentTemplate, SLAMetrics } from '@/types/documents';

export const demoRequests: DocumentRequest[] = [
  {
    id: 'req-001',
    employee_id: 'emp-001',
    employee_name: 'John Doe',
    document_type: 'salary_slip',
    purpose: 'Personal records',
    period_start: '2025-01-01',
    period_end: '2025-01-31',
    format: 'pdf',
    delivery_method: 'portal_email',
    status: 'completed',
    created_at: '2025-01-28T10:00:00Z',
    updated_at: '2025-01-28T11:30:00Z',
    due_by: '2025-01-29T10:00:00Z',
    sla_seconds: 86400,
    escalation_level: 0,
    eligible: true,
    requires_approval: false,
    generated_document_id: 'doc-001',
  },
  {
    id: 'req-002',
    employee_id: 'emp-002',
    employee_name: 'Jane Smith',
    document_type: 'experience_letter',
    purpose: 'Job application',
    format: 'pdf',
    delivery_method: 'portal_email',
    status: 'awaiting_approval',
    approver_id: 'hr-001',
    approver_name: 'HR Manager',
    created_at: '2025-01-29T14:00:00Z',
    updated_at: '2025-01-29T14:00:00Z',
    due_by: '2025-01-30T14:00:00Z',
    sla_seconds: 86400,
    escalation_level: 0,
    eligible: true,
    requires_approval: true,
  },
  {
    id: 'req-003',
    employee_id: 'emp-003',
    employee_name: 'Mike Johnson',
    document_type: 'employment_verification',
    purpose: 'Loan application',
    format: 'pdf',
    delivery_method: 'email_only',
    status: 'sla_breached',
    approver_id: 'hr-001',
    created_at: '2025-01-27T09:00:00Z',
    updated_at: '2025-01-27T09:00:00Z',
    due_by: '2025-01-28T09:00:00Z',
    sla_seconds: 86400,
    escalation_level: 2,
    eligible: true,
    requires_approval: true,
  },
  {
    id: 'req-004',
    employee_id: 'emp-001',
    employee_name: 'John Doe',
    document_type: 'offer_letter',
    purpose: 'Records',
    format: 'pdf',
    delivery_method: 'portal_email',
    status: 'rejected',
    approver_id: 'hr-001',
    created_at: '2025-01-26T10:00:00Z',
    updated_at: '2025-01-26T15:00:00Z',
    due_by: '2025-01-27T10:00:00Z',
    sla_seconds: 86400,
    escalation_level: 0,
    eligible: false,
    requires_approval: true,
    rejection_reason: 'Offer letter already issued and cannot be regenerated',
  },
  {
    id: 'req-005',
    employee_id: 'emp-004',
    employee_name: 'Sarah Wilson',
    document_type: 'relieving_letter',
    purpose: 'New job joining',
    format: 'pdf',
    delivery_method: 'portal_email',
    status: 'in_progress',
    approver_id: 'hr-001',
    created_at: '2025-01-29T16:00:00Z',
    updated_at: '2025-01-29T17:00:00Z',
    due_by: '2025-01-30T16:00:00Z',
    sla_seconds: 86400,
    escalation_level: 0,
    eligible: true,
    requires_approval: true,
  },
];

export const demoDocuments: EmployeeDocument[] = [
  {
    id: 'doc-001',
    employee_id: 'emp-001',
    type: 'salary_slip',
    file_url: '/demo/salary_slip_jan_2025.pdf',
    file_name: 'salary_slip_jan_2025.pdf',
    uploaded_by: 'system',
    uploaded_by_name: 'System Generated',
    uploaded_at: '2025-01-28T11:30:00Z',
    version: 1,
    tags: ['2025', 'January', 'auto-generated'],
    generated_by_request_id: 'req-001',
    signed: true,
    is_sensitive: true,
  },
  {
    id: 'doc-002',
    employee_id: 'emp-001',
    type: 'offer_letter',
    file_url: '/demo/offer_letter_john_doe.pdf',
    file_name: 'offer_letter_john_doe.pdf',
    uploaded_by: 'hr-001',
    uploaded_by_name: 'HR Manager',
    uploaded_at: '2024-12-15T10:00:00Z',
    version: 1,
    tags: ['2024', 'onboarding'],
    signed: true,
    is_sensitive: false,
  },
  {
    id: 'doc-003',
    employee_id: 'emp-002',
    type: 'salary_slip',
    file_url: '/demo/salary_slip_dec_2024.pdf',
    file_name: 'salary_slip_dec_2024.pdf',
    uploaded_by: 'system',
    uploaded_at: '2025-01-05T09:00:00Z',
    version: 1,
    tags: ['2024', 'December', 'auto-generated'],
    signed: true,
    is_sensitive: true,
  },
];

export const demoTemplates: DocumentTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Standard Experience Letter',
    document_type: 'experience_letter',
    content: `<div>
      <h1>Experience Certificate</h1>
      <p>This is to certify that <strong>{{fullName}}</strong> worked with Hinfinity from <strong>{{startDate}}</strong> to <strong>{{endDate}}</strong> as <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department.</p>
      <p>During their tenure, they demonstrated excellent skills and professionalism.</p>
      <p>We wish them success in their future endeavors.</p>
    </div>`,
    placeholders: ['{{fullName}}', '{{startDate}}', '{{endDate}}', '{{designation}}', '{{department}}'],
    default_approver_role: 'hr',
    default_sla_hours: 24,
    default_delivery_method: 'portal_email',
    eligibility_rules: [
      {
        type: 'tenure',
        value: 90,
        operator: 'gte',
        message: 'Minimum 90 days tenure required',
      },
    ],
    version: 1,
    created_by: 'admin-001',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    is_active: true,
  },
  {
    id: 'tmpl-002',
    name: 'Monthly Salary Slip',
    document_type: 'salary_slip',
    content: `<div>
      <h1>Salary Slip - {{month}} {{year}}</h1>
      <p>Employee: <strong>{{fullName}}</strong></p>
      <p>Designation: <strong>{{designation}}</strong></p>
      <p>Basic Salary: {{basicSalary}}</p>
      <p>Allowances: {{allowances}}</p>
      <p>Deductions: {{deductions}}</p>
      <p>Net Salary: <strong>{{netSalary}}</strong></p>
    </div>`,
    placeholders: ['{{fullName}}', '{{month}}', '{{year}}', '{{designation}}', '{{basicSalary}}', '{{allowances}}', '{{deductions}}', '{{netSalary}}'],
    default_approver_role: 'hr',
    default_sla_hours: 4,
    default_delivery_method: 'portal_email',
    eligibility_rules: [],
    version: 1,
    created_by: 'admin-001',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    is_active: true,
  },
];

export const demoMetrics: SLAMetrics = {
  total_requests: 24,
  pending_approvals: 3,
  average_completion_time: 18.5,
  sla_compliance_rate: 87.5,
  documents_generated_today: 7,
  top_requested_types: [
    { type: 'salary_slip', count: 12 },
    { type: 'experience_letter', count: 6 },
    { type: 'employment_verification', count: 4 },
    { type: 'offer_letter', count: 2 },
  ],
  breached_requests: 1,
};

export const isDemoMode = () => {
  // Check localStorage or config for demo mode
  return localStorage.getItem('demo_mode') === 'true';
};

export const setDemoMode = (enabled: boolean) => {
  localStorage.setItem('demo_mode', enabled ? 'true' : 'false');
};
