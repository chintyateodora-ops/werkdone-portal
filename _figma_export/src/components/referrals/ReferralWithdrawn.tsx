import { CheckCircle2 } from 'lucide-react';
import { Page } from '../../App';
import scsLogo from 'figma:asset/b0bcd35b322fc22141175a8b66dd339881b6f74b.png';
import werkdoneLogo from 'figma:asset/61a1cfbd37cdb5f77b9b08f0dfc18c2144a7cc16.png';

interface ReferralWithdrawnProps {
  onNavigate: (page: Page) => void;
}

export function ReferralWithdrawn({ onNavigate }: ReferralWithdrawnProps) {
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center">
          <img src={scsLogo} alt="Singapore Cancer Society" style={{ height: '40px' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 
              style={{ 
                width: '64px', 
                height: '64px', 
                color: '#10B981' 
              }} 
            />
          </div>
          
          <h1 className="mb-4" style={{
            fontSize: 'var(--text-h2)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)'
          }}>
            Referral Withdrawn
          </h1>
          
          <p className="mb-8" style={{
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.5'
          }}>
            The referral for Tan Mei Ling (Case ID: SCS2025-0123) has been successfully withdrawn. The patient and referring doctor will be notified.
          </p>

          <button
            onClick={() => onNavigate('segments')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#7C51A1',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer'
            }}
          >
            Back to Email - Demo
          </button>
        </div>
      </div>

      {/* Werkdone Logo - Stick to Bottom */}
      <div className="flex justify-center" style={{ padding: '16px' }}>
        <img src={werkdoneLogo} alt="Powered by Werkdone" style={{ height: '40px' }} />
      </div>
    </div>
  );
}