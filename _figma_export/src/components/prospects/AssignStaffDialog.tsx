import { useState } from 'react';
import { Button } from '../ui/button';
import { X, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface AssignStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospectId: string;
  prospectName: string;
  currentAssignedStaff?: string[];
  onAssignStaff: (staffNames: string[]) => void;
}

const staffMembers = [
  'Jasmine Lim',
  'Fan Wei Zhe',
  'Nurul Azizah',
  'Rachel Hou',
  'Thong Han',
  'Sarah Chen',
  'Michael Wong'
];

export function AssignStaffDialog({ 
  open, 
  onOpenChange, 
  prospectId, 
  prospectName,
  currentAssignedStaff,
  onAssignStaff 
}: AssignStaffDialogProps) {
  const [selectedStaff, setSelectedStaff] = useState<string[]>(currentAssignedStaff || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleStaff = (staffName: string) => {
    if (selectedStaff.includes(staffName)) {
      setSelectedStaff(selectedStaff.filter(s => s !== staffName));
    } else {
      setSelectedStaff([...selectedStaff, staffName]);
    }
  };

  const handleRemoveStaff = (staffName: string) => {
    setSelectedStaff(selectedStaff.filter(s => s !== staffName));
  };

  const handleSubmit = () => {
    if (selectedStaff.length > 0) {
      onAssignStaff(selectedStaff);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedStaff(currentAssignedStaff || []);
    onOpenChange(false);
  };

  // Get available staff (not already selected)
  const availableStaff = staffMembers.filter(staff => !selectedStaff.includes(staff));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogTitle className="sr-only">Assign Staff</DialogTitle>
        <DialogDescription className="sr-only">
          Assign a staff member to this prospect
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)'
          }}>
            Assign Staff
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Prospect ID */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              display: 'block',
              marginBottom: '8px'
            }}>
              Prospect ID
            </label>
            <div 
              className="px-3 py-2 rounded"
              style={{ 
                backgroundColor: '#F8F9FA',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            >
              {prospectId}
            </div>
          </div>

          {/* Prospect Name */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              display: 'block',
              marginBottom: '8px'
            }}>
              Prospect Name
            </label>
            <div 
              className="px-3 py-2 rounded"
              style={{ 
                backgroundColor: '#F8F9FA',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            >
              {prospectName}
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              display: 'block',
              marginBottom: '8px'
            }}>
              Assigned Staff*
            </label>
            
            {/* Dropdown to select staff with checkboxes */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full flex items-center justify-between px-3 py-2 rounded"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CED4DA',
                    fontSize: 'var(--text-sm)',
                    color: selectedStaff.length > 0 ? '#272B30' : '#4F575E',
                    cursor: 'pointer'
                  }}
                >
                  <span>
                    {selectedStaff.length > 0 
                      ? `${selectedStaff.length} staff selected` 
                      : 'Select Staff'}
                  </span>
                  <ChevronDown className="w-4 h-4" style={{ color: '#4F575E' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                <div className="p-2">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff}
                      className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleToggleStaff(staff)}
                    >
                      <Checkbox
                        checked={selectedStaff.includes(staff)}
                        onCheckedChange={() => handleToggleStaff(staff)}
                      />
                      <label
                        className="flex-1 cursor-pointer"
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {staff}
                      </label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Selected staff tags */}
            {selectedStaff.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedStaff.map((staff) => (
                  <div
                    key={staff}
                    className="flex items-center gap-2 px-3 py-1.5 rounded"
                    style={{
                      backgroundColor: '#E2D8ED',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <span>{staff}</span>
                    <button
                      onClick={() => handleRemoveStaff(staff)}
                      className="hover:opacity-70 transition-opacity"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedStaff.length === 0}
            style={{ 
              backgroundColor: selectedStaff.length > 0 ? 'var(--primary)' : undefined,
              color: selectedStaff.length > 0 ? 'var(--primary-foreground)' : undefined
            }}
            className="hover:opacity-90"
          >
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}