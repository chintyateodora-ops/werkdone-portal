import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ChevronLeft, Link2, Check, CheckCircle2, X } from 'lucide-react';
import { Page } from '../../App';
import { HEALTHIER_SG_FORM_OPTIONS } from '../../lib/healthierSgProfile';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FORM_CARD_SECTION_TITLE_CLASS } from '../../lib/formCardSectionTitle';
import { DdMmYyyyDateInput } from '../ui/dd-mm-yyyy-date-input';
import { PhonePrefixInput } from '../ui/phone-prefix-input';
import { NricRevealInput } from '../ui/nric-reveal-input';

/** Sentinel for Radix Select when no value chosen (empty string in form state) */
const SEL_NONE = '__none__';

interface AddProspectProps {
  onNavigate: (page: Page) => void;
  /** Mammobus full form only; must match route */
  initialProgram?: 'mammobus';
}

export function AddProspect({ onNavigate, initialProgram = 'mammobus' }: AddProspectProps) {
  const [selectedFormType, setSelectedFormType] = useState(initialProgram);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('eligibility');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    nric: '',
    dateOfBirth: '',
    gender: '',
    residentialStatus: '',
    race: '',
    mobileNumber: '',
    email: '',
    chasCardType: '',
    healthierSgEnrolled: '',

    appointmentType: 'mammobus',
    healthierSgBooked: '',
    healthierSgScreeningDate: '',
    postalCode: '',
    blockNumber: '',
    streetName: '',
    unitNumber: '',
    buildingName: '',

    preferredScreeningDate: '',
    preferredTimeSlot: '',
    screeningLocationEvent: '',
    
    // Screening Questions
    covid19VaccineSoon: '',
    mammogramPast12or24Months: '',
    breastfeedingPast6Months: '',
    breastSymptoms: '',
    breastImplants: '',
    everHadBreastCancer: '',
    
    // Medical History
    familyCancerHistory: '',
    cancerTypes: [] as string[],
    personalCancerHistory: '',
    personalCancerType: '',
    medicalConditions: [] as string[],
    otherCondition: '',
    
    // Source
    sourceType: '',
    sourceName: '',
    
    // Consent
    consent: false,
    smsConsent: 'yes',
    phoneConsent: 'yes',
    whatsappConsent: 'yes',
    emailConsent: 'yes'
  });

  const formTypes = [
    { value: 'mammobus', label: 'Mammogram Screening Registration', available: true },
    { value: 'hpv', label: 'HPV Screening Programme', available: false },
    { value: 'fit', label: 'FIT Screening Programme', available: false }
  ];

  const getFormTitle = () => {
    const form = formTypes.find(f => f.value === selectedFormType);
    return form?.label || 'Mammogram Screening Registration';
  };

  const getRegistrationLink = () => {
    // Placeholder URL format - actual token URL will be shown after clicking "View"
    return `https://scs.gov.sg/screening/register/[token]`;
  };

  const handleCopyLink = async () => {
    const link = getRegistrationLink();
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      toast.custom(
        (t) => (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              minWidth: '400px'
            }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span
              className="flex-1"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Self Registration link copied.
            </span>
            <button
              className="underline hover:no-underline"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
              onClick={() => {
                window.open(link, '_blank');
              }}
            >
              View
            </button>
            <button
              onClick={() => toast.dismiss(t)}
              className="hover:opacity-70 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        {
          duration: 5000,
        }
      );
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (err) {
      toast.error('Failed to copy link', {
        description: 'Please try again.',
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'healthierSgBooked' && value === 'no') {
        next.healthierSgScreeningDate = '';
      }
      if (field === 'appointmentType' && value !== 'healthier-sg') {
        next.healthierSgBooked = '';
        next.healthierSgScreeningDate = '';
      }
      return next;
    });
  };

  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(value)) {
      handleInputChange(field, currentArray.filter(v => v !== value));
    } else {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const handleCancel = () => {
    onNavigate('all-prospects');
  };

  const handleSubmit = () => {
    console.log('Submitting prospect:', { ...formData, formType: selectedFormType });
    toast.success('Registration submitted successfully!', {
      description: 'The prospect has been added to the listing.',
    });
    onNavigate('all-prospects');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const container = scrollContainerRef.current;
    const element = document.getElementById(sectionId);
    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const currentScrollTop = container.scrollTop;
    const delta = elementRect.top - containerRect.top;
    const targetTop = Math.max(0, currentScrollTop + delta - 16);

    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-0 h-full bg-gray-50">
      {/* Breadcrumb */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2" style={{ 
          fontSize: 'var(--text-base)',
          color: '#6B7280'
        }}>
          <button type="button" onClick={() => onNavigate('all-prospects')} style={{ color: 'var(--primary)' }} className="hover:underline bg-transparent border-0 p-0 cursor-pointer font-inherit">Prospect Management</button>
          <span>›</span>
          <span style={{ color: '#111827' }}>{getFormTitle()}</span>
        </div>
      </div>

      {/* Header with back button, title and action buttons */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-0 hover:bg-transparent -ml-2"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#111827' }} />
            </Button>
            <div>
              <h1 style={{ 
                fontSize: 'var(--text-h2)',
                fontWeight: 'var(--font-weight-semibold)',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {getFormTitle()}
              </h1>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#6B7280'
              }}>
                Screening Registration Form
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 'var(--text-base)', color: '#10B981' }}>Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span style={{ fontSize: 'var(--text-base)' }}>Copy Registration Link</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)' 
              }}
              className="hover:opacity-90"
            >
              Submit Registration
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar - Table of Contents */}
        <div className="w-64 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4">
            {(
              [
                ['eligibility', 'Medical Eligibility'],
                ['personal', 'Personal Information'],
                ['address', 'Residential Address'],
                ['subsidies', 'Healthier SG & Subsidies'],
                ['appointment-type', 'Appointment Type'],
                ...(formData.appointmentType === 'healthier-sg' ? [] : ([['appointment', 'Appointment Preferences']] as const)),
                ['screening', 'Screening Questions'],
                ['engagement', 'Engagement'],
                ['consent', 'Consent'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
                style={{
                  backgroundColor: activeSection === id ? 'rgba(242, 238, 246)' : 'transparent',
                  color: activeSection === id ? 'var(--primary)' : '#6B7280',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right content area */}
        <div ref={scrollContainerRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="min-h-0 flex-1">
            <div className="max-w-4xl mx-auto p-6">
              {/* Medical Eligibility — content moved from former Medical History; order matches screening form standard */}
              <section id="eligibility" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  MEDICAL ELIGIBILITY
                </h2>

                <div
                  className="mb-6 rounded-lg border px-5 py-4 text-sm leading-relaxed text-slate-800"
                  style={{
                    background: 'var(--color-primary-100, #f5f0fa)',
                    borderColor: 'var(--color-primary-200, #e4d9f0)',
                  }}
                  role="note"
                >
                  <ol className="mb-0 list-[lower-alpha] space-y-1 pl-5">
                    <li>Are a female Singapore Citizen or Permanent Resident aged 40 and above;</li>
                    <li>
                      Have not gone for mammogram screening for the past 1 year (aged 40 to 49) or 2 years (aged 50 and
                      above);
                    </li>
                    <li>Do not have breast symptoms such as breast lumps or nipple discharge; and</li>
                    <li>Have not been breastfeeding for the past 6 months.</li>
                    <li>Not pregnant</li>
                  </ol>
                </div>

                <div className="space-y-6">
                  {/* Family Cancer History */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Do you have any family history of cancer?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="familyCancerHistory"
                          value="yes"
                          checked={formData.familyCancerHistory === 'yes'}
                          onChange={(e) => handleInputChange('familyCancerHistory', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="familyCancerHistory"
                          value="no"
                          checked={formData.familyCancerHistory === 'no'}
                          onChange={(e) => handleInputChange('familyCancerHistory', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>

                    {formData.familyCancerHistory === 'yes' && (
                      <div className="mt-4">
                        <label 
                          className="block mb-2" 
                          style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}
                        >
                          Which type(s) of cancer? (Select all that apply)
                        </label>
                        <div className="space-y-2">
                          {['Breast Cancer', 'Colorectal Cancer', 'Lung Cancer', 'Ovarian Cancer', 'Other'].map(type => (
                            <label key={type} className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.cancerTypes.includes(type)}
                                onCheckedChange={() => toggleArrayValue('cancerTypes', type)}
                              />
                              <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Have you been diagnosed with cancer?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="personalCancerHistory"
                          value="yes"
                          checked={formData.personalCancerHistory === 'yes'}
                          onChange={(e) => handleInputChange('personalCancerHistory', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="personalCancerHistory"
                          value="no"
                          checked={formData.personalCancerHistory === 'no'}
                          onChange={(e) => handleInputChange('personalCancerHistory', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>

                    {formData.personalCancerHistory === 'yes' && (
                      <div className="mt-4">
                        <label 
                          className="block mb-2" 
                          style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}
                        >
                          Type of cancer
                        </label>
                        <Input
                          placeholder="Specify cancer type"
                          value={formData.personalCancerType}
                          onChange={(e) => handleInputChange('personalCancerType', e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Do you have any of the following medical conditions? (Select all that apply)
                    </label>
                    <div className="space-y-2">
                      {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Other'].map(condition => (
                        <label key={condition} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.medicalConditions.includes(condition)}
                            onCheckedChange={() => toggleArrayValue('medicalConditions', condition)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>{condition}</span>
                        </label>
                      ))}
                    </div>

                    {formData.medicalConditions.includes('Other') && (
                      <div className="mt-4">
                        <label 
                          className="block mb-2" 
                          style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}
                        >
                          Please specify other medical condition
                        </label>
                        <Input
                          placeholder="Specify other condition"
                          value={formData.otherCondition}
                          onChange={(e) => handleInputChange('otherCondition', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Personal Information — fields & order match patient-facing screening registration */}
              <section id="personal" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  PERSONAL INFORMATION
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                      }}
                    >
                      Name (as per NRIC)<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <Input
                      placeholder="Enter full name as in NRIC"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="field-residential" className="mb-2 block text-base font-normal text-gray-900">
                      Residential Status
                    </Label>
                    <Select
                      value={formData.residentialStatus || SEL_NONE}
                      onValueChange={(v) => handleInputChange('residentialStatus', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-residential" className="w-full">
                        <SelectValue placeholder="Select Residential Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select Residential Status</SelectItem>
                        <SelectItem value="Citizen">Singapore Citizen</SelectItem>
                        <SelectItem value="PR">Permanent Resident</SelectItem>
                        <SelectItem value="Foreigner">Foreigner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      htmlFor="field-nric"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                      }}
                    >
                      NRIC / FIN Number<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <NricRevealInput
                      id="field-nric"
                      value={formData.nric}
                      onChange={(v) => handleInputChange('nric', v)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      htmlFor="field-dob"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                      }}
                    >
                      Date of Birth<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <DdMmYyyyDateInput
                      id="field-dob"
                      value={formData.dateOfBirth}
                      onChange={(v) => handleInputChange('dateOfBirth', v)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="field-gender" className="mb-2 block text-base font-normal text-gray-900">
                      Gender<span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.gender || SEL_NONE}
                      onValueChange={(v) => handleInputChange('gender', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-gender" className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select Gender</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="field-race" className="mb-2 block text-base font-normal text-gray-900">
                      Race
                    </Label>
                    <Select
                      value={formData.race || SEL_NONE}
                      onValueChange={(v) => handleInputChange('race', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-race" className="w-full">
                        <SelectValue placeholder="Select Race" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select Race</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Malay">Malay</SelectItem>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="Eurasian">Eurasian</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                      }}
                    >
                      Contact Number<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <PhonePrefixInput
                      value={formData.mobileNumber}
                      onChange={(v) => handleInputChange('mobileNumber', v)}
                      required
                      placeholder="E.g. 8123 4567"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                      }}
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Residential Address */}
              <section id="address" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  RESIDENTIAL ADDRESS
                </h2>

                <div className="space-y-6">
                  <div>
                    <label 
                      className="block mb-2" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Postal Code<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <Input
                      placeholder="e.g. 123456"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Block Number<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <Input
                        placeholder="e.g. 123"
                        value={formData.blockNumber}
                        onChange={(e) => handleInputChange('blockNumber', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Street Name<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <Input
                        placeholder="e.g. Orchard Road"
                        value={formData.streetName}
                        onChange={(e) => handleInputChange('streetName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Unit Number
                      </label>
                      <Input
                        placeholder="e.g. #12-34"
                        value={formData.unitNumber}
                        onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                      />
                    </div>

                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Building Name
                      </label>
                      <Input
                        placeholder="e.g. Plaza Singapura"
                        value={formData.buildingName}
                        onChange={(e) => handleInputChange('buildingName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Healthier SG & Subsidies */}
              <section id="subsidies" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  HEALTHIER SG &amp; SUBSIDIES
                </h2>

                <div className="space-y-6 max-w-xl">
                  <div>
                    <Label htmlFor="field-chas" className="mb-2 block text-base font-normal text-gray-900">
                      CHAS card type
                    </Label>
                    <Select
                      value={formData.chasCardType || SEL_NONE}
                      onValueChange={(v) => handleInputChange('chasCardType', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-chas" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select</SelectItem>
                        <SelectItem value="CHAS Orange">CHAS Orange</SelectItem>
                        <SelectItem value="CHAS Blue">CHAS Blue</SelectItem>
                        <SelectItem value="CHAS Green">CHAS Green</SelectItem>
                        <SelectItem value="Merdeka Generation">Merdeka Generation</SelectItem>
                        <SelectItem value="Pioneer Generation">Pioneer Generation</SelectItem>
                        <SelectItem value="None">None / Not applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="field-healthier-sg" className="mb-2 block text-base font-normal text-gray-900">
                      Healthier SG enrolment
                    </Label>
                    <Select
                      value={formData.healthierSgEnrolled || SEL_NONE}
                      onValueChange={(v) => handleInputChange('healthierSgEnrolled', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-healthier-sg" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select</SelectItem>
                        {HEALTHIER_SG_FORM_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Appointment Type */}
              <section id="appointment-type" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>APPOINTMENT TYPE</h2>

                <p className="mb-5 text-gray-700" style={{ fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
                  There are several avenues where you can sign up for a mammogram. Please select one of the options below.
                </p>

                <div role="radiogroup" aria-label="Appointment Type" className="space-y-4">
                  {(
                    [
                      {
                        value: 'mammobus',
                        title: 'Community Mammobus Programme',
                        desc: 'An initiative by SCS, BCF, and NHGD to bring subsidised mammogram screenings to different neighbourhoods across Singapore.',
                        note: 'Note: The Mammobus is not wheelchair-accessible.',
                        tag: 'Available to all eligible clients',
                      },
                      {
                        value: 'scs-clinic',
                        title: 'SCS Clinic @ Bishan',
                        desc: 'Located at 9 Bishan Place, Junction 8 Office Tower, #06-05. Offers mammograms at no cost for eligible individuals with a Blue or Orange CHAS card, aged 50 and above.',
                        tag: 'You are eligible for this option',
                      },
                      {
                        value: 'healthier-sg',
                        title: 'Healthier SG Programme',
                        desc: 'The national health screening programme under Health Promotion Board. Book an appointment for any recommended subsidised screening test on HealthHub.',
                        tag: 'Available to Singapore Citizens',
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = formData.appointmentType === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="block cursor-pointer rounded-xl border p-5 transition-colors"
                        style={{
                          borderColor: selected ? '#B91C1C' : '#E5E7EB',
                          backgroundColor: selected ? 'rgba(185, 28, 28, 0.04)' : 'white',
                        }}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="appointmentType"
                          value={opt.value}
                          checked={selected}
                          onChange={() => handleInputChange('appointmentType', opt.value)}
                        />

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-gray-900" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                              {opt.title}
                            </div>
                          </div>
                          <div
                            aria-hidden="true"
                            className="mt-1 h-4 w-4 rounded-full border-2"
                            style={{
                              borderColor: selected ? '#B91C1C' : '#D1D5DB',
                              backgroundColor: selected ? '#B91C1C' : 'transparent',
                            }}
                          />
                        </div>

                        <p className="mt-2 text-gray-700" style={{ fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
                          {opt.desc}
                        </p>

                        {opt.note && (
                          <p className="mt-2 text-gray-500" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.45 }}>
                            <em>{opt.note}</em>
                          </p>
                        )}

                        <span
                          className="mt-3 inline-flex items-center rounded-full px-3 py-1"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#047857',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {opt.tag}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {formData.appointmentType === 'healthier-sg' && (
                <section id="healthier-sg-questions" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>HEALTHIER SG PROGRAMME</h2>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <div className="mb-2 uppercase tracking-wide text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                        QUESTION 1 OF 2
                      </div>
                      <div className="mb-4 text-gray-900" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)' }}>
                        Have you booked your Healthier SG mammogram screening yet?
                      </div>

                      <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label="Healthier SG booking status">
                        {(
                          [
                            { value: 'no', label: 'No' },
                            { value: 'yes', label: 'Yes' },
                          ] as const
                        ).map((o) => {
                          const selected = formData.healthierSgBooked === o.value;
                          return (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => handleInputChange('healthierSgBooked', o.value)}
                              className="rounded-md border px-4 py-3 font-medium transition-colors"
                              style={{
                                borderColor: selected ? 'var(--primary)' : '#D1D5DB',
                                backgroundColor: selected ? 'rgba(124, 58, 237, 0.06)' : 'white',
                                color: selected ? 'var(--primary)' : '#111827',
                                fontSize: 'var(--text-base)',
                              }}
                              aria-pressed={selected}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <div className="mb-2 uppercase tracking-wide text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                        QUESTION 2 OF 2
                      </div>
                      <div className="mb-4 text-gray-900" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)' }}>
                        When is the date of your screening?
                      </div>

                      <Input
                        placeholder="DD/MM/YYYY"
                        value={formData.healthierSgScreeningDate}
                        onChange={(e) => handleInputChange('healthierSgScreeningDate', e.target.value)}
                        disabled={formData.healthierSgBooked !== 'yes'}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Appointment Preferences (hidden for Healthier SG Programme) */}
              {formData.appointmentType !== 'healthier-sg' && (
                <section id="appointment" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                    APPOINTMENT PREFERENCES
                  </h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block"
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827',
                        }}
                      >
                        Preferred Screening Date<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <DdMmYyyyDateInput
                        id="field-preferred-screening-date"
                        value={formData.preferredScreeningDate}
                        onChange={(v) => handleInputChange('preferredScreeningDate', v)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="field-preferred-time-slot" className="mb-2 block text-base font-normal text-gray-900">
                        Preferred Time Slot
                      </Label>
                      <Select
                        value={formData.preferredTimeSlot || SEL_NONE}
                        onValueChange={(v) => handleInputChange('preferredTimeSlot', v === SEL_NONE ? '' : v)}
                      >
                        <SelectTrigger id="field-preferred-time-slot" className="w-full">
                          <SelectValue placeholder="Select Preferred Time Slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SEL_NONE}>Select Preferred Time Slot</SelectItem>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="field-screening-location-event" className="mb-2 block text-base font-normal text-gray-900">
                      Screening Location / Event
                    </Label>
                    <Input
                      id="field-screening-location-event"
                      placeholder="Enter Screening Location / Event"
                      value={formData.screeningLocationEvent}
                      onChange={(e) => handleInputChange('screeningLocationEvent', e.target.value)}
                    />
                  </div>
                </section>
              )}

              {/* Screening Questions Section */}
              <section id="screening" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  SCREENING QUESTIONS
                </h2>

                <div className="space-y-8">
                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Are you currently taking or will be taking COVID-19 vaccine soon? (If you are taking COVID-19
                      vaccine, it is advisable to go for your mammogram screening either before the vaccination, OR 6 weeks
                      after the vaccination)
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="covid19VaccineSoon"
                          value="no"
                          required
                          checked={formData.covid19VaccineSoon === 'no'}
                          onChange={(e) => handleInputChange('covid19VaccineSoon', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="covid19VaccineSoon"
                          value="yes"
                          checked={formData.covid19VaccineSoon === 'yes'}
                          onChange={(e) => handleInputChange('covid19VaccineSoon', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Have you done a mammogram in the past 12months (Only for those 40 to 49 years old) or 24months
                      (Only for those 50 years & above)?
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="mammogramPast12or24Months"
                          value="no"
                          required
                          className="mt-1 shrink-0"
                          checked={formData.mammogramPast12or24Months === 'no'}
                          onChange={(e) => handleInputChange('mammogramPast12or24Months', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="mammogramPast12or24Months"
                          value="yes"
                          className="mt-1 shrink-0"
                          checked={formData.mammogramPast12or24Months === 'yes'}
                          onChange={(e) => handleInputChange('mammogramPast12or24Months', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827', lineHeight: 1.45 }}>
                          Yes (If you have done a mammogram test in the past 12 months (Only for those 40 to 49 years
                          old) or 24months (Only for those 50 years & above), please arrange your appointment after 12
                          or 24 months have passed from your last test.)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Have you been breastfeeding in the past 6 months?
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastfeedingPast6Months"
                          value="no"
                          required
                          checked={formData.breastfeedingPast6Months === 'no'}
                          onChange={(e) => handleInputChange('breastfeedingPast6Months', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="breastfeedingPast6Months"
                          value="yes"
                          className="mt-1 shrink-0"
                          checked={formData.breastfeedingPast6Months === 'yes'}
                          onChange={(e) => handleInputChange('breastfeedingPast6Months', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827', lineHeight: 1.45 }}>
                          Yes (A screening mammogram is not recommended for you if you have been breastfeeding in the
                          past 6 months. Please make an appointment 6 months after you have stopped breastfeeding.)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Do you have any symptoms (e.g. lumps or pain) in your breast?
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastSymptoms"
                          value="no"
                          required
                          checked={formData.breastSymptoms === 'no'}
                          onChange={(e) => handleInputChange('breastSymptoms', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="breastSymptoms"
                          value="yes"
                          className="mt-1 shrink-0"
                          checked={formData.breastSymptoms === 'yes'}
                          onChange={(e) => handleInputChange('breastSymptoms', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827', lineHeight: 1.45 }}>
                          Yes (A screening mammogram is not recommended for you if you display symptoms in your
                          breast(s). Please consult your doctor for further advice.)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Do you have any breast implants?
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastImplants"
                          value="no"
                          required
                          checked={formData.breastImplants === 'no'}
                          onChange={(e) => handleInputChange('breastImplants', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="breastImplants"
                          value="yes"
                          className="mt-1 shrink-0"
                          checked={formData.breastImplants === 'yes'}
                          onChange={(e) => handleInputChange('breastImplants', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827', lineHeight: 1.45 }}>
                          Yes (Special screening techniques are required for women with implants. This service is not
                          available at NHG Diagnostics mammogram screening centres. Pls call any of the following Breast
                          Assessment Centres to make an appointment at National University Hospital (6772 2263) or Tan
                          Tock Seng Hospital (6357 8177).)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827',
                        lineHeight: 1.45,
                      }}
                    >
                      Have you ever had breast cancer?
                      <span style={{ color: '#DC2626' }}>*</span>
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="everHadBreastCancer"
                          value="no"
                          required
                          checked={formData.everHadBreastCancer === 'no'}
                          onChange={(e) => handleInputChange('everHadBreastCancer', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="everHadBreastCancer"
                          value="yes"
                          className="mt-1 shrink-0"
                          checked={formData.everHadBreastCancer === 'yes'}
                          onChange={(e) => handleInputChange('everHadBreastCancer', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827', lineHeight: 1.45 }}>
                          Yes (A screening mammogram is not recommended for you if you have a history of breast cancer
                          and have not been discharged. You are advised to consult your doctor for follow up sessions on
                          your condition.)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Engagement */}
              <section id="engagement" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  ENGAGEMENT
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Source Type */}
                  <div>
                    <Label htmlFor="field-source-type" className="mb-2 block text-base font-normal text-gray-900">
                      How did you hear about us?<span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.sourceType || SEL_NONE}
                      onValueChange={(v) => handleInputChange('sourceType', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-source-type" className="w-full">
                        <SelectValue placeholder="Select Source Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select Source Type</SelectItem>
                        <SelectItem value="Event">Event / Roadshow</SelectItem>
                        <SelectItem value="Campaign">Campaign</SelectItem>
                        <SelectItem value="Referral">Referral from Friend/Family</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Walk-in">Walk-in</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Source Name / Campaign */}
                  <div>
                    <label 
                      className="block mb-2" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Campaign / Event Name
                    </label>
                    <Input
                      placeholder="e.g. Pink for Life 2025"
                      value={formData.sourceName}
                      onChange={(e) => handleInputChange('sourceName', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Consent */}
              <section id="consent" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className={FORM_CARD_SECTION_TITLE_CLASS}>
                  CONSENT
                </h2>

                {/* Consent Text */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Checkbox
                      checked={formData.consent}
                      onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                      id="consent"
                    />
                    <label 
                      htmlFor="consent"
                      style={{
                        fontSize: 'var(--text-base)',
                        color: '#111827',
                        lineHeight: '1.5'
                      }}
                    >
                      By registering, I consent to{' '}
                      <a 
                        href="#" 
                        style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                      >
                        Singapore Cancer Society's Privacy Policy
                      </a>
                      {' '}and them contacting me for screening appointments, health-related communications, and programme updates.<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                  </div>

                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: '#111827',
                    lineHeight: '1.5',
                    marginBottom: '16px'
                  }}>
                    I wish to receive communications on SCS' activities, programs and services via the following channels, please{' '}
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>TICK</span>
                    {' '}the relevant box(es):
                  </p>

                  {/* Communication Preferences Table */}
                  <div className="space-y-3">
                    {/* SMS */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>SMS</span>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="sms"
                            value="yes"
                            checked={formData.smsConsent === 'yes'}
                            onChange={(e) => handleInputChange('smsConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="sms"
                            value="no"
                            checked={formData.smsConsent === 'no'}
                            onChange={(e) => handleInputChange('smsConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Phone Call */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Phone Call</span>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="phone"
                            value="yes"
                            checked={formData.phoneConsent === 'yes'}
                            onChange={(e) => handleInputChange('phoneConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="phone"
                            value="no"
                            checked={formData.phoneConsent === 'no'}
                            onChange={(e) => handleInputChange('phoneConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                        </label>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>WhatsApp</span>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="whatsapp"
                            value="yes"
                            checked={formData.whatsappConsent === 'yes'}
                            onChange={(e) => handleInputChange('whatsappConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="whatsapp"
                            value="no"
                            checked={formData.whatsappConsent === 'no'}
                            onChange={(e) => handleInputChange('whatsappConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between py-2">
                      <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Email</span>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="email"
                            value="yes"
                            checked={formData.emailConsent === 'yes'}
                            onChange={(e) => handleInputChange('emailConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="email"
                            value="no"
                            checked={formData.emailConsent === 'no'}
                            onChange={(e) => handleInputChange('emailConsent', e.target.value)}
                          />
                          <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
