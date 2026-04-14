import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this note instead of creating one. */
  editTarget?: { id: string; content: string } | null;
  onAddNote: (content: string) => void;
  onEditNote?: (id: string, content: string) => void;
}

export function AddNoteDialog({ open, onOpenChange, editTarget, onAddNote, onEditNote }: AddNoteDialogProps) {
  const isEdit = Boolean(editTarget);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setNote(isEdit ? (editTarget?.content ?? '') : '');
    }
  }, [open, isEdit, editTarget?.id, editTarget?.content]);

  const handleSave = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    if (isEdit && editTarget) {
      onEditNote?.(editTarget.id, trimmed);
    } else {
      onAddNote(trimmed);
    }
    setNote('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(48rem,calc(100vw-2rem))] max-w-[48rem] p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogDescription className="sr-only">
          {isEdit ? 'Edit this prospect note' : 'Add a new note for this prospect'}
        </DialogDescription>

        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}>
            {isEdit ? 'Edit note' : 'Add note'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label htmlFor="prospect-note-textarea" className="text-sm font-medium text-gray-900">
              Note
            </label>
            <Textarea
              id="prospect-note-textarea"
              placeholder="Enter your note..."
              value={note}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setNote(e.target.value);
                }
              }}
              rows={12}
              className="resize-y min-h-[200px]"
            />
            <div className="flex justify-end">
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                {note.length}/500
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
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
              fontWeight: 'var(--font-weight-medium)',
            }}
            className="hover:opacity-90"
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
