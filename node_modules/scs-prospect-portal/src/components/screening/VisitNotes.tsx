import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { Page } from '../../App';
import { resolveProspectByRef } from '../../lib/prospectRef';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';

interface VisitNotesProps {
  onNavigate: (page: Page) => void;
  visitId: string;
  prospectRef: string;
}

export function VisitNotes({ onNavigate, visitId, prospectRef }: VisitNotesProps) {
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
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280' }}>Clinical Visits</p>
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
            onClick={() => onNavigate({ page: 'visit-details', visitId, prospectRef })}
            className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}
          >
            Visit Details
          </button>
          <button
            className="pb-3 border-b-2"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)'
            }}
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
        {/* Doctor Notes Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1.5rem' }}>
            Doctor Notes
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Doctor Name
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>RAUZANAH</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Doctor Name(ACTR)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Rauzanah Khusun (MCR S188970)</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  No.
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  HPV Test Done
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Breast Examination
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  FIT KIT Given
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Gist of Lgr Delivered
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Any Symptoms
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>G lg p23 1 - til 0 0 C</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  CV
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>N</p>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  LMP
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Weight (KG)
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Pap Test/HPV Test Date (As Per Kit Vial)*
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>26-Jun-21</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  Mammogram Archived
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                  NEXGD Form Given
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Cancer
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>N</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Breasts
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>N REF ADV</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Others
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>N</p>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Abdomen
                </label>
                <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}>N</p>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.25rem' }}>
                  Clinical History
                </label>
                <button 
                  onClick={() => onNavigate({ page: 'prospect-detail', prospectRef })}
                  className="hover:underline"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--primary)' }}
                >
                  @ TAN, CHWEE LAN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Remarks Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1.5rem' }}>
            Additional Remarks
          </h2>
          
          <div className="bg-gray-50 rounded p-4 min-h-[100px]">
            {/* Empty remarks section */}
          </div>
        </div>

        {/* Referral Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '1.5rem' }}>
            Referral Details
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                Doctor Name
              </label>
              <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-sm)', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                Referred To
              </label>
              <p style={{ fontSize: 'var(--text-base)', color: '#111827' }}></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
