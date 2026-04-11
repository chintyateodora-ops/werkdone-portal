import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from 'lucide-react';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: { name: string; dueDate: string; dueTime: string }) => void;
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleConfirm = () => {
    if (taskName && dueDate && dueTime) {
      onCreateTask({
        name: taskName,
        dueDate,
        dueTime
      });
      // Reset form
      setTaskName('');
      setDueDate('');
      setDueTime('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setTaskName('');
    setDueDate('');
    setDueTime('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogDescription className="sr-only">
          Create a new task with name and due date
        </DialogDescription>
        
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E9ECEF' }}>
          <DialogTitle style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
            New Task
          </DialogTitle>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="taskName" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
              Task Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="taskName"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          {/* Due Date & Time */}
          <div className="space-y-2">
            <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
              Due Date & Time <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pr-10"
                />
                <Calendar 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                  style={{ color: '#6B7280' }}
                />
              </div>
              <div className="w-32">
                <Input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: '#E9ECEF' }}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!taskName || !dueDate || !dueTime}
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--primary-foreground)',
              opacity: (!taskName || !dueDate || !dueTime) ? 0.5 : 1
            }}
            className="hover:opacity-90"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
