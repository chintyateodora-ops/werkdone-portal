import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ChevronLeft, Calendar, Link2, Check, CheckCircle2, X } from 'lucide-react';
import { Page } from '../../App';
import { Checkbox } from '../ui/checkbox';
import { Footer } from '../Footer';
import { toast } from 'sonner@2.0.3';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

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
  const [activeSection, setActiveSection] = useState('personal');
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
    postalCode: '',
    blockNumber: '',
    streetName: '',
    unitNumber: '',
    buildingName: '',
    
    // Programme Selection
    programme: '',
    
    // Screening Questions
    lastMammogram: '',
    breastSymptoms: '',
    breastSurgery: '',
    pregnant: '',
    breastfeeding: '',
    breastImplants: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: '',
    
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
    { value: 'mammobus', label: 'Community Mammobus Programme', available: true },
    { value: 'hpv', label: 'HPV Screening Programme', available: false },
    { value: 'fit', label: 'FIT Screening Programme', available: false }
  ];

  const getFormTitle = () => {
    const form = formTypes.find(f => f.value === selectedFormType);
    return form?.label || 'Community Mammobus Programme';
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
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            <button
              type="button"
              onClick={() => scrollToSection('personal')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'personal' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'personal' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Personal Information
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('programme')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'programme' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'programme' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Programme Selection
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('screening')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'screening' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'screening' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Screening Questions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('emergency')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'emergency' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'emergency' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Emergency Contact
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('medical')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'medical' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'medical' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Medical History
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('source')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'source' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'source' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Source Information
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pdpa')}
              className="w-full text-left px-4 py-2 rounded mb-1 transition-colors"
              style={{
                backgroundColor: activeSection === 'pdpa' ? 'rgba(242, 238, 246)' : 'transparent',
                color: activeSection === 'pdpa' ? 'var(--primary)' : '#6B7280',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              PDPA Consent
            </button>
          </nav>
        </div>

        {/* Right content area */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="min-h-0 flex-1">
            <div className="max-w-4xl mx-auto p-6">
              {/* Personal Information Section */}
              <section id="personal" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  PERSONAL INFORMATION
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label 
                      className="block mb-2" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Full Name (as per NRIC)<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <Input
                      placeholder="Enter full name as in NRIC"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  {/* Grid Row - NRIC and DOB */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* NRIC / FIN Number */}
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        NRIC / FIN Number<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <Input
                        placeholder="Enter NRIC No."
                        value={formData.nric}
                        onChange={(e) => handleInputChange('nric', e.target.value)}
                        required
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Date of Birth<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="DD-MM-YYYY"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Grid Row - Gender, Residential Status, Race */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Gender */}
                    <div>
                      <Label htmlFor="field-gender" className="mb-2 block text-base font-normal text-gray-900">
                        Gender<span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.gender || SEL_NONE}
                        onValueChange={(v) => handleInputChange('gender', v === SEL_NONE ? '' : v)}
                      >
                        <SelectTrigger id="field-gender" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SEL_NONE}>Select</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Residential Status */}
                    <div>
                      <Label htmlFor="field-residential" className="mb-2 block text-base font-normal text-gray-900">
                        Residential Status<span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.residentialStatus || SEL_NONE}
                        onValueChange={(v) => handleInputChange('residentialStatus', v === SEL_NONE ? '' : v)}
                      >
                        <SelectTrigger id="field-residential" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SEL_NONE}>Select</SelectItem>
                          <SelectItem value="Citizen">Singapore Citizen</SelectItem>
                          <SelectItem value="PR">Permanent Resident</SelectItem>
                          <SelectItem value="Foreigner">Foreigner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Race */}
                    <div>
                      <Label htmlFor="field-race" className="mb-2 block text-base font-normal text-gray-900">
                        Race<span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.race || SEL_NONE}
                        onValueChange={(v) => handleInputChange('race', v === SEL_NONE ? '' : v)}
                      >
                        <SelectTrigger id="field-race" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SEL_NONE}>Select</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                          <SelectItem value="Malay">Malay</SelectItem>
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="Eurasian">Eurasian</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Grid Row - Mobile and Email */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Mobile Number */}
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Mobile Number<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="w-20">
                          <Input
                            value="+65"
                            disabled
                            className="bg-gray-100 text-center"
                          />
                        </div>
                        <Input
                          placeholder="E.g. 8123 4567"
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label 
                        className="block mb-2" 
                        style={{ 
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: '#111827'
                        }}
                      >
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t pt-6">
                    <h3 style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#111827',
                      marginBottom: '16px'
                    }}>
                      Residential Address
                    </h3>

                    <div className="space-y-6">
                      {/* Postal Code */}
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

                      {/* Grid Row - Block and Street */}
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

                      {/* Grid Row - Unit and Building */}
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
                  </div>
                </div>
              </section>

              {/* Programme Selection Section */}
              <section id="programme" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  PROGRAMME SELECTION
                </h2>

                <div>
                  <Label htmlFor="field-programme" className="mb-2 block text-base font-normal text-gray-900">
                    Which screening programme would you like to sign up for?<span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.programme || SEL_NONE}
                    onValueChange={(v) => handleInputChange('programme', v === SEL_NONE ? '' : v)}
                  >
                    <SelectTrigger id="field-programme" className="w-full">
                      <SelectValue placeholder="Select Programme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SEL_NONE}>Select Programme</SelectItem>
                      <SelectItem value="mammobus">Mammobus (Mammography Screening)</SelectItem>
                      <SelectItem value="hpv">HPV Screening</SelectItem>
                      <SelectItem value="fit">FIT (Faecal Immunochemical Test)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* Screening Questions Section */}
              <section id="screening" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  SCREENING QUESTIONS
                </h2>

                <div className="space-y-6">
                  {/* Last Mammogram */}
                  <div>
                    <Label htmlFor="field-last-mammogram" className="mb-2 block text-base font-normal text-gray-900">
                      When was your last mammogram?<span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.lastMammogram || SEL_NONE}
                      onValueChange={(v) => handleInputChange('lastMammogram', v === SEL_NONE ? '' : v)}
                    >
                      <SelectTrigger id="field-last-mammogram" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEL_NONE}>Select</SelectItem>
                        <SelectItem value="never">Never had a mammogram</SelectItem>
                        <SelectItem value="<1year">Less than 1 year ago</SelectItem>
                        <SelectItem value="1-2years">1-2 years ago</SelectItem>
                        <SelectItem value=">2years">More than 2 years ago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Breast Symptoms */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Do you have any of the following breast symptoms?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastSymptoms"
                          value="yes"
                          checked={formData.breastSymptoms === 'yes'}
                          onChange={(e) => handleInputChange('breastSymptoms', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastSymptoms"
                          value="no"
                          checked={formData.breastSymptoms === 'no'}
                          onChange={(e) => handleInputChange('breastSymptoms', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: '#6B7280',
                      marginTop: '8px'
                    }}>
                      Lump, nipple discharge, skin changes, or pain
                    </p>
                  </div>

                  {/* Breast Surgery */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Have you had any breast surgery?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastSurgery"
                          value="yes"
                          checked={formData.breastSurgery === 'yes'}
                          onChange={(e) => handleInputChange('breastSurgery', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastSurgery"
                          value="no"
                          checked={formData.breastSurgery === 'no'}
                          onChange={(e) => handleInputChange('breastSurgery', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>
                  </div>

                  {/* Pregnant */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Are you currently pregnant?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pregnant"
                          value="yes"
                          checked={formData.pregnant === 'yes'}
                          onChange={(e) => handleInputChange('pregnant', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pregnant"
                          value="no"
                          checked={formData.pregnant === 'no'}
                          onChange={(e) => handleInputChange('pregnant', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pregnant"
                          value="unsure"
                          checked={formData.pregnant === 'unsure'}
                          onChange={(e) => handleInputChange('pregnant', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Unsure</span>
                      </label>
                    </div>
                  </div>

                  {/* Breastfeeding */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Are you currently breastfeeding?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastfeeding"
                          value="yes"
                          checked={formData.breastfeeding === 'yes'}
                          onChange={(e) => handleInputChange('breastfeeding', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastfeeding"
                          value="no"
                          checked={formData.breastfeeding === 'no'}
                          onChange={(e) => handleInputChange('breastfeeding', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>
                  </div>

                  {/* Breast Implants */}
                  <div>
                    <label 
                      className="block mb-3" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Do you have breast implants?<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastImplants"
                          value="yes"
                          checked={formData.breastImplants === 'yes'}
                          onChange={(e) => handleInputChange('breastImplants', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="breastImplants"
                          value="no"
                          checked={formData.breastImplants === 'no'}
                          onChange={(e) => handleInputChange('breastImplants', e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--text-base)', color: '#111827' }}>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Emergency Contact Section */}
              <section id="emergency" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  EMERGENCY CONTACT
                </h2>

                <div className="space-y-6">
                  {/* Emergency Contact Name */}
                  <div>
                    <label 
                      className="block mb-2" 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#111827'
                      }}
                    >
                      Emergency Contact Name<span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <Input
                      placeholder="Enter emergency contact name"
                      value={formData.emergencyName}
                      onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                      required
                    />
                  </div>

                  {/* Grid Row - Relationship and Contact */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="field-emergency-relationship" className="mb-2 block text-base font-normal text-gray-900">
                        Relationship<span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.emergencyRelationship || SEL_NONE}
                        onValueChange={(v) => handleInputChange('emergencyRelationship', v === SEL_NONE ? '' : v)}
                      >
                        <SelectTrigger id="field-emergency-relationship" className="w-full">
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SEL_NONE}>Select Relationship</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Emergency Contact Number<span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="w-20">
                          <Input
                            value="+65"
                            disabled
                            className="bg-gray-100 text-center"
                          />
                        </div>
                        <Input
                          placeholder="E.g. 8123 4567"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Medical History Section */}
              <section id="medical" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  MEDICAL HISTORY
                </h2>

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

                  {/* Personal Cancer History */}
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

                  {/* Medical Conditions */}
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

              {/* Source Information Section */}
              <section id="source" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  SOURCE INFORMATION
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

              {/* PDPA Consent Section */}
              <section id="pdpa" className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  PDPA CONSENT
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
          <Footer />
        </div>
      </div>
    </div>
  );
}
