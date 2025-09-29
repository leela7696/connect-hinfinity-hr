import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BulkOperations() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV or Excel file",
          variant: "destructive",
        });
        return;
      }
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);

    try {
      // Simulate import process
      const totalSteps = 5;
      
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setImportProgress((i / totalSteps) * 100);
      }

      // Mock results
      const mockResults = {
        total: 150,
        successful: 145,
        failed: 5,
        errors: [
          { row: 12, error: "Invalid email format", email: "invalid-email" },
          { row: 34, error: "Duplicate email address", email: "john@example.com" },
          { row: 67, error: "Missing required field: full_name", email: "jane@example.com" },
          { row: 89, error: "Invalid role specified", email: "bob@example.com" },
          { row: 123, error: "Invalid department", email: "alice@example.com" }
        ]
      };

      setImportResults(mockResults);
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${mockResults.successful} out of ${mockResults.total} users`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during the import process",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      // Mock export data
      const csvData = [
        ['Full Name', 'Email', 'Role', 'Department', 'Position', 'Phone', 'Created At'],
        ['John Doe', 'john@hinfinity.com', 'employee', 'engineering', 'Software Engineer', '+1234567890', '2024-01-15'],
        ['Jane Smith', 'jane@hinfinity.com', 'manager', 'hr', 'HR Manager', '+1234567891', '2024-01-16'],
        ['Bob Johnson', 'bob@hinfinity.com', 'employee', 'finance', 'Accountant', '+1234567892', '2024-01-17'],
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hr_connect_users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "User data has been exported to CSV file",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during the export process",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['full_name', 'email', 'role', 'department', 'position', 'phone'],
      ['John Doe', 'john@example.com', 'employee', 'engineering', 'Software Engineer', '+1234567890'],
      ['Jane Smith', 'jane@example.com', 'manager', 'hr', 'HR Manager', '+1234567891'],
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Users
          </CardTitle>
          <CardDescription>
            Download all user data in CSV or Excel format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExport} className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Exports all user data including profiles, roles, and metadata
          </p>
        </CardContent>
      </Card>

      {/* Import Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Import Users
          </CardTitle>
          <CardDescription>
            Bulk import users from CSV or Excel files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file">Select File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>

            {importFile && (
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  Selected file: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                </AlertDescription>
              </Alert>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Importing users...</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleImport}
                disabled={!importFile || importing}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Importing...' : 'Import Users'}
              </Button>
              
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {importResults && (
            <Alert className={importResults.failed > 0 ? "border-orange-200" : "border-green-200"}>
              <div className="flex items-start space-x-2">
                {importResults.failed > 0 ? (
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="font-medium mb-2">Import Results</div>
                    <div className="space-y-1 text-sm">
                      <div>✅ Successfully imported: {importResults.successful} users</div>
                      {importResults.failed > 0 && (
                        <>
                          <div>❌ Failed to import: {importResults.failed} users</div>
                          <div className="mt-3">
                            <div className="font-medium">Errors:</div>
                            <ul className="list-disc list-inside space-y-1 mt-1">
                              {importResults.errors.map((error: any, index: number) => (
                                <li key={index} className="text-xs">
                                  Row {error.row}: {error.error} ({error.email})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Import Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>CSV files must include headers: full_name, email, role, department, position, phone</li>
              <li>Email addresses must be unique and valid</li>
              <li>Valid roles: admin, hr, manager, employee</li>
              <li>Users will receive an email to set their password</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}