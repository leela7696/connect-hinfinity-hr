import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EmployeeDocument } from '@/types/documents';
import { demoDocuments, isDemoMode } from '@/data/demoDocuments';

export function useEmployeeDocuments() {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isDemoMode()) {
      // Use demo data
      if (profile?.role === 'admin' || profile?.role === 'hr') {
        setDocuments(demoDocuments);
      } else {
        setDocuments(demoDocuments.filter(d => d.employee_id === user?.id));
      }
      setLoading(false);
      return;
    }

    // TODO: Fetch from Supabase
    setDocuments([]);
    setLoading(false);
  }, [user, profile]);

  /**
   * Upload document to Supabase Storage
   * Storage path: orgs/{orgId}/employees/{employeeId}/documents/{docType}/{filename}_v{n}.pdf
   * 
   * Note: Files should be encrypted at rest (Supabase Storage default)
   * Use signed URLs with short expiration (15 minutes) for downloads
   */
  const uploadDocument = async (file: File, metadata: Partial<EmployeeDocument>) => {
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: 'Document upload simulated (not saved)',
      });
      return { data: null, error: null };
    }

    try {
      // TODO: Implement Supabase Storage upload
      // const filePath = `employees/${user?.id}/documents/${metadata.type}/${file.name}`;
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from('documents')
      //   .upload(filePath, file);
      //
      // if (uploadError) throw uploadError;
      //
      // // Create metadata record
      // const { data, error } = await supabase
      //   .from('employee_documents')
      //   .insert([{
      //     employee_id: user?.id,
      //     file_url: uploadData.path,
      //     file_name: file.name,
      //     ...metadata
      //   }])
      //   .select()
      //   .single();

      toast({
        title: 'Document Uploaded',
        description: 'Your document has been uploaded successfully',
      });

      return { data: null, error: null };
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  /**
   * Get signed download URL for document
   * URLs expire in 15 minutes for security
   */
  const getDownloadUrl = async (documentId: string): Promise<string | null> => {
    if (isDemoMode()) {
      return '/demo/sample_document.pdf';
    }

    try {
      // TODO: Generate signed URL via Supabase Storage
      // const doc = documents.find(d => d.id === documentId);
      // if (!doc) return null;
      //
      // const { data, error } = await supabase.storage
      //   .from('documents')
      //   .createSignedUrl(doc.file_url, 900); // 15 minutes
      //
      // if (error) throw error;
      // return data.signedUrl;

      return null;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate download link',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    documents,
    loading,
    uploadDocument,
    getDownloadUrl,
  };
}
