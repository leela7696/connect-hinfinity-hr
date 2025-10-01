import { useState } from 'react';
import { DocumentTemplate, DocumentType } from '@/types/documents';
import { demoTemplates, isDemoMode } from '@/data/demoDocuments';
import { documentTypeLabels } from '@/utils/documentHelpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Edit, Eye, Trash2, Code } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TemplateManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<DocumentTemplate[]>(demoTemplates);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    document_type: 'experience_letter' as DocumentType,
    content: '',
    default_approver_role: 'hr' as 'hr' | 'admin' | 'manager',
    default_sla_hours: 24,
    default_delivery_method: 'portal_email' as 'portal_email' | 'email_only',
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      document_type: 'experience_letter',
      content: '',
      default_approver_role: 'hr',
      default_sla_hours: 24,
      default_delivery_method: 'portal_email',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      document_type: template.document_type,
      content: template.content,
      default_approver_role: template.default_approver_role,
      default_sla_hours: template.default_sla_hours,
      default_delivery_method: template.default_delivery_method,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: 'Template changes not saved in demo mode',
      });
      setIsDialogOpen(false);
      return;
    }

    // TODO: Save to Supabase
    toast({
      title: 'Template Saved',
      description: `${formData.name} has been saved successfully`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (templateId: string) => {
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: 'Cannot delete templates in demo mode',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Delete from Supabase
    toast({
      title: 'Template Deleted',
      description: 'The template has been deleted',
    });
  };

  const extractPlaceholders = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(matches, m => `{{${m[1]}}}`);
  };

  const TemplateCard = ({ template }: { template: DocumentTemplate }) => (
    <Card className="hover:shadow-md transition-shadow backdrop-blur-sm bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{template.name}</h3>
              {template.is_active ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {documentTypeLabels[template.document_type]}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div>SLA: {template.default_sla_hours}h</div>
              <div>Approver: {template.default_approver_role.toUpperCase()}</div>
              <div>Version: {template.version}</div>
            </div>
            {template.placeholders && template.placeholders.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {template.placeholders.slice(0, 5).map((placeholder) => (
                  <Badge key={placeholder} variant="secondary" className="text-xs font-mono">
                    {placeholder}
                  </Badge>
                ))}
                {template.placeholders.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.placeholders.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewTemplate(template)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(template)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(template.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Template Manager</h1>
          <p className="text-muted-foreground">
            Create and manage document templates with placeholders and automation rules
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <Alert className="mb-6">
        <Code className="h-4 w-4" />
        <AlertDescription>
          <strong>Available Placeholders:</strong> Use double curly braces for dynamic fields, e.g., 
          {' '}<code className="text-xs">{'{{fullName}}'}</code>, <code className="text-xs">{'{{designation}}'}</code>, 
          {' '}<code className="text-xs">{'{{startDate}}'}</code>, <code className="text-xs">{'{{department}}'}</code>
        </AlertDescription>
      </Alert>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first document template to get started
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              Configure template settings and content with placeholders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Standard Experience Letter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docType">Document Type *</Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) => setFormData({ ...formData, document_type: value as DocumentType })}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approver">Default Approver</Label>
                <Select
                  value={formData.default_approver_role}
                  onValueChange={(value) => setFormData({ ...formData, default_approver_role: value as any })}
                >
                  <SelectTrigger id="approver">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sla">Default SLA (hours)</Label>
                <Input
                  id="sla"
                  type="number"
                  value={formData.default_sla_hours}
                  onChange={(e) => setFormData({ ...formData, default_sla_hours: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Template Content (HTML) *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter HTML content with {{placeholders}}"
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Detected placeholders: {extractPlaceholders(formData.content).join(', ') || 'None'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template preview with sample data
            </DialogDescription>
          </DialogHeader>
          <div 
            className="p-6 bg-white dark:bg-gray-900 rounded border"
            dangerouslySetInnerHTML={{ __html: previewTemplate?.content || '' }}
          />
          <DialogFooter>
            <Button onClick={() => setPreviewTemplate(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
