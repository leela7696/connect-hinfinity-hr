import { useState } from 'react';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';
import { EmployeeDocument } from '@/types/documents';
import { documentTypeLabels } from '@/utils/documentHelpers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Download, Eye, Lock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyDocuments() {
  const { documents, loading, getDownloadUrl } = useEmployeeDocuments();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documentTypeLabels[doc.type].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleDownload = async (doc: EmployeeDocument) => {
    if (doc.is_sensitive) {
      // TODO: Implement MFA check for sensitive documents
      toast({
        title: 'Security Check',
        description: 'Sensitive documents require MFA verification (not implemented in demo)',
      });
      return;
    }

    const url = await getDownloadUrl(doc.id);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const DocumentCard = ({ doc }: { doc: EmployeeDocument }) => (
    <Card className="hover:shadow-md transition-shadow backdrop-blur-sm bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{doc.file_name}</h3>
              {doc.is_sensitive && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Lock className="w-3 h-3 mr-1" />
                  Sensitive
                </Badge>
              )}
              {doc.signed && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Signed
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {documentTypeLabels[doc.type]}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</span>
              </div>
              {doc.uploaded_by_name && (
                <div>
                  By {doc.uploaded_by_name}
                </div>
              )}
              {doc.version > 1 && (
                <Badge variant="secondary">v{doc.version}</Badge>
              )}
            </div>
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {doc.expires_at && (
              <div className="mt-3 text-sm text-orange-600 dark:text-orange-400">
                ⚠️ Expires on {new Date(doc.expires_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(doc)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => handleDownload(doc)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Documents</h1>
        <p className="text-muted-foreground">
          Access and download all your HR documents
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(documentTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You don\'t have any documents yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
