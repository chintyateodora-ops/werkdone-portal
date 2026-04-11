import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';

// Tag and Category data from Prospect Configuration
const mockTags = [
  {
    id: 1,
    name: 'Low Risk',
    category: 'Risk',
    active: true,
    color: '#D1FAE5',
    textColor: '#059669',
    borderColor: '#A7F3D0'
  },
  {
    id: 2,
    name: 'Medium Risk',
    category: 'Risk',
    active: true,
    color: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FDE68A'
  },
  {
    id: 3,
    name: 'High Risk',
    category: 'Risk',
    active: true,
    color: '#FEE2E2',
    textColor: '#DC2626',
    borderColor: '#FECACA'
  },
  {
    id: 4,
    name: 'No Risk',
    category: 'Risk',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 5,
    name: 'Screening',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 6,
    name: 'Waiting Result',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 7,
    name: 'PAP Test',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 8,
    name: 'Abnormal / Follow-up Required',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
];

const mockCategories = [
  { id: 1, name: 'Screening Stage' },
  { id: 2, name: 'Risk' }
];

interface Tag {
  id: number;
  name: string;
  category: string;
  color: string;
  textColor: string;
  borderColor: string;
}

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTags: Tag[];
  onAddTags: (tags: Tag[]) => void;
}

export function AddTagDialog({ open, onOpenChange, currentTags, onAddTags }: AddTagDialogProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(currentTags);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');

  // Filter tags by selected category and active status
  const availableTags = selectedCategory
    ? mockTags.filter(tag => tag.category === selectedCategory && tag.active)
    : [];

  const handleAddTag = () => {
    if (!selectedTagId) return;

    const tagToAdd = mockTags.find(tag => tag.id === Number(selectedTagId));
    if (tagToAdd && !selectedTags.find(t => t.id === tagToAdd.id)) {
      setSelectedTags([...selectedTags, tagToAdd]);
      setSelectedTagId('');
      setSelectedCategory('');
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleConfirm = () => {
    onAddTags(selectedTags);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedTags(currentTags);
    setSelectedCategory('');
    setSelectedTagId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
            Add Tags
          </DialogTitle>
          <DialogDescription style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>
            Select tags to assign to this prospect.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Tags Section */}
          <div>
            <label style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-medium)',
              color: '#374151'
            }} className="block mb-2">
              Current Tags
            </label>
            <div className="min-h-[60px] p-3 border rounded-md bg-gray-50" style={{ borderColor: '#CED4DA' }}>
              {selectedTags.length === 0 ? (
                <span style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>
                  No tags assigned
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        borderRadius: '4px',
                        backgroundColor: tag.color,
                        color: tag.textColor,
                        border: '1px solid ' + tag.borderColor,
                        fontSize: 'var(--text-label)',
                        fontWeight: 'var(--font-weight-normal)'
                      }}
                    >
                      {tag.name}
                      <button
                        onClick={() => handleRemoveTag(tag.id)}
                        className="ml-1 hover:opacity-70"
                        style={{ marginLeft: '4px' }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tag Category Dropdown */}
          <div>
            <label style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-medium)',
              color: '#374151'
            }} className="block mb-2">
              Tag Category
            </label>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedTagId('');
            }}>
              <SelectTrigger 
                className="w-full"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA'
                }}
              >
                <SelectValue placeholder="Select category" style={{ color: '#4F575E' }} />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Dropdown */}
          <div>
            <label style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-medium)',
              color: '#374151'
            }} className="block mb-2">
              Tag
            </label>
            <div className="flex gap-2">
              <Select 
                value={selectedTagId} 
                onValueChange={setSelectedTagId}
                disabled={!selectedCategory}
              >
                <SelectTrigger 
                  className="flex-1"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CED4DA'
                  }}
                >
                  <SelectValue placeholder="Select tag" style={{ color: '#4F575E' }} />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem 
                      key={tag.id} 
                      value={String(tag.id)}
                      disabled={selectedTags.some(t => t.id === tag.id)}
                    >
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddTag}
                disabled={!selectedTagId}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                className="hover:opacity-90"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E9ECEF' }}>
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{
              borderColor: '#CED4DA',
              color: '#374151',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
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