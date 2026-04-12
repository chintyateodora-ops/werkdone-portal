import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, Download } from 'lucide-react';

interface ImportProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportProspectDialog({ open, onOpenChange }: ImportProspectDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.xls')) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    // Handle file upload logic here
    console.log('Uploading file:', selectedFile);
    onOpenChange(false);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogDescription className="sr-only">
          Import prospects from an Excel file
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}>
            Import Prospect
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-4">
          {/* Download Template Link */}
          <div>
            <button 
              className="inline-flex items-center gap-2 hover:underline"
              style={{ 
                color: 'var(--primary)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-normal)'
              }}
              onClick={() => {
                // Handle template download
                console.log('Downloading template');
              }}
            >
              <Download className="w-4 h-4" />
              Download XLS template
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <p style={{ 
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-normal)',
              color: '#111827'
            }}>
              For contacts with Singapore contact numbers, please add the dial code (+65) in front of the mobile number. (e.g. +6591234567).
            </p>
            <p style={{ 
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-normal)',
              color: '#111827'
            }}>
              For contacts with non-Singapore mobile numbers, please add the respective country's dial code in front of the mobile number (e.g. +60123456789 for Malaysia).
            </p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
            style={{
              borderColor: isDragging ? 'var(--primary)' : '#CED4DA',
              backgroundColor: isDragging ? '#F8F5FB' : '#FAFAFA'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2"
                  style={{ backgroundColor: '#E2D8ED' }}
                >
                  <Upload className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <p style={{ 
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#111827'
                }}>
                  {selectedFile.name}
                </p>
                <p style={{ 
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: '#6B7280'
                }}>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--primary)'
                  }}
                  className="hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full"
                  style={{ backgroundColor: '#E2D8ED' }}
                >
                  <Upload className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="space-y-2">
                  <p style={{ 
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-normal)',
                    color: '#111827'
                  }}>
                    Drag and drop your file here or
                  </p>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".xls,.xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        type="button"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        style={{ 
                          backgroundColor: 'var(--primary)', 
                          color: 'var(--primary-foreground)' 
                        }}
                        className="hover:opacity-90"
                      >
                        Upload File
                      </Button>
                    </label>
                  </div>
                </div>
                <p style={{ 
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: '#6B7280'
                }}>
                  Supported format: .xls (Max. file size: 2 MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            className="hover:opacity-90"
            disabled={!selectedFile}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
