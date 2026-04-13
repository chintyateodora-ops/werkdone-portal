import { useState } from 'react';
import { Page } from '../../App';
import type { MockProspectListRow } from '../../data/mockProspectsList';
import { encodeProspectRecordRef, formatProspectIdentifier } from '../../lib/prospectRef';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';
import { Search, Filter, Plus, MoreHorizontal, UserPlus, MessageSquare, Tag, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ScreeningProgramsProps {
  onNavigate: (page: Page) => void;
}

type ProgramType = 'mammobus' | 'hpv' | 'fit';

export function ScreeningPrograms({ onNavigate }: ScreeningProgramsProps) {
  const { orderedProspects: MOCK_PROSPECTS } = useIndividualProfiles();
  const [activeProgram, setActiveProgram] = useState<ProgramType>('mammobus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);

  const mapProgramRow = (
    p: MockProspectListRow,
    program: string,
    tag: string,
    bookingDate: string,
    location: string
  ) => {
    const prospectRef = encodeProspectRecordRef(p.recordId);
    return {
      prospectRef,
      selectionKey: prospectRef,
      displayId: formatProspectIdentifier(p.name, p.maskedNric),
      name: p.name,
      age: `${p.gender}, ${p.age}`,
      contact: p.contact,
      email: p.email,
      status: p.status,
      program,
      bookingDate,
      location,
      assignTo: p.assignTo,
      tag,
      risk: `${p.riskLevel} Risk`,
    };
  };

  const mammobusProspects = MOCK_PROSPECTS.filter((x) => x.programs.includes('mammobus')).map((p) =>
    mapProgramRow(
      p,
      'Mammobus',
      'Screening',
      p.status === 'Booked' ? '15 Nov 2025' : p.status === 'Screened' ? '10 Nov 2025' : '—',
      p.status === 'Booked' ? 'Bedok Community Centre' : p.status === 'Screened' ? 'Tampines Hub' : '—'
    )
  );

  const hpvProspects = MOCK_PROSPECTS.filter((x) => x.programs.includes('hpv')).map((p) =>
    mapProgramRow(
      p,
      'HPV',
      'PAP Test',
      p.status === 'Booked' ? '18 Nov 2025' : '—',
      p.status === 'Booked' ? 'SCS Health Center' : '—'
    )
  );

  const fitProspects = MOCK_PROSPECTS.filter((x) => x.programs.includes('fit')).map((p) =>
    mapProgramRow(
      p,
      'FIT',
      'Screening',
      p.status === 'Booked' ? '20 Nov 2025' : p.status === 'Screened' ? '12 Nov 2025' : '—',
      p.status === 'Booked' || p.status === 'Screened' ? 'Home Collection' : '—'
    )
  );

  const getCurrentProspects = () => {
    switch (activeProgram) {
      case 'mammobus':
        return mammobusProspects;
      case 'hpv':
        return hpvProspects;
      case 'fit':
        return fitProspects;
      default:
        return [];
    }
  };

  const menuItems = [
    { id: 'mammobus' as ProgramType, label: 'Mammobus', count: mammobusProspects.length },
    { id: 'hpv' as ProgramType, label: 'HPV Screening', count: hpvProspects.length },
    { id: 'fit' as ProgramType, label: 'FIT (Fecal Immunochemical Test)', count: fitProspects.length }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Screened':
        return {
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          borderColor: '#A7F3D0'
        };
      case 'Booked':
        return {
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          borderColor: '#BFDBFE'
        };
      case 'Qualified':
        return {
          backgroundColor: '#E0E7FF',
          color: '#3730A3',
          borderColor: '#C7D2FE'
        };
      case 'Enquiring':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          borderColor: '#FDE68A'
        };
      case 'Aware':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          borderColor: '#FCA5A5'
        };
      case 'Unaware':
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          borderColor: '#E5E7EB'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          borderColor: '#E5E7EB'
        };
    }
  };

  const toggleProspectSelection = (id: string) => {
    setSelectedProspects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentProspects = getCurrentProspects();
    if (selectedProspects.length === currentProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(currentProspects.map((p) => p.selectionKey));
    }
  };

  const currentProspects = getCurrentProspects();

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-3" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>
          <span style={{ color: '#111827' }}>Screening Programs</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col" style={{ borderColor: '#E5E7EB' }}>
          <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
              Programs
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280', marginTop: '8px' }}>
              Manage screening bookings by program
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveProgram(item.id)}
                  className="w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors"
                  style={{
                    backgroundColor: activeProgram === item.id ? '#E2D8ED' : 'transparent',
                    color: activeProgram === item.id ? 'var(--primary)' : '#4B5563'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: activeProgram === item.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)'
                    }}>
                      {item.label}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded"
                      style={{ 
                        fontSize: 'var(--text-xs)', 
                        fontWeight: 'var(--font-weight-medium)',
                        backgroundColor: activeProgram === item.id ? 'var(--primary)' : '#F3F4F6',
                        color: activeProgram === item.id ? 'white' : '#6B7280'
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                {menuItems.find(item => item.id === activeProgram)?.label}
              </h1>
              <Button
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                className="hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Screening
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search by name, contact, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  style={{
                    borderColor: '#CED4DA',
                    fontSize: 'var(--text-sm)',
                    backgroundColor: '#FFFFFF',
                    color: '#272B30'
                  }}
                />
              </div>
              <Button
                variant="outline"
                style={{
                  borderColor: '#CED4DA',
                  color: '#374151',
                  backgroundColor: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                className="hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedProspects.length > 0 && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>
                  {selectedProspects.length} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: '#CED4DA',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Assign Staff
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: '#CED4DA',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    Add Tag
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: '#CED4DA',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Log
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB',
                    width: '40px'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedProspects.length === currentProspects.length && currentProspects.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                      style={{ accentColor: 'var(--primary)' }}
                    />
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Identifier
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Name
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Age
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Contact
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Email
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Status
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Booking Date
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Location
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Assign To
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Tag
                  </th>
                  <th className="text-left px-6 py-3" style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-semibold)', 
                    color: '#6B7280',
                    backgroundColor: '#F9FAFB'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProspects.map((prospect) => (
                  <tr 
                    key={prospect.selectionKey} 
                    style={{ borderBottom: '1px solid #F3F4F6' }} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onNavigate({ page: 'prospect-detail', prospectRef: prospect.prospectRef })}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProspects.includes(prospect.selectionKey)}
                        onChange={() => toggleProspectSelection(prospect.selectionKey)}
                        className="rounded"
                        style={{ accentColor: 'var(--primary)' }}
                      />
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#111827' }}>
                      {prospect.displayId}
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#111827' }}>
                      {prospect.name}
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                      {prospect.age}
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                      {prospect.contact}
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                      {prospect.email}
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded"
                        style={{
                          ...getStatusStyle(prospect.status),
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          border: '1px solid'
                        }}
                      >
                        {prospect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                      {prospect.bookingDate}
                    </td>
                    <td className="px-6 py-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                      {prospect.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {prospect.assignTo.length > 0 ? (
                          prospect.assignTo.map((staff, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-medium)',
                                backgroundColor: '#F3F4F6',
                                color: '#374151'
                              }}
                            >
                              {staff}
                            </Badge>
                          ))
                        ) : (
                          <span style={{ fontSize: 'var(--text-sm)', color: '#9CA3AF' }}>-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          borderColor: '#E5E7EB',
                          color: '#6B7280'
                        }}
                      >
                        {prospect.tag}
                      </Badge>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <MoreHorizontal className="w-4 h-4" style={{ color: '#6B7280' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
