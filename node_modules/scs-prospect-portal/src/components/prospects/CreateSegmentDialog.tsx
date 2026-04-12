import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { X, ChevronDown, MoreHorizontal, Search } from 'lucide-react';

interface Criterion {
  label?: string;
  color?: string;
  text?: string;
}

interface SegmentData {
  name: string;
  description: string;
  status: string[];
  source: string[];
  gender: string[];
  ageGroup: string[];
  lastContacted: string;
  tag: string[];
}

interface Prospect {
  id: string;
  name: string;
  age: string;
  contact: string;
  email: string;
  status: string;
  source: string;
  sourceDetail: string;
  lastContacted: string;
  assignTo: string;
  tag: string;
  risk: string;
}

interface CreateSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSegment: (segment: {
    name: string;
    criteria: Criterion[];
    population: number;
  }) => void;
  prospects: Prospect[];
  editMode?: boolean;
  initialData?: {
    id?: number;
    name: string;
    description?: string;
    criteria: Criterion[];
    population?: number;
  };
  onUpdateSegment?: (segment: {
    id: number;
    name: string;
    criteria: Criterion[];
    population: number;
  }) => void;
}

export function CreateSegmentDialog({ open, onOpenChange, onCreateSegment, prospects, editMode, initialData, onUpdateSegment }: CreateSegmentDialogProps) {
  const [activeTab, setActiveTab] = useState<'criteria' | 'users'>('criteria');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProspectIds, setSelectedProspectIds] = useState<Set<string>>(new Set());
  
  const parseInitialData = () => {
    if (!editMode || !initialData) {
      return {
        name: '',
        description: '',
        status: [],
        source: [],
        gender: [],
        ageGroup: [],
        lastContacted: '',
        tag: []
      };
    }

    // Parse criteria back to form data
    const status: string[] = [];
    const source: string[] = [];
    const gender: string[] = [];
    const tag: string[] = [];
    let lastContacted = '';

    initialData.criteria.forEach(criterion => {
      if (criterion.label) {
        // This is a status criterion
        status.push(criterion.label.toLowerCase());
      } else if (criterion.text) {
        if (criterion.text.startsWith('Source:')) {
          const sources = criterion.text.replace('Source: ', '').split(', ');
          source.push(...sources);
        } else if (criterion.text.startsWith('Gender:')) {
          const genders = criterion.text.replace('Gender: ', '').split(', ');
          gender.push(...genders);
        } else if (criterion.text.startsWith('Tag:')) {
          const tags = criterion.text.replace('Tag: ', '').split(', ');
          tag.push(...tags);
        } else if (criterion.text.startsWith('Last Contacted:')) {
          lastContacted = criterion.text.replace('Last Contacted: ', '');
        }
      }
    });

    return {
      name: initialData.name || '',
      description: initialData.description || '',
      status,
      source,
      gender,
      ageGroup: [],
      lastContacted,
      tag
    };
  };

  const [segmentData, setSegmentData] = useState<SegmentData>(parseInitialData());

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (open) {
      setSegmentData(parseInitialData());
      setActiveTab('criteria');
      setSearchQuery('');
    }
  }, [open, editMode, initialData]);

  const statusOptions = [
    { value: 'new', label: 'New', color: '#3B82F6' },
    { value: 'contacted', label: 'Contacted', color: '#F97316' },
    { value: 'qualified', label: 'Qualified', color: '#10B981' },
    { value: 'converted', label: 'Converted', color: '#7C51A1' },
    { value: 'dormant', label: 'Dormant', color: '#6B7280' }
  ];

  const sourceOptions = ['Event', 'Campaign', 'Manual'];
  const genderOptions = ['Male', 'Female'];
  const ageGroupOptions = ['18-30', '31-45', '46-60', '60+'];
  const tagOptions = ['Screening', 'PAP Test', 'Waiting Result', 'Abnormal / Follow-up Required'];

  const toggleSelection = (field: keyof SegmentData, value: string) => {
    setSegmentData(prev => {
      const currentArray = prev[field] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const getStatusColor = (status: string) => {
    const statusObj = statusOptions.find(s => s.value === status.toLowerCase());
    return statusObj?.color || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statusOptions.find(s => s.value === status.toLowerCase());
    return statusObj?.label || status;
  };

  // Filter prospects based on criteria
  const matchingProspects = prospects.filter(prospect => {
    // Status filter
    if (segmentData.status.length > 0) {
      const matchesStatus = segmentData.status.some(s => 
        prospect.status.toLowerCase() === s.toLowerCase()
      );
      if (!matchesStatus) return false;
    }

    // Source filter
    if (segmentData.source.length > 0) {
      const matchesSource = segmentData.source.some(s => 
        prospect.source.toLowerCase() === s.toLowerCase()
      );
      if (!matchesSource) return false;
    }

    // Gender filter
    if (segmentData.gender.length > 0) {
      const matchesGender = segmentData.gender.some(g => 
        prospect.age.toLowerCase().includes(g.toLowerCase())
      );
      if (!matchesGender) return false;
    }

    // Tag filter
    if (segmentData.tag.length > 0) {
      const matchesTag = segmentData.tag.some(t => 
        prospect.tag.toLowerCase().includes(t.toLowerCase())
      );
      if (!matchesTag) return false;
    }

    return true;
  });

  const handleNext = () => {
    // Pre-select prospects that match criteria when navigating to Users tab
    const matchingIds = new Set(matchingProspects.map(p => p.id));
    setSelectedProspectIds(matchingIds);
    setActiveTab('users');
  };

  const handlePrevious = () => {
    setActiveTab('criteria');
  };

  const handleCreateSegment = () => {
    // Build criteria array
    const criteria: Criterion[] = [];
    
    segmentData.status.forEach(status => {
      criteria.push({
        label: getStatusLabel(status),
        color: getStatusColor(status)
      });
    });

    if (segmentData.source.length > 0) {
      criteria.push({
        text: `Source: ${segmentData.source.join(', ')}`
      });
    }

    if (segmentData.gender.length > 0) {
      criteria.push({
        text: `Gender: ${segmentData.gender.join(', ')}`
      });
    }

    if (segmentData.tag.length > 0) {
      criteria.push({
        text: `Tag: ${segmentData.tag.join(', ')}`
      });
    }

    if (segmentData.lastContacted) {
      criteria.push({
        text: `Last Contacted: ${segmentData.lastContacted}`
      });
    }

    onCreateSegment({
      name: segmentData.name || 'Untitled Segment',
      criteria,
      population: selectedProspectIds.size
    });

    // Reset form
    setSegmentData({
      name: '',
      description: '',
      status: [],
      source: [],
      gender: [],
      ageGroup: [],
      lastContacted: '',
      tag: []
    });
    setSelectedProspectIds(new Set());
    setSearchQuery('');
    setActiveTab('criteria');
    onOpenChange(false);
  };

  const handleUpdateSegment = () => {
    // Build criteria array
    const criteria: Criterion[] = [];
    
    segmentData.status.forEach(status => {
      criteria.push({
        label: getStatusLabel(status),
        color: getStatusColor(status)
      });
    });

    if (segmentData.source.length > 0) {
      criteria.push({
        text: `Source: ${segmentData.source.join(', ')}`
      });
    }

    if (segmentData.gender.length > 0) {
      criteria.push({
        text: `Gender: ${segmentData.gender.join(', ')}`
      });
    }

    if (segmentData.tag.length > 0) {
      criteria.push({
        text: `Tag: ${segmentData.tag.join(', ')}`
      });
    }

    if (segmentData.lastContacted) {
      criteria.push({
        text: `Last Contacted: ${segmentData.lastContacted}`
      });
    }

    onUpdateSegment && onUpdateSegment({
      id: initialData?.id || 0,
      name: segmentData.name || 'Untitled Segment',
      criteria,
      population: selectedProspectIds.size
    });

    // Reset form
    setSegmentData({
      name: '',
      description: '',
      status: [],
      source: [],
      gender: [],
      ageGroup: [],
      lastContacted: '',
      tag: []
    });
    setSelectedProspectIds(new Set());
    setSearchQuery('');
    setActiveTab('criteria');
    onOpenChange(false);
  };

  // Search filtering - searches ALL prospects
  const searchFilteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle individual prospect selection
  const toggleProspectSelection = (prospectId: string) => {
    setSelectedProspectIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(prospectId)) {
        newSet.delete(prospectId);
      } else {
        newSet.add(prospectId);
      }
      return newSet;
    });
  };

  // Toggle all visible prospects
  const toggleAllVisible = () => {
    const allVisibleIds = searchFilteredProspects.map(p => p.id);
    const allSelected = allVisibleIds.every(id => selectedProspectIds.has(id));
    
    if (allSelected) {
      // Deselect all visible
      setSelectedProspectIds(prev => {
        const newSet = new Set(prev);
        allVisibleIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      // Select all visible
      setSelectedProspectIds(prev => {
        const newSet = new Set(prev);
        allVisibleIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  };

  const getTagStyle = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('low risk')) {
      return { backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' };
    } else if (lowerTag.includes('medium risk')) {
      return { backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' };
    } else if (lowerTag.includes('high risk')) {
      return { backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' };
    } else {
      return { backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogDescription className="sr-only">
          Configure segment criteria and view matching users
        </DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}>
            {editMode ? 'Edit Segment' : 'Create Segment'}
          </DialogTitle>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('criteria')}
              className="py-3 px-4 border-b-2 transition-colors"
              style={{
                borderColor: activeTab === 'criteria' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'criteria' ? 'var(--primary)' : 'var(--muted-foreground)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              Criteria
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="py-3 px-4 border-b-2 transition-colors"
              style={{
                borderColor: activeTab === 'users' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'users' ? 'var(--primary)' : 'var(--muted-foreground)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              List of Users
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'criteria' ? (
            <div className="px-6 py-6 space-y-6">
              {/* Segment Name */}
              <div className="space-y-2">
                <Label htmlFor="segmentName" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                  Segment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="segmentName"
                  placeholder="Enter segment name"
                  value={segmentData.name}
                  onChange={(e) => setSegmentData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  rows={3}
                  value={segmentData.description}
                  onChange={(e) => setSegmentData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Criteria Section */}
              <div className="space-y-4">
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Criteria
                </h3>

                {/* Status */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Status
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status.value}
                        onClick={() => toggleSelection('status', status.value)}
                        className="px-3 py-2 rounded border transition-colors"
                        style={{
                          backgroundColor: segmentData.status.includes(status.value) ? 'var(--primary)' : 'white',
                          borderColor: segmentData.status.includes(status.value) ? 'var(--primary)' : '#CED4DA',
                          color: segmentData.status.includes(status.value) ? 'white' : '#272B30',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Source
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {sourceOptions.map(source => (
                      <button
                        key={source}
                        onClick={() => toggleSelection('source', source)}
                        className="px-3 py-2 rounded border transition-colors"
                        style={{
                          backgroundColor: segmentData.source.includes(source) ? 'var(--primary)' : 'white',
                          borderColor: segmentData.source.includes(source) ? 'var(--primary)' : '#CED4DA',
                          color: segmentData.source.includes(source) ? 'white' : '#272B30',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Gender
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map(gender => (
                      <button
                        key={gender}
                        onClick={() => toggleSelection('gender', gender)}
                        className="px-3 py-2 rounded border transition-colors"
                        style={{
                          backgroundColor: segmentData.gender.includes(gender) ? 'var(--primary)' : 'white',
                          borderColor: segmentData.gender.includes(gender) ? 'var(--primary)' : '#CED4DA',
                          color: segmentData.gender.includes(gender) ? 'white' : '#272B30',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Group */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Age Group
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ageGroupOptions.map(age => (
                      <button
                        key={age}
                        onClick={() => toggleSelection('ageGroup', age)}
                        className="px-3 py-2 rounded border transition-colors"
                        style={{
                          backgroundColor: segmentData.ageGroup.includes(age) ? 'var(--primary)' : 'white',
                          borderColor: segmentData.ageGroup.includes(age) ? 'var(--primary)' : '#CED4DA',
                          color: segmentData.ageGroup.includes(age) ? 'white' : '#272B30',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last Contacted */}
                <div className="space-y-2">
                  <Label htmlFor="lastContacted" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Last Contacted
                  </Label>
                  <Input
                    id="lastContacted"
                    placeholder="e.g., Within 30 days, >60 days ago"
                    value={segmentData.lastContacted}
                    onChange={(e) => setSegmentData(prev => ({ ...prev, lastContacted: e.target.value }))}
                  />
                </div>

                {/* Tag */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}>
                    Tag
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleSelection('tag', tag)}
                        className="px-3 py-2 rounded border transition-colors"
                        style={{
                          backgroundColor: segmentData.tag.includes(tag) ? 'var(--primary)' : 'white',
                          borderColor: segmentData.tag.includes(tag) ? 'var(--primary)' : '#CED4DA',
                          color: segmentData.tag.includes(tag) ? 'white' : '#272B30',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-6">
              {/* Search Bar and Count */}
              <div className="mb-4 space-y-4">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search prospects by name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary)' }}>
                  {selectedProspectIds.size} Selected ({matchingProspects.length} matching criteria)
                </div>
              </div>

              {/* Users Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <Checkbox
                            checked={searchFilteredProspects.length > 0 && searchFilteredProspects.every(p => selectedProspectIds.has(p.id))}
                            onCheckedChange={toggleAllVisible}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Prospect ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Prospect Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Tag
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchFilteredProspects.length > 0 ? (
                        searchFilteredProspects.map((prospect, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Checkbox
                                checked={selectedProspectIds.has(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                              />
                            </td>
                            <td className="px-6 py-4" style={{ 
                              color: 'var(--primary)',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-normal)'
                            }}>
                              {prospect.id}
                            </td>
                            <td className="px-6 py-4">
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#111827'
                              }}>
                                {prospect.name}
                              </div>
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#6B7280'
                              }}>
                                {prospect.age}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#111827'
                              }}>
                                {prospect.contact}
                              </div>
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#6B7280'
                              }}>
                                {prospect.email}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2" style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#111827'
                              }}>
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: getStatusColor(prospect.status) }}
                                />
                                {prospect.status}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#111827'
                              }}>
                                {prospect.source}
                              </div>
                              <div style={{ 
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)',
                                color: '#6B7280'
                              }}>
                                {prospect.sourceDetail}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                <span 
                                  className="inline-flex items-center px-2 py-1 rounded"
                                  style={{
                                    ...getTagStyle(prospect.tag),
                                    fontSize: 'var(--text-label)',
                                    fontWeight: 'var(--font-weight-normal)'
                                  }}
                                >
                                  {prospect.tag}
                                </span>
                                {prospect.risk && (
                                  <span 
                                    className="inline-flex items-center px-2 py-1 rounded"
                                    style={{
                                      ...getTagStyle(prospect.risk),
                                      fontSize: 'var(--text-label)',
                                      fontWeight: 'var(--font-weight-normal)'
                                    }}
                                  >
                                    {prospect.risk}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No prospects found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          {activeTab === 'criteria' ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleNext}
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                className="hover:opacity-90"
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button 
                onClick={editMode ? handleUpdateSegment : handleCreateSegment}
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                className="hover:opacity-90"
                disabled={!segmentData.name}
              >
                {editMode ? 'Update Segment' : 'Create Segment'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}