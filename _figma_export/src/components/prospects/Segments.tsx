import { Footer } from '../Footer';
import { Page } from '../../App';

interface SegmentsProps {
  onNavigate: (page: Page) => void;
}

export function Segments({ onNavigate }: SegmentsProps) {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Prospect Management</span>
          <span>›</span>
          <span className="text-gray-900">Email - Demo</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-gray-900 mb-6">Email - Demo</h1>
          
          {/* Referral Letter for Screening Section */}
          <div className="bg-white rounded-lg border mb-6 p-6" style={{ borderColor: 'var(--border)' }}>
            <h2 className="mb-6" style={{ 
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.05em'
            }}>
              REFERRAL LETTER FOR SCREENING
            </h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('email-screening-request')}
                className="px-6 py-2.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-button)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                }}
              >
                Screening Request
              </button>
              <button 
                onClick={() => onNavigate('email-followup-screening')}
                className="px-6 py-2.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-button)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                }}
              >
                Follow-Up Screening Appointment Date
              </button>
              <button 
                onClick={() => onNavigate('screening-results')}
                className="px-6 py-2.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-button)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                }}
              >
                Screening Results
              </button>
            </div>
          </div>

          {/* Referral Letter for Treatment Section */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
            <h2 className="mb-6" style={{ 
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.05em'
            }}>
              REFERRAL LETTER FOR TREATMENT
            </h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('email-treatment-request')}
                className="px-6 py-2.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-button)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                }}
              >
                Treatment Request
              </button>
              <button 
                onClick={() => onNavigate('referral-details')}
                className="px-6 py-2.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-button)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                }}
              >
                Follow-Up Treatment Progress
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}