import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { Page } from '../../App';
import { resolveProspectByRef } from '../../lib/prospectRef';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';

interface VisitDetailsProps {
  onNavigate: (page: Page) => void;
  visitId: string;
  prospectRef: string;
}

export function VisitDetails({ onNavigate, visitId, prospectRef }: VisitDetailsProps) {
  const { profilesByRecordId } = useIndividualProfiles();
  const prospectRow = resolveProspectByRef(prospectRef, profilesByRecordId);
  const patientDisplayName = prospectRow?.name ? prospectRow.name.toUpperCase() : '—';
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate({ page: 'prospect-detail', prospectRef })}
              className="p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 style={{ fontSize: 'var(--text-h2)' }}>SCS-SCV-2026-93093</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>Saved</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary)' }}>
                {patientDisplayName}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>Patient Name</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>21</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>Clinical Number</p>
            </div>
            <div className="text-right">
              <div 
                className="px-3 py-1 rounded inline-block"
                style={{ 
                  backgroundColor: '#D1FAE5', 
                  color: '#059669',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                Pending Results
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>Status</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          <button
            className="pb-3 border-b-2"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Visit Details
          </button>
          <button
            onClick={() => onNavigate({ page: 'visit-notes', visitId, prospectRef })}
            className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}
          >
            Visit Notes
          </button>
          <button
            className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}
          >
            Related
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Visit Details Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1rem' }}>
              Visit Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Patient Queued Date & Time
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>6/6/26</p>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>8:44 PM</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Consultation Date & Time
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>6/6/26</p>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>5:04 PM</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Purpose of Visit
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Screening</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  New Revisit
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Text Type
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>*</p>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Pap Test / HPV Test</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Status
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Pending Results</p>
              </div>
            </div>
          </div>

          {/* Patient Details Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1rem' }}>
              Patient Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Patient Name
                </label>
                <button 
                  onClick={() => onNavigate({ page: 'prospect-detail', prospectRef })}
                  className="hover:underline"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--primary)' }}
                >
                  @ TAN, CHWEE LAN
                </button>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  ID Number
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>S00000024</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Mobile No.
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>96026959</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Preferred Email
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>chweetan@gmail.com</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Date of Birth
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>29/10/91</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Age
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>55</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Building Name (MRT)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>HDING SAKI COURT</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Unit Number (MRT)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>408-421</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Street (MRT)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>488 JURONG WEST STREET 41</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Address 1- City
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Address 2- State/Province
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Postal Code (MRT)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>640088</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Country (MRT)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>SINGAPORE</p>
              </div>
            </div>
          </div>

          {/* Caregiver Details Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1rem' }}>
              Caregiver's Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Caregiver Name
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
