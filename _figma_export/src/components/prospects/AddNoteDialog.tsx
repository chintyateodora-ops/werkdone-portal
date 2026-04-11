import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveNote: (note: string) => void;
}

export function AddNoteDialog({ open, onOpenChange, onSaveNote }: AddNoteDialogProps) {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (note.trim()) {
      onSaveNote(note);
      setNote('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogDescription className="sr-only">
          Add a new note for this prospect
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}>
            Add Note
          </DialogTitle>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="px-6 py-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setNote(e.target.value);
                }
              }}
              rows={15}
              className="resize-none"
            />
            <div className="flex justify-end">
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                {note.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!note.trim()}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
            className="hover:opacity-90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}