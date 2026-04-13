import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Page } from '../../App';
import { encodeProspectRecordRef } from '../../lib/prospectRef';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';

interface ScreeningManagementProps {
  onNavigate: (page: Page) => void;
}

const SCREENING_ROWS = [
  {
    id: 'SCS-SCV-2026-93093',
    recordId: 'IND-001',
    dateOfVisit: '6/6/26',
    status: 'Completed (with test)',
    testType: 'Pap Test / HPV Test',
  },
  {
    id: 'SCS-SCV-2026-12345',
    recordId: 'IND-002',
    dateOfVisit: '6/6/26',
    status: 'Pending Lab Result',
    testType: 'Pap Test',
  },
  {
    id: 'SCS-SCV-2026-12346',
    recordId: 'IND-003',
    dateOfVisit: '5/6/26',
    status: 'Pending Doctor Input',
    testType: 'HPV Test',
  },
  {
    id: 'SCS-SCV-2026-12347',
    recordId: 'IND-004',
    dateOfVisit: '4/6/26',
    status: 'Pending Print Result',
    testType: 'Pap Test / HPV Test',
  },
  {
    id: 'SCS-SCV-2026-12348',
    recordId: 'IND-005',
    dateOfVisit: '3/6/26',
    status: 'Completed (no test done)',
    testType: '-',
  },
  {
    id: 'SCS-SCV-2026-12349',
    recordId: 'IND-006',
    dateOfVisit: '2/6/26',
    status: 'Pending Lab Result',
    testType: 'Pap Test',
  },
];

export function ScreeningManagement({ onNavigate }: ScreeningManagementProps) {
  const { profilesByRecordId } = useIndividualProfiles();
  const mockScreeningData = useMemo(
    () =>
      SCREENING_ROWS.map((row) => {
        const p = profilesByRecordId[row.recordId];
        return {
          id: row.id,
          prospectRef: encodeProspectRecordRef(row.recordId),
          prospectName: (p?.name ?? '').toUpperCase(),
          contact: p?.contact ?? '—',
          dateOfVisit: row.dateOfVisit,
          status: row.status,
          testType: row.testType,
        };
      }),
    [profilesByRecordId]
  );
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending Lab Result':
        return { backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' };
      case 'Pending Doctor Input':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' };
      case 'Pending Print Result':
        return { backgroundColor: '#FCE7F3', color: '#9F1239', border: '1px solid #FBCFE8' };
      case 'Completed (with test)':
        return { backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' };
      case 'Completed (no test done)':
        return { backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' };
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-900">Screening Management</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 style={{ fontSize: 'var(--text-h2)' }}>Screening Management</h1>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Search and Filter */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by prospect name or screening ID"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    Select Data in this page
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      Filter by Status
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    <span className="text-sm text-gray-600">Show entries</span>
                    <Button variant="outline" size="sm">
                      10
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Screening ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Prospect Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Date of Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Test Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockScreeningData.map((screening, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              // Navigate to prospect detail with screening tab active
                              onNavigate({ page: 'prospect-detail', prospectRef: screening.prospectRef });
                            }}
                            className="hover:underline"
                            style={{ 
                              color: 'var(--primary)',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-normal)'
                            }}
                          >
                            {screening.id}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              onNavigate({ page: 'prospect-detail', prospectRef: screening.prospectRef });
                            }}
                            className="hover:underline"
                            style={{ 
                              color: 'var(--primary)',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-normal)'
                            }}
                          >
                            {screening.prospectName}
                          </button>
                        </td>
                        <td className="px-6 py-4" style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}>
                          {screening.contact}
                        </td>
                        <td className="px-6 py-4" style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}>
                          {screening.dateOfVisit}
                        </td>
                        <td className="px-6 py-4" style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}>
                          {screening.testType}
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded"
                            style={{
                              ...getStatusStyle(screening.status),
                              fontSize: 'var(--text-label)',
                              fontWeight: 'var(--font-weight-normal)'
                            }}
                          >
                            {screening.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => {
                              onNavigate({ page: 'prospect-detail', prospectRef: screening.prospectRef });
                            }}
                          >
                            <Eye className="w-4 h-4" style={{ color: '#6B7280' }} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  1 to 6 out of 6 records
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-purple-50 text-purple-600 border-purple-200">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
