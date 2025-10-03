-- Create enum types for document management
CREATE TYPE document_type AS ENUM (
  'offer_letter',
  'experience_letter', 
  'salary_slip',
  'employment_verification',
  'relieving_letter',
  'custom'
);

CREATE TYPE document_request_status AS ENUM (
  'pending',
  'awaiting_approval',
  'in_progress',
  'completed',
  'rejected',
  'changes_requested',
  'auto_generating',
  'sla_breached'
);

CREATE TYPE delivery_method AS ENUM (
  'portal',
  'email',
  'both'
);

CREATE TYPE document_format AS ENUM (
  'pdf',
  'docx'
);

-- Document Templates table
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document_type document_type NOT NULL,
  template_content TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]'::jsonb,
  default_approver_role app_role,
  requires_approval BOOLEAN DEFAULT true,
  auto_generate_allowed BOOLEAN DEFAULT false,
  default_sla_hours INTEGER DEFAULT 24,
  default_delivery_method delivery_method DEFAULT 'both',
  header_asset_url TEXT,
  footer_asset_url TEXT,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document Requests table
CREATE TABLE document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES auth.users(id),
  employee_name TEXT,
  document_type document_type NOT NULL,
  purpose TEXT NOT NULL,
  period TEXT,
  format document_format DEFAULT 'pdf',
  delivery_method delivery_method DEFAULT 'both',
  status document_request_status DEFAULT 'awaiting_approval',
  template_id UUID REFERENCES document_templates(id),
  approver_id UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  comment TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  generated_document_url TEXT,
  sla_hours INTEGER DEFAULT 24,
  due_by TIMESTAMP WITH TIME ZONE,
  escalation_level INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee Documents table
CREATE TABLE employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES auth.users(id),
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id),
  generated_by_request_id UUID REFERENCES document_requests(id),
  is_signed BOOLEAN DEFAULT false,
  signer_metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document Audit Logs table
CREATE TABLE document_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  actor_name TEXT,
  action TEXT NOT NULL,
  request_id UUID REFERENCES document_requests(id),
  document_id UUID REFERENCES employee_documents(id),
  before_state JSONB,
  after_state JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view active templates"
  ON document_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON document_templates FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for document_requests
CREATE POLICY "Employees can view their own requests"
  ON document_requests FOR SELECT
  USING (auth.uid() = employee_id);

CREATE POLICY "HR and Admin can view all requests"
  ON document_requests FOR SELECT
  USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

CREATE POLICY "Employees can create requests"
  ON document_requests FOR INSERT
  WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "HR and Admin can update requests"
  ON document_requests FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

-- RLS Policies for employee_documents
CREATE POLICY "Employees can view their own documents"
  ON employee_documents FOR SELECT
  USING (auth.uid() = employee_id);

CREATE POLICY "HR and Admin can view all documents"
  ON employee_documents FOR SELECT
  USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

CREATE POLICY "HR and Admin can insert documents"
  ON employee_documents FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('hr', 'admin'));

CREATE POLICY "Uploaders can update their uploaded documents"
  ON employee_documents FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- RLS Policies for document_audit_logs
CREATE POLICY "HR and Admin can view audit logs"
  ON document_audit_logs FOR SELECT
  USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

CREATE POLICY "Anyone can insert audit logs"
  ON document_audit_logs FOR INSERT
  WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_documents_updated_at
  BEFORE UPDATE ON employee_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set due_by based on SLA
CREATE OR REPLACE FUNCTION set_request_due_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_by IS NULL THEN
    NEW.due_by := NEW.created_at + (NEW.sla_hours || ' hours')::INTERVAL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_document_request_due_by
  BEFORE INSERT ON document_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_due_by();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE document_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE employee_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE document_audit_logs;