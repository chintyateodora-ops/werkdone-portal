import { Page } from '../../App';
import scsLogo from 'figma:asset/b0bcd35b322fc22141175a8b66dd339881b6f74b.png';
import { useState } from 'react';

interface ScreeningResultsProps {
  onNavigate: (page: Page) => void;
}

export function ScreeningResults({ onNavigate }: ScreeningResultsProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'appointment' | 'screening'>('personal');

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center">
          <img 
            src={scsLogo} 
            alt="Singapore Cancer Society" 
            style={{ height: '40px', cursor: 'pointer' }}
            onClick={() => onNavigate('segments')}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="mb-6" style={{
            fontSize: 'var(--text-h3)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)'
          }}>
            Screening Results
          </h1>

          {/* Referral Summary Card */}
          <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Case ID
                </label>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  2025/CX/1124
                </p>
              </div>

              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Screening Type
                </label>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  HPV Test
                </p>
              </div>

              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Referral to
                </label>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Gynaecologist
                </p>
              </div>

              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Primary Doctor
                </label>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Dr. Philip Ong Kang (MCR M056482G)
                </p>
              </div>

              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Ref Submitted
                </label>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Wed, 17 Sep 2025, 09:00 AM
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-8" style={{ borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={() => setActiveTab('personal')}
                style={{
                  padding: '12px 0',
                  fontSize: 'var(--text-base)',
                  color: activeTab === 'personal' ? '#7C51A1' : 'var(--muted-foreground)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: activeTab === 'personal' ? '2px solid #7C51A1' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'personal' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
                }}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('appointment')}
                style={{
                  padding: '12px 0',
                  fontSize: 'var(--text-base)',
                  color: activeTab === 'appointment' ? '#7C51A1' : 'var(--muted-foreground)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: activeTab === 'appointment' ? '2px solid #7C51A1' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'appointment' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
                }}
              >
                Appointment Details
              </button>
              <button
                onClick={() => setActiveTab('screening')}
                style={{
                  padding: '12px 0',
                  fontSize: 'var(--text-base)',
                  color: activeTab === 'screening' ? '#7C51A1' : 'var(--muted-foreground)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: activeTab === 'screening' ? '2px solid #7C51A1' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'screening' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
                }}
              >
                Screening Result
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Name (as per NRIC)
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Lim Zhi Hao
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    NRIC/ FIN Number
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    S****567D ⊘
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Date of Birth
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    27 July 1956
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Gender
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Female
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Residential Status
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Singapore Citizen
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Spoken Language(s)
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    English, Chinese
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Mobile Number
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    +65 8971 2346
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Email
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    lim.jasmine94@gmail.com
                  </p>
                </div>
              </div>

              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Address
              </h2>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Unit No.
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    345
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Postal Code
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    730991
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Street Name & Block No.
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    456 Tampines Avenue 3, Pinevale Condominium
                  </p>
                </div>
              </div>

              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Health Profile
              </h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Health Risk Factor
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Smoking, Family history of diabetes
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Existing Conditions
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Hypertension, Type 2 Diabetes
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Remarks
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Remarks
                  </p>
                </div>
              </div>

              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Risk Assessment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Risk Level
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    High Risk
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Risk Factor
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Family History, Age Factor, Lifestyle Risks
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointment' && (
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Appointment Details
              </h2>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Appointment Name
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Screening
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Date
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    20 Nov 2025
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Clinic Name / Location
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    Mount Serene Hospital
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Purpose
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    {'{{Purpose}}'}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Remarks
                  </label>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}>
                    -
                  </p>
                </div>
              </div>

              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Reschedule
              </h2>

              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Screening Date
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CED4DA',
                        borderRadius: '6px',
                        fontSize: 'var(--text-base)',
                        color: '#4F575E'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Screening Time
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CED4DA',
                        borderRadius: '6px',
                        fontSize: 'var(--text-base)',
                        color: '#4F575E',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234F575E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option>hh:mm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)'
                    }}>
                      Remarks
                    </label>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)'
                    }}>
                      0/500
                    </span>
                  </div>
                  <textarea
                    placeholder="Add Remarks"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CED4DA',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      color: '#4F575E',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    style={{
                      padding: '10px 32px',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: '10px 32px',
                      backgroundColor: '#7C51A1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screening' && (
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
              <h2 className="mb-6" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Screening Result
              </h2>

              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Primary Doctor
                    </label>
                    <input
                      type="text"
                      placeholder="Input Doctor's Name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CED4DA',
                        borderRadius: '6px',
                        fontSize: 'var(--text-base)',
                        color: '#4F575E'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Screening Date
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CED4DA',
                        borderRadius: '6px',
                        fontSize: 'var(--text-base)',
                        color: '#4F575E'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Result
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CED4DA',
                        borderRadius: '6px',
                        fontSize: 'var(--text-base)',
                        color: '#4F575E',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234F575E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option>Select Result</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)'
                    }}>
                      Description*
                    </label>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)'
                    }}>
                      0/500
                    </span>
                  </div>
                  <textarea
                    placeholder="Add Description"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CED4DA',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      color: '#4F575E',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Upload File Section */}
                <div style={{
                  border: '1px solid #7C51A1',
                  borderRadius: '6px',
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <button
                    style={{
                      padding: '10px 32px',
                      backgroundColor: '#7C51A1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}
                  >
                    Upload File
                  </button>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)'
                  }}>
                    <p>⓵ File formats: .xls</p>
                    <p>Max file size: 2 MB</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    style={{
                      padding: '10px 32px',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onNavigate('segments')}
                    style={{
                      padding: '10px 32px',
                      backgroundColor: '#7C51A1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center" style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)'
          }}>
            Copyright © 2025 WERKDONE PTE LTD.
          </div>
        </div>
      </div>
    </div>
  );
}
