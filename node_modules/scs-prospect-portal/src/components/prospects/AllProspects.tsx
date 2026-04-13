import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Plus, ChevronDown, MoreHorizontal, Filter, List, LayoutGrid, CheckCircle, Circle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Page } from '../../App';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { encodeProspectRecordRef, formatProspectIdentifier } from '../../lib/prospectRef';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';

function formatScreeningFormSubmittedDate(iso: string | undefined): string {
  if (iso == null || String(iso).trim() === '') return '—';
  const t = new Date(`${String(iso).trim()}T12:00:00`).getTime();
  if (Number.isNaN(t)) return '—';
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Same labels as prospect detail Risk Assessment (`riskLevel`) → list/kanban copy. */
function riskLevelTagFromAssessment(level: string | undefined): string {
  const s = (level || '').trim();
  if (s === 'High') return 'High Risk';
  if (s === 'Medium') return 'Medium Risk';
  if (s === 'Low') return 'Low Risk';
  return '—';
}

type ProgramFilter = 'all' | 'mammobus' | 'hpv' | 'fit';
type ViewMode = 'table' | 'kanban';

const PROSPECTS_VIEW_MODE_STORAGE_KEY = 'werkdone-prospects-view-mode';

function readStoredViewMode(): ViewMode {
  try {
    const raw = localStorage.getItem(PROSPECTS_VIEW_MODE_STORAGE_KEY);
    if (raw === 'table' || raw === 'kanban') return raw;
  } catch {
    /* private mode / unavailable */
  }
  return 'table';
}

interface AllProspectsProps {
  onNavigate: (page: Page) => void;
  programFilter: ProgramFilter;
}

export function AllProspects({ onNavigate, programFilter }: AllProspectsProps) {
  const { orderedProspects: masterProspects } = useIndividualProfiles();

  const [viewMode, setViewMode] = useState<ViewMode>(readStoredViewMode);

  useEffect(() => {
    try {
      localStorage.setItem(PROSPECTS_VIEW_MODE_STORAGE_KEY, viewMode);
    } catch {
      /* ignore */
    }
  }, [viewMode]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [currentProgramFilter, setCurrentProgramFilter] = useState<ProgramFilter>(programFilter);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showAddProspectDropdown, setShowAddProspectDropdown] = useState(false);
  
  const stages = ['Enquiring', 'Qualified', 'Booked', 'Screened'];

  const formTypes = [
    { value: 'mammobus' as const, label: 'Community Mammobus Programme' },
    { value: 'hpv' as const, label: 'HPV Screening Programme' },
    { value: 'fit' as const, label: 'FIT Screening Programme' },
  ];

  // Get title based on current program filter
  const getTitle = () => {
    switch (currentProgramFilter) {
      case 'all':
        return 'All Prospects';
      case 'mammobus':
        return 'Mammobus Prospects';
      case 'hpv':
        return 'HPV Prospects';
      case 'fit':
        return 'FIT Prospects';
      default:
        return 'All Prospects';
    }
  };

  // Get program badge label
  const getProgramLabel = (program: string) => {
    switch (program) {
      case 'mammobus':
        return 'Mammobus';
      case 'hpv':
        return 'HPV';
      case 'fit':
        return 'FIT';
      default:
        return program;
    }
  };

  // Get program badge color
  const getProgramColor = (program: string) => {
    switch (program) {
      case 'mammobus':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'hpv':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'fit':
        return { bg: '#D1FAE5', text: '#059669' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  // Filter prospects based on program and expand for multiple programs
  const getFilteredProspects = () => {
    let prospects = masterProspects;

    // Filter by program
    if (currentProgramFilter !== 'all') {
      prospects = prospects.filter(p => p.programs.includes(currentProgramFilter));
    }

    // For "All Prospects", create separate rows for each program enrollment
    if (currentProgramFilter === 'all') {
      const expandedProspects: any[] = [];
      prospects.forEach(prospect => {
        prospect.programs.forEach(program => {
          expandedProspects.push({
            ...prospect,
            currentProgram: program
          });
        });
      });
      prospects = expandedProspects;
    } else {
      // For specific program, set currentProgram to the filter
      prospects = prospects.map(p => ({ ...p, currentProgram: currentProgramFilter }));
    }

    // Filter by search
    if (searchQuery) {
      prospects = prospects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contact.includes(searchQuery)
      );
    }

    // Filter by selected stages (only for table view)
    if (viewMode === 'table' && selectedStages.length > 0) {
      prospects = prospects.filter(p => selectedStages.includes(p.status));
    }

    return prospects;
  };

  const filteredProspects = getFilteredProspects();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unaware':
        return '#9CA3AF';
      case 'Aware':
        return '#3B82F6';
      case 'Enquiring':
        return '#F97316';
      case 'Qualified':
        return '#8B5CF6';
      case 'Booked':
        return '#10B981';
      case 'Screened':
        return '#7C51A1';
      default:
        return '#6B7280';
    }
  };

  const handleProgramChange = (program: ProgramFilter) => {
    setCurrentProgramFilter(program);
    setShowProgramDropdown(false);
    // Navigate to the corresponding page
    const pageMap: Record<ProgramFilter, Page> = {
      all: 'all-prospects',
      mammobus: 'mammobus-prospects',
      hpv: 'hpv-prospects',
      fit: 'fit-prospects'
    };
    onNavigate(pageMap[program]);
  };

  const toggleStageFilter = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="max-w-full mx-auto p-6">
          {/* Header with dropdown title */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className="flex items-center gap-2 hover:opacity-70"
              >
                <h1 style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#111827'
                }}>
                  {getTitle()}
                </h1>
                <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
              
              {showProgramDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border z-10"
                  style={{ borderColor: '#E5E7EB', minWidth: '200px' }}
                >
                  <button
                    onClick={() => handleProgramChange('all')}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: currentProgramFilter === 'all' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                      color: currentProgramFilter === 'all' ? 'var(--primary)' : '#374151'
                    }}
                  >
                    All Prospects
                  </button>
                  <button
                    onClick={() => handleProgramChange('mammobus')}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: currentProgramFilter === 'mammobus' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                      color: currentProgramFilter === 'mammobus' ? 'var(--primary)' : '#374151'
                    }}
                  >
                    Mammobus Prospects
                  </button>
                  <button
                    onClick={() => handleProgramChange('hpv')}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: currentProgramFilter === 'hpv' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                      color: currentProgramFilter === 'hpv' ? 'var(--primary)' : '#374151'
                    }}
                  >
                    HPV Prospects
                  </button>
                  <button
                    onClick={() => handleProgramChange('fit')}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: currentProgramFilter === 'fit' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                      color: currentProgramFilter === 'fit' ? 'var(--primary)' : '#374151'
                    }}
                  >
                    FIT Prospects
                  </button>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setShowAddProspectDropdown(!showAddProspectDropdown)}
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Prospect
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {formTypes.map((formType) => (
                  <DropdownMenuItem
                    key={formType.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate({ page: 'add-prospect', program: formType.value });
                    }}
                  >
                    {formType.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Search, Filter, and View Switcher */}
          <div className="flex items-center gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
              <Input
                placeholder="Search prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{
                  fontSize: 'var(--text-sm)',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA'
                }}
              />
            </div>

            {/* Stage Filter - Only for table view */}
            {viewMode === 'table' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Stages
                    {selectedStages.length > 0 && (
                      <Badge
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          fontSize: 'var(--text-xs)'
                        }}
                      >
                        {selectedStages.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {stages.map(stage => (
                    <DropdownMenuCheckboxItem
                      key={stage}
                      checked={selectedStages.includes(stage)}
                      onCheckedChange={() => toggleStageFilter(stage)}
                    >
                      {stage}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedStages.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedStages([])}>
                        Clear Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-white border rounded-lg p-1" style={{ borderColor: '#E5E7EB' }}>
              <button
                onClick={() => setViewMode('table')}
                className="p-2 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'table' ? '#F3F4F6' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : '#6B7280'
                }}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className="p-2 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'kanban' ? '#F3F4F6' : 'transparent',
                  color: viewMode === 'kanban' ? 'var(--primary)' : '#6B7280'
                }}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Identifier
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Name
                      </th>
                      {currentProgramFilter === 'all' && (
                        <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Program
                        </th>
                      )}
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Date registered
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Contact
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Source
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Next review
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Assigned To
                      </th>
                      <th className="text-left p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Risk
                      </th>
                      <th className="text-right p-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProspects.map((prospect, index) => {
                      const programColor = getProgramColor(prospect.currentProgram || prospect.programs[0]);
                      return (
                        <tr
                          key={`${prospect.nric}-${prospect.currentProgram || index}`}
                          className="border-t cursor-pointer hover:bg-gray-50"
                          style={{ borderColor: '#E5E7EB' }}
                          onClick={() =>
                            onNavigate({
                              page: 'prospect-detail',
                              prospectRef: encodeProspectRecordRef(prospect.recordId),
                            })
                          }
                        >
                          <td className="p-4">
                            <span 
                              style={{ 
                                fontSize: 'var(--text-sm)', 
                                fontWeight: 'var(--font-weight-medium)', 
                                color: 'var(--primary)',
                                cursor: 'pointer'
                              }}
                              className="hover:underline"
                            >
                              {formatProspectIdentifier(prospect.name, prospect.maskedNric)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5 items-start min-w-0">
                              <a
                                href="#"
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--primary)',
                                  textDecoration: 'none'
                                }}
                                className="hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onNavigate({
                                    page: 'prospect-detail',
                                    prospectRef: encodeProspectRecordRef(prospect.recordId),
                                  });
                                }}
                              >
                                {prospect.name}
                              </a>
                              <div
                                style={{
                                  fontSize: '0.8125rem',
                                  lineHeight: 1.35,
                                  color: '#6B7280',
                                  fontWeight: 'var(--font-weight-normal)'
                                }}
                              >
                                {prospect.maskedNric} , {prospect.gender}, {prospect.age}
                              </div>
                            </div>
                          </td>
                          {currentProgramFilter === 'all' && (
                            <td className="p-4">
                              <span
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: '#111827'
                                }}
                              >
                                {getProgramLabel(prospect.currentProgram || prospect.programs[0])}
                              </span>
                            </td>
                          )}
                          <td className="p-4">
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#111827' }}>
                              {formatScreeningFormSubmittedDate(prospect.dateRegistered)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>
                              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#111827' }}>
                                {prospect.contact}
                              </div>
                              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                                {prospect.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className="px-2 py-1 rounded"
                              style={{
                                backgroundColor: getStatusColor(prospect.status) + '20',
                                color: getStatusColor(prospect.status),
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-medium)'
                              }}
                            >
                              {prospect.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>
                              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#111827' }}>
                                {prospect.source}
                              </div>
                              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                                {prospect.sourceDetail}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#111827' }}>
                              {formatScreeningFormSubmittedDate(prospect.nextReview)}
                            </span>
                          </td>
                          <td className="p-4">
                            {prospect.assignTo.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {prospect.assignTo.map(staff => (
                                  <span
                                    key={staff}
                                    className="px-2 py-0.5 rounded text-xs"
                                    style={{
                                      backgroundColor: '#F3F4F6',
                                      color: '#374151',
                                      fontSize: 'var(--text-xs)',
                                      fontWeight: 'var(--font-weight-normal)'
                                    }}
                                  >
                                    {staff}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#9CA3AF' }}>
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#111827' }}>
                              {riskLevelTagFromAssessment(prospect.riskLevel)}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreHorizontal className="w-4 h-4" style={{ color: '#6B7280' }} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate({
                                    page: 'prospect-detail',
                                    prospectRef: encodeProspectRecordRef(prospect.recordId),
                                  });
                                }}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  Add Tag
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  Log Contact
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {stages.map(stage => {
                const stageProspects = filteredProspects.filter(p => p.status === stage);
                const stageColor = getStatusColor(stage);
                
                return (
                  <div
                    key={stage}
                    className="flex-shrink-0 rounded-xl p-3"
                    style={{ 
                      width: '300px',
                      backgroundColor: stageColor + '10' // Light tint background
                    }}
                  >
                    {/* Stage Header Pill */}
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: stageColor + '20',
                          border: `1px solid ${stageColor}30`
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: stageColor }}
                        />
                        <span style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}>
                          {stage}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'white',
                            color: stageColor,
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-semibold)',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}
                        >
                          {stageProspects.length}
                        </span>
                      </div>
                    </div>

                    {/* Prospect Cards */}
                    <div className="space-y-2">
                      {stageProspects.map((prospect, index) => {
                        const programColor = getProgramColor(prospect.currentProgram || prospect.programs[0]);
                        const completionPercentage = Math.round((prospect.tasksCompleted / prospect.tasksTotal) * 100);
                        
                        return (
                          <div
                            key={`${prospect.nric}-${prospect.currentProgram || index}`}
                            className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                            style={{ borderColor: '#E5E7EB' }}
                            onClick={() =>
                              onNavigate({
                                page: 'prospect-detail',
                                prospectRef: encodeProspectRecordRef(prospect.recordId),
                              })
                            }
                          >
                            {/* Status Chip - Top */}
                            <div className="mb-4">
                              {currentProgramFilter === 'all' ? (
                                <span
                                  className="inline-block px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: programColor.bg,
                                    color: programColor.text,
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-weight-medium)'
                                  }}
                                >
                                  {getProgramLabel(prospect.currentProgram || prospect.programs[0])}
                                </span>
                              ) : (
                                <span
                                  className="inline-block px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: stageColor + '15',
                                    color: stageColor,
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-weight-medium)'
                                  }}
                                >
                                  {formatProspectIdentifier(prospect.name, prospect.maskedNric)}
                                </span>
                              )}
                            </div>

                            {/* Name */}
                            <h4 style={{
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: '#111827',
                              marginBottom: '16px'
                            }}>
                              {prospect.name}
                            </h4>

                            {/* Age and Residential Status */}
                            <div style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-normal)',
                              color: '#9CA3AF',
                              marginBottom: '16px'
                            }}>
                              {prospect.age} · {prospect.residentialStatus} ·{' '}
                              {riskLevelTagFromAssessment(prospect.riskLevel)}
                            </div>

                            {/* Task Progress Bar */}
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                                  Tasks
                                </span>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: '#111827' }}>
                                  {prospect.tasksCompleted}/{prospect.tasksTotal}
                                </span>
                              </div>
                              <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#E5E7EB' }}>
                                <div
                                  className="h-1.5 rounded-full transition-all"
                                  style={{
                                    width: `${completionPercentage}%`,
                                    backgroundColor: completionPercentage === 100 ? '#10B981' : stageColor
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}