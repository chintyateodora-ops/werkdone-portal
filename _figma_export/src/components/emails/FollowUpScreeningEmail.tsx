import { Search, Settings, HelpCircle, Menu, ChevronLeft, ChevronRight, Archive, Trash2, Clock, Tag, Star, MoreVertical } from 'lucide-react';
import { Page } from '../../App';
import scsLogo from 'figma:asset/ae0b8fff1405d98baa9a044f42bdd53a710097a7.png';
import gmailLogo from 'figma:asset/b0d59a2bd72a4913c69f628bfa33b97e0d3d089c.png';
import werkdoneLogo from 'figma:asset/61a1cfbd37cdb5f77b9b08f0dfc18c2144a7cc16.png';

interface FollowUpScreeningEmailProps {
  onNavigate: (page: Page) => void;
}

export function FollowUpScreeningEmail({ onNavigate }: FollowUpScreeningEmailProps) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <img src={gmailLogo} alt="Gmail" className="h-10" />
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Search mail"
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--accent)',
                border: 'none',
                outline: 'none',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
            <span style={{ color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)' }}>A</span>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Email Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => onNavigate('segments')}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Back</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <Archive className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <Trash2 className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <Clock className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <Tag className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <MoreVertical className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
                <div className="border-l pl-2 ml-2" style={{ borderColor: 'var(--border)' }}>
                  <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </div>
              </div>
            </div>

            <h1 style={{ 
              fontSize: 'var(--text-h3)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              marginBottom: '16px'
            }}>
              Follow-Up: Screening Appointment Confirmation
            </h1>

            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span style={{ color: 'var(--primary-foreground)', fontSize: 'var(--text-base)' }}>SC</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)'
                    }}>
                      Singapore Cancer Society
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)'
                    }}>
                      {'<noreply@cancerscreening.org.sg>'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ 
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)'
                    }}>
                      to me
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span style={{ 
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)'
                }}>
                  Jan 20, 2025, 2:15 PM
                </span>
                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <Star className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="border-t pt-6" style={{ borderColor: 'var(--border)', backgroundColor: '#F9F9F9' }}>
            {/* Email Card Container */}
            <div className="max-w-2xl mx-auto" style={{ 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '48px',
              backgroundColor: '#FFFFFF'
            }}>
              {/* SCS Logo */}
              <div className="flex justify-center mb-6">
                <img src={scsLogo} alt="Singapore Cancer Society" style={{ height: '48px' }} />
              </div>

              {/* Title */}
              <h2 className="text-center mb-8" style={{
                fontSize: 'var(--text-h4)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)'
              }}>
                Follow-Up Screening Appointment Date
              </h2>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #E5E7EB', marginBottom: '32px' }}></div>

              {/* Email Content */}
              <div style={{ 
                fontSize: 'var(--text-base)',
                lineHeight: '1.6',
                color: 'var(--foreground)'
              }}>
                <p className="mb-4">Dear Colleague,</p>
                
                <p className="mb-6">
                  Thank you for accepting the referral for:
                </p>

                {/* Case Details */}
                <div className="mb-2">
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    CASE ID
                  </p>
                  <p style={{ 
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: '16px'
                  }}>
                    {'{{CaseID}}'}
                  </p>
                </div>

                <div className="mb-6">
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    SCREENING TYPE
                  </p>
                  <p style={{ 
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: '16px'
                  }}>
                    {'{{ScreeningType}}'}
                  </p>
                </div>

                <p className="mb-6">
                  We appreciate your support. To proceed, please provide the scheduled appointment date and details via the secure link below.
                </p>

                {/* Sign-off */}
                <p className="mb-1">Thank you.</p>
                <p className="mb-1">Sincerely,</p>
                <p className="mb-6">Singapore Cancer Society Clinic @ Bishan</p>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px', marginBottom: '32px' }}></div>

                {/* CTA Section */}
                <p className="mb-4 text-center" style={{ color: '#6B7280' }}>
                  Please use the secure link below to Enter Appointment Details:
                </p>

                {/* View Details Button */}
                <button 
                  onClick={() => onNavigate('referral-details')}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: '#7C51A1',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '16px'
                  }}>
                  View Details
                </button>

                {/* Fallback Link */}
                <p className="mb-6 text-center" style={{ 
                  fontSize: 'var(--text-sm)',
                  color: '#6B7280'
                }}>
                  Can't click the button above? Copy and paste this link into your browser:<br />
                  <a href="https://scs.werkdone.com/referral/MVuYRko5bJG4" style={{ color: '#2563EB' }}>
                    https://scs.werkdone.com/referral/MVuYRko5bJG4
                  </a>
                </p>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #E5E7EB', marginBottom: '24px' }}></div>

                {/* Contact Info */}
                <p className="mb-4 text-center" style={{ 
                  fontSize: 'var(--text-sm)',
                  color: '#6B7280'
                }}>
                  For further enquiries, kindly contact Singapore Cancer Society at<br />
                  64999133/64999146 (Monday to Friday, 08.30 AM - 06.00 PM or email:<br />
                  <a href="mailto:cs_appointment@singaporecancersociety.org.sg" style={{ color: '#2563EB' }}>
                    cs_appointment@singaporecancersociety.org.sg
                  </a>
                </p>

                {/* Auto-generated Message */}
                <p className="text-center" style={{ 
                  fontSize: 'var(--text-sm)',
                  color: '#9CA3AF',
                  fontStyle: 'italic',
                  marginBottom: '24px'
                }}>
                  This is an auto-generated message. Please do not reply to this email.
                </p>

                {/* Powered by Werkdone */}
                <div className="flex justify-center">
                  <img src={werkdoneLogo} alt="Powered by Werkdone" style={{ height: '32px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}