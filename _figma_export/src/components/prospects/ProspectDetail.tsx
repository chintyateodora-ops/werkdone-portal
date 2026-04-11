import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ChevronLeft, Phone, Mail, Calendar, User, Check, Plus, MoreHorizontal, FileText, Clock, AlertCircle, Copy, RefreshCw, Edit2, Trash2, ChevronDown, ChevronUp, Upload, Download, Search, Filter, Columns, ArrowUpDown, Tag } from 'lucide-react';
import { Page } from '../../App';
import { Footer } from '../Footer';
import { CreateTaskDialog } from './CreateTaskDialog';
import { AddContactLogDialog } from './AddContactLogDialog';
import { AddNoteDialog } from './AddNoteDialog';
import { ManualRouteDialog } from './ManualRouteDialog';
import { AddTagDialog } from './AddTagDialog';
import { EditableField, EditableTextArea, EditableSelect } from './EditableField';

interface ProspectDetailProps {
  onNavigate: (page: Page) => void;
  prospectId: string;
}

// NoteCard Component with expandable content
function NoteCard({ 
  author, 
  role, 
  timestamp, 
  content, 
  fullContent 
}: { 
  author: string; 
  role: string; 
  timestamp: string; 
  content: string; 
  fullContent: string; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border p-4" style={{ borderColor: '#E9ECEF' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
              {author}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
              • {role}
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
            {timestamp}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded" title="Edit note">
            <Edit2 className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="Delete note">
            <Trash2 className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
        </div>
      </div>
      
      <p style={{ 
        fontSize: 'var(--text-sm)', 
        fontWeight: 'var(--font-weight-normal)', 
        color: '#374151',
        lineHeight: '1.5'
      }}>
        {isExpanded ? fullContent : content}
      </p>
      
      {fullContent !== content && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 hover:opacity-70"
          style={{ 
            color: 'var(--primary)', 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-medium)' 
          }}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// DocumentRow Component with hover states
function DocumentRow({ 
  name, 
  source, 
  uploadedOn, 
  uploadedBy 
}: { 
  name: string; 
  source: string; 
  uploadedOn: string; 
  uploadedBy: string; 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);
  const [actionHovered, setActionHovered] = useState(false);
  
  return (
    <tr 
      className="border-t"
      style={{ borderColor: '#E9ECEF' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="py-3 px-4">
        <div 
          className="relative inline-block"
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
        >
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-weight-normal)', 
            color: 'var(--primary)',
            cursor: 'pointer'
          }}>
            {name}
          </span>
          {nameHovered && (
            <div className="absolute left-0 top-full mt-1 z-10">
              <Button
                size="sm"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  whiteSpace: 'nowrap'
                }}
              >
                View Document
              </Button>
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#374151' }}>
        {source}
      </td>
      <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#374151' }}>
        {uploadedOn}
      </td>
      <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#374151' }}>
        {uploadedBy}
      </td>
      <td className="py-3 px-4">
        <div 
          className="relative inline-flex gap-2"
          onMouseEnter={() => setActionHovered(true)}
          onMouseLeave={() => setActionHovered(false)}
        >
          {!actionHovered ? (
            <>
              <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                <Download className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                <Trash2 className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                style={{
                  borderColor: '#CED4DA',
                  color: '#374151',
                  backgroundColor: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                className="hover:bg-gray-50"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                style={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  backgroundColor: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                className="hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// Stage checklist labels
function getStageChecklistLabels(stage: string) {
  const labels: Record<string, string[]> = {
    'Enquiring': [
      'Full name and date of birth collected',
      'NRIC / FIN number recorded',
      'Residency status confirmed (SC / PR / Foreigner)',
      'Mobile number and email captured',
      'Age eligibility confirmed (40 years and above)',
      'Not currently pregnant or breastfeeding',
      'No active breast symptoms present',
      'Date of last mammogram established',
      'Healthier SG or CHAS enrolment checked',
      'First-time screener status noted'
    ],
    'Qualified': [
      'All eligibility criteria met and documented',
      'Subsidy pathway confirmed (Healthier SG / CHAS / self-pay)',
      'Preferred screening date and time captured',
      'Mammobus location / event communicated',
      'Pre-screening instructions shared (no deodorant etc.)',
      'What to bring explained (NRIC, two-piece clothing)',
      'COVID vaccination date noted if within 6 weeks',
      'Family history of breast cancer documented',
      'Any implants or prior surgery flagged for radiographer',
      'Consent to data collection obtained (PDPA)'
    ],
    'Booked': [
      'Appointment confirmation sent (SMS / email)',
      'Reminder sent 1 week before appointment',
      'Reminder sent 3 days before appointment',
      'No-show deposit process explained',
      'Transport or logistics support offered if needed',
      'Emergency contact details collected',
      'Day-of checklist shared with participant',
      'Coordinator notified of any special requirements'
    ],
    'Screened': [
      'Attendance confirmed on screening day',
      'Screening completed without issues',
      'Results communication timeline explained',
      'Results sent / received by participant',
      'Abnormal results — referral pathway activated',
      'Normal results — next screening date communicated',
      'Participant satisfaction / feedback collected',
      'Peer referral ask made (refer a friend)',
      'Re-engagement reminder set (12 or 24 months)',
      'Record updated in system'
    ]
  };
  
  return labels[stage] || [];
}

// Mock data - will be replaced with actual data fetching
const mockProspectData: Record<string, any> = {
  'PROS-001234': {
    id: 'PROS-00123',
    name: 'Lee Wei Xiong',
    gender: 'Female',
    age: 69,
    mobile: '9876 5432',
    email: 'email@email.com',
    lastContacted: '6 November 2025',
    source: 'Roadshow',
    assignTo: 'Jasmine Lim',
    status: 'Screening',
    tags: ['Screening', 'High Risk'],
    currentStage: 'Enquiring',
    stages: [
      { name: 'Enquiring', completed: true, current: true },
      { name: 'Qualified', completed: false },
      { name: 'Booked', completed: false },
      { name: 'Screened', completed: false }
    ]
  }
};

export function ProspectDetail({ onNavigate, prospectId }: ProspectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'appointments' | 'notes' | 'document' | 'medical-history' | 'other-details' | 'screening'>('overview');
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [activeRoutingSection, setActiveRoutingSection] = useState<string>('eligibility');
  const [activeMedicalSection, setActiveMedicalSection] = useState<string>('family-cancer');
  const [activeOtherDetailsSection, setActiveOtherDetailsSection] = useState<string>('other-medical');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isAddContactLogOpen, setIsAddContactLogOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isManualRouteOpen, setIsManualRouteOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('Enquiring');
  const [stageChecklists, setStageChecklists] = useState<Record<string, boolean[]>>({
    'Enquiring': [true, true, true, true, true, false, false, false, false, false],
    'Qualified': [false, false, false, false, false, false, false, false, false, false],
    'Booked': [false, false, false, false, false, false, false, false],
    'Screened': [false, false, false, false, false, false, false, false, false, false]
  });
  
  // Edit mode states
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingMedicalHistory, setIsEditingMedicalHistory] = useState(false);
  const [isEditingOtherDetails, setIsEditingOtherDetails] = useState(false);
  
  // Form data states
  const [detailsFormData, setDetailsFormData] = useState({
    name: 'Lee Wei Xiong',
    nric: 'S1234567D',
    gender: 'Female',
    dateOfBirth: '1956-03-15',
    age: '69',
    mobile: '9876 5432',
    email: 'email@email.com',
    residentialStatus: 'Citizen',
    preferredLanguage: 'English',
    race: 'Chinese',
    address: '123 Bedok North Street 1, #05-123, Singapore 460123',
    postalCode: '460123',
    source: 'Roadshow',
    sourceDetail: 'Community Health Roadshow - Bedok',
    referredBy: 'Dr. Sarah Tan',
    programEnrolled: 'Mammobus',
    subsidyType: 'Healthier SG',
    hasChronicConditions: 'Yes',
    chronicConditions: 'Hypertension, Diabetes',
    currentMedications: 'Metformin, Lisinopril',
    allergies: 'Penicillin',
    smokingStatus: 'Non-smoker',
    alcoholConsumption: 'Occasional',
    riskLevel: 'High',
    riskFactors: 'Family history of breast cancer, Age above 60',
    pdpaConsent: 'Yes',
    consentDate: '2025-11-01',
    marketingConsent: 'No'
  });
  
  const [medicalHistoryFormData, setMedicalHistoryFormData] = useState({
    familyCancerHistory: 'Yes',
    relativesWithCancer: 'Mother (Breast Cancer), Aunt (Ovarian Cancer)',
    personalCancerHistory: 'No',
    previousScreenings: 'Mammogram (2023), Pap Smear (2024)',
    abnormalResults: 'No',
    treatmentHistory: 'None',
    breastSurgery: 'No',
    breastSymptoms: 'No',
    lastMammogramDate: '2023-06-15',
    pregnancyStatus: 'Not applicable',
    breastfeeding: 'No',
    hormonalTherapy: 'No',
    implants: 'No',
    historyOfCancer: 'No',
    diagnosedYear: '-',
    cancerDetail: '-',
    followUpAt: '-',
    surgery: 'No',
    radiationTherapy: 'No',
    chemotherapy: 'No'
  });
  
  const [otherDetailsFormData, setOtherDetailsFormData] = useState({
    emergencyContactName: 'John Doe',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9123 4567',
    preferredContactTime: 'Morning (9am - 12pm)',
    transportNeeded: 'No',
    languageSupport: 'No',
    accessibilityNeeds: 'Wheelchair access required',
    dietaryRestrictions: 'None',
    religiousConsiderations: 'None',
    insurance: 'Yes',
    insuranceProvider: 'AIA',
    policyNumber: 'AIA123456789',
    employmentStatus: 'Retired',
    education: 'Secondary',
    householdIncome: '$2,000 - $4,000',
    otherMedicalIllness: '1) Left breast abscess surgery, drainage done 3x in 2010 @NCC\n2) Depression, OCD (cu IHH, on Fluoxetine)\n3) L5CS x1 (2006)\n4) L3, L4, L5, S1 bone degeneration, spinal stenosis admitted to NUH in 2018',
    currentMedication: 'Fluoxetine',
    drugAllergy: 'No',
    immunosuppressiveCondition: 'No',
    ageFirstIntercourse: '16',
    multipleSexualPartners: 'Yes',
    smoking: 'Yes',
    smokingDuration: '30',
    sexuallyTransmittedInfections: 'No',
    ocpUse: '0',
    childrenCount: '1',
    hpvVaccinated: 'No',
    cervicalOtherDetails: 'Started smoking at age 24 years old, currently smokes about 8 cig/day. Advised to stop smoking.',
    lastPapTestDate: '4/2/21',
    lastPapTestResult: 'Negative',
    lastMammogramDate: '6/4/26',
    chasCardHolder: 'Yes',
    ageAtMenarche: '12',
    ageAtMenopause: '48',
    ageAtFirstChildbirth: '36',
    hrtDuration: '',
    preMalignantConditions: 'No',
    breastConditionsDetails: 'Breast abscesses x3 in 2012, drainage op done. Now ok'
  });
  
  const [prospectTags, setProspectTags] = useState<Array<{
    id: number;
    name: string;
    category: string;
    color: string;
    textColor: string;
    borderColor: string;
  }>>([
    {
      id: 5,
      name: 'Screening',
      category: 'Screening Stage',
      color: '#F3F4F6',
      textColor: '#374151',
      borderColor: '#E5E7EB'
    },
    {
      id: 3,
      name: 'High Risk',
      category: 'Risk',
      color: '#FEE2E2',
      textColor: '#DC2626',
      borderColor: '#FECACA'
    }
  ]);
  const [tasks, setTasks] = useState<Array<{
    id: string;
    name: string;
    dueDate: string;
    dueTime: string;
    status: 'overdue' | 'upcoming';
    completed: boolean;
  }>>([
    {
      id: '1',
      name: 'Follow up on screening appointment',
      dueDate: 'Nov 18, 2025',
      dueTime: '10:00 AM',
      status: 'overdue',
      completed: false
    },
    {
      id: '2',
      name: 'Send reminder email for health assessment',
      dueDate: 'Nov 22, 2025',
      dueTime: '2:00 PM',
      status: 'upcoming',
      completed: false
    },
    {
      id: '3',
      name: 'Review client documentation',
      dueDate: 'Nov 25, 2025',
      dueTime: '11:00 AM',
      status: 'upcoming',
      completed: false
    }
  ]);
  const [contactLogs, setContactLogs] = useState<Array<{
    id: string;
    contactType: string;
    date: string;
    time: string;
    duration: string;
    recordedBy: string;
    outcome: string;
    message: string;
    notes: string;
  }>>([
    {
      id: '1',
      contactType: 'Phone Call',
      date: 'Nov 15, 2025',
      time: '10:30 AM',
      duration: '15',
      recordedBy: 'Jasmine Lim',
      outcome: 'Successful Contact',
      message: 'Follow-up call regarding screening appointment',
      notes: 'Client confirmed availability for next week. Expressed interest in learning more about our cancer screening programs.'
    },
    {
      id: '2',
      contactType: 'Email',
      date: 'Nov 10, 2025',
      time: '2:15 PM',
      duration: '5',
      recordedBy: 'Sarah Tan',
      outcome: 'Appointment Scheduled',
      message: 'Initial outreach email sent',
      notes: 'Sent detailed information about screening services and available appointment slots.'
    },
    {
      id: '3',
      contactType: 'In-Person Meeting',
      date: 'Nov 5, 2025',
      time: '11:00 AM',
      duration: '30',
      recordedBy: 'Michael Wong',
      outcome: 'Follow-up Required',
      message: 'Roadshow interaction at Tampines Hub',
      notes: 'Met client at community roadshow. Discussed health concerns and provided educational materials. Client requested callback for appointment scheduling.'
    }
  ]);
  
  // Get prospect data or default
  const prospect = mockProspectData[prospectId] || mockProspectData['PROS-001234'];

  // Handle task creation
  const handleCreateTask = (taskData: { name: string; dueDate: string; dueTime: string }) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskData.name,
      dueDate: new Date(taskData.dueDate + ' ' + taskData.dueTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      dueTime: new Date(taskData.dueDate + ' ' + taskData.dueTime).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      status: new Date(taskData.dueDate + ' ' + taskData.dueTime) < new Date() ? 'overdue' : 'upcoming' as 'overdue' | 'upcoming',
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Handle contact log creation
  const handleAddContactLog = (logData: {
    contactType: string;
    date: string;
    time: string;
    duration: string;
    recordedBy: string;
    outcome: string;
    message: string;
    notes: string;
  }) => {
    const newLog = {
      id: Date.now().toString(),
      contactType: logData.contactType,
      date: new Date(logData.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: new Date(logData.date + ' ' + logData.time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      duration: logData.duration,
      recordedBy: logData.recordedBy,
      outcome: logData.outcome,
      message: logData.message,
      notes: logData.notes
    };
    setContactLogs(prev => [newLog, ...prev]);
  };

  // Handle edit mode for Details tab
  const handleEditDetails = () => {
    setIsEditingDetails(true);
  };

  const handleSaveDetails = () => {
    setIsEditingDetails(false);
    // Save logic here - would typically call an API
  };

  const handleCancelDetails = () => {
    setIsEditingDetails(false);
    // Reset form data to original values
    setDetailsFormData({
      name: 'Lee Wei Xiong',
      nric: 'S1234567D',
      gender: 'Female',
      dateOfBirth: '1956-03-15',
      age: '69',
      mobile: '9876 5432',
      email: 'email@email.com',
      residentialStatus: 'Citizen',
      preferredLanguage: 'English',
      race: 'Chinese',
      address: '123 Bedok North Street 1, #05-123, Singapore 460123',
      postalCode: '460123',
      source: 'Roadshow',
      sourceDetail: 'Community Health Roadshow - Bedok',
      referredBy: 'Dr. Sarah Tan',
      programEnrolled: 'Mammobus',
      subsidyType: 'Healthier SG',
      hasChronicConditions: 'Yes',
      chronicConditions: 'Hypertension, Diabetes',
      currentMedications: 'Metformin, Lisinopril',
      allergies: 'Penicillin',
      smokingStatus: 'Non-smoker',
      alcoholConsumption: 'Occasional',
      riskLevel: 'High Risk',
      riskFactors: 'Family history of breast cancer, Age above 60',
      pdpaConsent: 'Yes',
      consentDate: '2025-11-01',
      marketingConsent: 'No'
    });
  };

  // Handle edit mode for Medical History tab
  const handleEditMedicalHistory = () => {
    setIsEditingMedicalHistory(true);
  };

  const handleSaveMedicalHistory = () => {
    setIsEditingMedicalHistory(false);
    // Save logic here
  };

  const handleCancelMedicalHistory = () => {
    setIsEditingMedicalHistory(false);
    // Reset form data
    setMedicalHistoryFormData({
      familyCancerHistory: 'Yes',
      relativesWithCancer: 'Mother (Breast Cancer), Aunt (Ovarian Cancer)',
      personalCancerHistory: 'No',
      previousScreenings: 'Mammogram (2023), Pap Smear (2024)',
      abnormalResults: 'No',
      treatmentHistory: 'None',
      breastSurgery: 'No',
      breastSymptoms: 'No',
      lastMammogramDate: '2023-06-15',
      pregnancyStatus: 'Not applicable',
      breastfeeding: 'No',
      hormonalTherapy: 'No',
      implants: 'No'
    });
  };

  // Handle edit mode for Other Details tab
  const handleEditOtherDetails = () => {
    setIsEditingOtherDetails(true);
  };

  const handleSaveOtherDetails = () => {
    setIsEditingOtherDetails(false);
    // Save logic here
  };

  const handleCancelOtherDetails = () => {
    setIsEditingOtherDetails(false);
    // Reset form data
    setOtherDetailsFormData({
      emergencyContactName: 'John Doe',
      emergencyContactRelation: 'Spouse',
      emergencyContactPhone: '9123 4567',
      preferredContactTime: 'Morning (9am - 12pm)',
      transportNeeded: 'No',
      languageSupport: 'No',
      accessibilityNeeds: 'Wheelchair access required',
      dietaryRestrictions: 'None',
      religiousConsiderations: 'None',
      insurance: 'Yes',
      insuranceProvider: 'AIA',
      policyNumber: 'AIA123456789',
      employmentStatus: 'Retired',
      education: 'Secondary',
      householdIncome: '$2,000 - $4,000',
      otherMedicalIllness: '1) Left breast abscess surgery, drainage done 3x in 2010 @NCC\n2) Depression, OCD (cu IHH, on Fluoxetine)\n3) L5CS x1 (2006)\n4) L3, L4, L5, S1 bone degeneration, spinal stenosis admitted to NUH in 2018',
      currentMedication: 'Fluoxetine',
      drugAllergy: 'No',
      immunosuppressiveCondition: 'No',
      ageFirstIntercourse: '16',
      multipleSexualPartners: 'Yes',
      smoking: 'Yes',
      smokingDuration: '30',
      sexuallyTransmittedInfections: 'No',
      ocpUse: '0',
      childrenCount: '1',
      hpvVaccinated: 'No',
      cervicalOtherDetails: 'Started smoking at age 24 years old, currently smokes about 8 cig/day. Advised to stop smoking.'
    });
  };

  // Handle checklist toggle
  const handleChecklistToggle = (stage: string, index: number) => {
    setStageChecklists(prev => ({
      ...prev,
      [stage]: prev[stage].map((completed, i) => i === index ? !completed : completed)
    }));
  };

  // Get checklist data with completion state
  const getStageChecklistData = (stage: string) => {
    const labels = getStageChecklistLabels(stage);
    const completions = stageChecklists[stage] || [];
    return labels.map((label, index) => ({
      label,
      completed: completions[index] || false
    }));
  };

  // Get task completion stats for current stage
  const getTaskStats = () => {
    const checklistData = getStageChecklistData(prospect.currentStage);
    const completed = checklistData.filter(t => t.completed).length;
    const total = checklistData.length;
    return { completed, total };
  };

  // State for notes
  const [notes, setNotes] = useState<Array<{
    id: string;
    author: string;
    role: string;
    timestamp: string;
    content: string;
  }>>([
    {
      id: '1',
      author: 'Jasmine Lim',
      role: 'Care Coordinator',
      timestamp: 'Nov 15, 2025 at 3:45 PM',
      content: 'Client expressed strong interest in attending screening workshops. Recommend enrolling in upcoming December session at Bedok Community Center.'
    },
    {
      id: '2',
      author: 'Sarah Tan',
      role: 'Outreach Specialist',
      timestamp: 'Nov 10, 2025 at 10:30 AM',
      content: 'Follow-up needed regarding insurance coverage questions. Client mentioned family history of breast cancer - flagging for priority screening.'
    }
  ]);

  // Handle note creation
  const handleAddNote = (noteContent: string) => {
    const newNote = {
      id: Date.now().toString(),
      author: 'Jasmine Lim',
      role: 'Care Coordinator',
      timestamp: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' at ' + new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      content: noteContent
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'medical-history', label: 'Medical History' },
    { id: 'other-details', label: 'Other Details' },
    { id: 'screening', label: 'Screening' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'notes', label: 'Notes' },
    { id: 'document', label: 'Document' }
  ];

  // Scroll tracking for table of contents
  useEffect(() => {
    if (activeTab !== 'details') return;

    const sections = [
      { id: 'basic', element: document.getElementById('basic') },
      { id: 'source', element: document.getElementById('source') },
      { id: 'service', element: document.getElementById('service') },
      { id: 'health', element: document.getElementById('health') },
      { id: 'risk', element: document.getElementById('risk') },
      { id: 'pdpa', element: document.getElementById('pdpa') }
    ].filter(s => s.element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: [0, 0.3, 0.6, 1]
      }
    );

    sections.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(({ element }) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [activeTab]);

  // Scroll tracking for medical history sections
  useEffect(() => {
    if (activeTab !== 'medical-history') return;

    const sections = [
      { id: 'family-cancer', element: document.getElementById('family-cancer') },
      { id: 'history-cancer', element: document.getElementById('history-cancer') },
      { id: 'treatment', element: document.getElementById('treatment') }
    ].filter(s => s.element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveMedicalSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: [0, 0.3, 0.6, 1]
      }
    );

    sections.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(({ element }) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [activeTab]);

  // Scroll tracking for other details sections
  useEffect(() => {
    if (activeTab !== 'other-details') return;

    const sections = [
      { id: 'other-medical', element: document.getElementById('other-medical') },
      { id: 'cervical-risk', element: document.getElementById('cervical-risk') },
      { id: 'other-info', element: document.getElementById('other-info') },
      { id: 'breast-risk', element: document.getElementById('breast-risk') }
    ].filter(s => s.element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveOtherDetailsSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: [0, 0.3, 0.6, 1]
      }
    );

    sections.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(({ element }) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [activeTab]);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="flex-1 overflow-auto">
        <div className="bg-white">
          {/* Breadcrumb */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={() => onNavigate('all-prospects')} style={{ color: 'var(--primary)' }} className="hover:underline">Prospect Management</button>
              <span>›</span>
              <span className="text-gray-900">{prospect.id}</span>
            </div>
          </div>

          {/* Header with Back Button and Name */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('all-prospects')}
                className="flex items-center hover:opacity-70"
                style={{ color: '#111827' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                {prospect.name}
              </h1>
            </div>
          </div>

          {/* Key Info Row */}
          <div className="px-6 pb-6 flex items-center gap-3">
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
              {prospect.gender} • {prospect.age} years • Last Contacted: {prospect.lastContacted}
            </span>
            {detailsFormData.riskLevel && (
              <span
                className="px-3 py-1 rounded"
                style={{
                  backgroundColor: detailsFormData.riskLevel === 'High' ? '#FEE2E2' : 
                                 detailsFormData.riskLevel === 'Moderate' ? '#FEF3C7' : 
                                 '#DBEAFE',
                  color: detailsFormData.riskLevel === 'High' ? '#DC2626' : 
                         detailsFormData.riskLevel === 'Moderate' ? '#D97706' : 
                         '#1E40AF',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)'
                }}
              >
                {detailsFormData.riskLevel} Risk
              </span>
            )}
          </div>

          {/* Status Progress Bar */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4">
              {/* Progress Steps with Chevron Design */}
              <div className="flex items-center flex-1 gap-6">
                {prospect.stages.map((stage: any, index: number) => (
                  <div key={index} className="flex items-center flex-1">
                    <button 
                      onClick={() => setSelectedStage(stage.name)}
                      className="relative py-2 flex items-center justify-center w-full transition-all hover:opacity-80"
                      style={{
                        backgroundColor: selectedStage === stage.name ? 'var(--primary)' : '#F3F4F6',
                        borderTopLeftRadius: index === 0 ? '4px' : '0',
                        borderBottomLeftRadius: index === 0 ? '4px' : '0',
                        borderTopRightRadius: index === prospect.stages.length - 1 ? '4px' : '0',
                        borderBottomRightRadius: index === prospect.stages.length - 1 ? '4px' : '0',
                        clipPath: index === prospect.stages.length - 1
                          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                          : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="flex items-center gap-2 relative z-10">
                        {selectedStage === stage.name && (
                          <Check className="w-4 h-4" style={{ color: 'white' }} />
                        )}
                        <span style={{ 
                          fontSize: 'var(--text-sm)', 
                          fontWeight: 'var(--font-weight-medium)',
                          color: selectedStage === stage.name ? 'white' : '#9CA3AF'
                        }}>
                          {stage.name}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Update Button */}
              <Button 
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none'
                }}
                className="hover:opacity-90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex gap-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="py-4 border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : '#6B7280',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Activity Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Activity Timeline
                  </h3>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Timeline Item Example */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                        <Phone className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-1">
                        <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Phone Call
                        </p>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                          2 hours ago
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                        Contacted prospect regarding screening appointment
                      </p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                        By: Jasmine Lim
                      </p>
                    </div>
                  </div>

                  {/* More timeline items would go here */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-1">
                        <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Status Updated
                        </p>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                          1 day ago
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                        Status changed from "New" to "Contacted"
                      </p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                        By: System
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage Checklist */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary)' }}>
                    {prospect.currentStage} — tasks
                  </h3>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#9CA3AF' }}>
                    {getTaskStats().completed} / {getTaskStats().total} completed
                  </span>
                </div>
                <div className="space-y-3">
                  {getStageChecklistData(prospect.currentStage).map((task: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <Checkbox 
                        checked={task.completed}
                        onCheckedChange={() => handleChecklistToggle(prospect.currentStage, index)}
                        className="mt-0.5"
                        style={{
                          borderColor: task.completed ? 'var(--primary)' : '#CED4DA'
                        }}
                      />
                      <label 
                        onClick={() => handleChecklistToggle(prospect.currentStage, index)}
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          fontWeight: 'var(--font-weight-normal)', 
                          color: task.completed ? '#9CA3AF' : '#374151',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        {task.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tab contents will be added later */}
          {activeTab === 'details' && (
            <div className="flex gap-6">
              {/* Left Sidebar Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                  <nav className="space-y-1">
                    {[
                      { id: 'basic', label: 'Basic Information' },
                      { id: 'screening', label: 'Screening & Subsidy' },
                      { id: 'risk', label: 'Risk Assessment' },
                      { id: 'status', label: 'Screening Status' },
                      { id: 'engagement', label: 'Engagement' }
                    ].map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block px-3 py-2 rounded transition-colors"
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: activeSection === section.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                          color: activeSection === section.id ? 'var(--primary)' : '#111827',
                          backgroundColor: activeSection === section.id ? '#F3F4F6' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (activeSection !== section.id) {
                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeSection !== section.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 relative">
                {/* Sticky Edit/Save Buttons */}
                <div className="sticky bottom-0 z-10 py-4 flex justify-end gap-3">
                  {!isEditingDetails ? (
                    <Button 
                      variant="outline" 
                      onClick={handleEditDetails}
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelDetails}
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveDetails}
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF'
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <section id="basic" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      BASIC INFORMATION
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableField
                        label="First Name"
                        value={detailsFormData.name.split(' ')[0] || 'Nurul'}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, name: value + ' ' + (detailsFormData.name.split(' ')[1] || '')})}
                        required
                      />

                      <EditableField
                        label="Last Name"
                        value={detailsFormData.name.split(' ')[1] || 'Huda'}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, name: (detailsFormData.name.split(' ')[0] || '') + ' ' + value})}
                        required
                      />

                      <EditableSelect
                        label="Gender"
                        value={detailsFormData.gender}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, gender: value})}
                        options={['Female', 'Male', 'Other']}
                        required
                      />

                      <EditableField
                        label="Date of Birth (Age: 37 years)"
                        value="15/03/1988"
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, dateOfBirth: value})}
                        type="date"
                        required
                      />

                      <EditableField
                        label="Email"
                        value={detailsFormData.email}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, email: value})}
                        type="email"
                        required
                      />

                      <EditableField
                        label="Contact No."
                        value={detailsFormData.mobile}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, mobile: value})}
                        type="tel"
                        required
                      />

                      <EditableTextArea
                        label="Address"
                        value={detailsFormData.address}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, address: value})}
                        required
                        className="col-span-2"
                        rows={2}
                      />

                      <EditableField
                        label="NRIC"
                        value={detailsFormData.nric}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, nric: value})}
                        required
                      />

                      <EditableField
                        label="Race"
                        value={detailsFormData.race}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, race: value})}
                      />

                      <EditableField
                        label="Religion"
                        value="Islam"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="Preferred Language"
                        value={detailsFormData.preferredLanguage}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, preferredLanguage: value})}
                      />
                    </div>
                  </section>

                  {/* Screening & Subsidy Eligibility Section */}
                  <section id="screening" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      SCREENING & SUBSIDY ELIGIBILITY
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableSelect
                        label="Residential Status"
                        value={detailsFormData.residentialStatus}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, residentialStatus: value})}
                        options={['Singapore Citizen', 'Permanent Resident', 'Foreigner']}
                        required
                      />

                      <EditableField
                        label="CHAS Card Type"
                        value="CHAS Blue"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        required
                      />

                      <EditableField
                        label="HealthierSG Enrolment Status"
                        value="Enrolled"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="Cancer Screening History"
                        value="Mammogram: 2023, HPV: Never"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />
                    </div>
                  </section>

                  {/* Risk Assessment Section */}
                  <section id="risk" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      RISK ASSESSMENT
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableSelect
                        label="Risk Level"
                        value={detailsFormData.riskLevel || ''}
                        isEditing={isEditingDetails}
                        onChange={(value) => setDetailsFormData({...detailsFormData, riskLevel: value})}
                        options={['Low', 'Moderate', 'High']}
                      />

                      <EditableField
                        label="Personal History of Cancer"
                        value="No"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="Cancer Screening Eligibility Check"
                        value="Eligible for Mammogram, HPV"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        className="col-span-2"
                      />

                      <EditableField
                        label="Pre-existing Health Conditions"
                        value="None"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="Family History of Cancer"
                        value="Mother had breast cancer at age 55"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />
                    </div>
                  </section>

                  {/* Screening Status Section */}
                  <section id="status" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      SCREENING STATUS
                    </h2>
                    
                    <div className="space-y-4">
                      <EditableTextArea
                        label="Screening Eligible For & Signed Up"
                        value="Mammogram (Mammobus) - Booked&#10;HPV Screening - Interested"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        rows={3}
                      />

                      <EditableTextArea
                        label="Follow-up Notes for CN"
                        value="Booked for Mammobus on 15 Nov 2025 at Bedok CC. Follow up on HPV screening interest after mammogram results."
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        rows={3}
                      />
                    </div>
                  </section>

                  {/* Engagement Section */}
                  <section id="engagement" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      ENGAGEMENT
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableField
                        label="How They Heard About the Programme"
                        value="Community Health Roadshow - Bedok"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        className="col-span-2"
                      />

                      <EditableField
                        label="PDPA Consent"
                        value="Consented"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="eDM Subscription"
                        value="Subscribed"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                      />

                      <EditableField
                        label="Consent for SCS to Contact"
                        value="Consented to be contacted for screening appointment booking"
                        isEditing={isEditingDetails}
                        onChange={(value) => {}}
                        className="col-span-2"
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Search Bar and Create Button */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#CED4DA',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#272B30'
                    }}
                  />
                </div>
                <Button 
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none'
                  }}
                  className="hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Appointment
                </Button>
              </div>

              {/* Appointment List */}
              <div className="space-y-4">
                {/* Appointment 1 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex gap-6">
                  {/* Date Section */}
                  <div className="flex flex-col items-center justify-center" style={{ minWidth: '100px' }}>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Thu
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-h2)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#111827',
                      lineHeight: '1'
                    }}>
                      20
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginTop: '4px'
                    }}>
                      Aug 2025
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 border-l border-gray-200 pl-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 style={{ 
                        fontSize: 'var(--text-base)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#111827'
                      }}>
                        Screening
                      </h3>
                      <span
                        className="px-3 py-1 rounded"
                        style={{
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        Rescheduled
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        08:30 AM - 09:00 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        Dr. Sarah Tan
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#6B7280'
                    }}>
                      Location: Singapore Cancer Centre, Level 3
                    </p>
                  </div>
                </div>

                {/* Appointment 2 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex gap-6">
                  {/* Date Section */}
                  <div className="flex flex-col items-center justify-center" style={{ minWidth: '100px' }}>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Mon
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-h2)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#111827',
                      lineHeight: '1'
                    }}>
                      15
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginTop: '4px'
                    }}>
                      Jul 2025
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 border-l border-gray-200 pl-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 style={{ 
                        fontSize: 'var(--text-base)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#111827'
                      }}>
                        Screening
                      </h3>
                      <span
                        className="px-3 py-1 rounded"
                        style={{
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        10:00 AM - 10:30 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        Dr. Michael Wong
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#6B7280'
                    }}>
                      Location: Singapore Cancer Centre, Level 2
                    </p>
                  </div>
                </div>

                {/* Appointment 3 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex gap-6">
                  {/* Date Section */}
                  <div className="flex flex-col items-center justify-center" style={{ minWidth: '100px' }}>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      Fri
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-h2)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#111827',
                      lineHeight: '1'
                    }}>
                      10
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#6B7280',
                      marginTop: '4px'
                    }}>
                      Jun 2025
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 border-l border-gray-200 pl-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 style={{ 
                        fontSize: 'var(--text-base)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#111827'
                      }}>
                        Screening
                      </h3>
                      <span
                        className="px-3 py-1 rounded"
                        style={{
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)'
                        }}
                      >
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        02:00 PM - 02:30 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-normal)',
                        color: '#6B7280'
                      }}>
                        Dr. Sarah Tan
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#6B7280'
                    }}>
                      Location: Singapore Cancer Centre, Level 3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Header with Last Updated and Add Notes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                    Last updated on 17 July 2025 by John Smith
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsAddNoteOpen(true)}
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    backgroundColor: 'white',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                  className="hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notes
                </Button>
              </div>

              {/* Discussion Notes Section */}
              <div>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      author={note.author}
                      role={note.role}
                      timestamp={note.timestamp}
                      content={note.content}
                      fullContent={note.content}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                  style={{
                    borderColor: '#DEE2E6',
                    color: '#6B7280'
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  1
                </button>
                <button
                  className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                  style={{
                    borderColor: '#DEE2E6',
                    color: '#374151',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  2
                </button>
                <span style={{ color: '#6B7280', fontSize: 'var(--text-sm)' }}>...</span>
                <button
                  className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                  style={{
                    borderColor: '#DEE2E6',
                    color: '#6B7280'
                  }}
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'document' && (
            <div className="space-y-6">
              {/* Search Bar and Upload Button */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 rounded border"
                    style={{
                      borderColor: '#CED4DA',
                      backgroundColor: '#FFFFFF',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#272B30'
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    backgroundColor: 'white',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                  className="hover:bg-purple-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: '#CED4DA',
                      color: '#374151',
                      backgroundColor: 'white',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: '#CED4DA',
                      color: '#374151',
                      backgroundColor: 'white',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <Columns className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                    Show
                  </span>
                  <select 
                    className="px-3 py-1 rounded border"
                    style={{
                      borderColor: '#CED4DA',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: '#272B30'
                    }}
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                    entries
                  </span>
                </div>
              </div>

              {/* Documents Table */}
              <div className="bg-white rounded-lg border" style={{ borderColor: '#DEE2E6' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F8F9FA' }}>
                      <tr>
                        <th className="text-left py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                          Document Name
                        </th>
                        <th className="text-left py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                          Document Source
                        </th>
                        <th className="text-left py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                          <div className="flex items-center gap-1">
                            Uploaded on
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                          Uploaded by
                        </th>
                        <th className="text-left py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827' }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <DocumentRow 
                        name="Medical_History_Report.pdf"
                        source="Prospects"
                        uploadedOn="15 Nov 2025"
                        uploadedBy="System"
                      />
                      <DocumentRow 
                        name="Screening_Results_2025.pdf"
                        source="Clinical Records"
                        uploadedOn="12 Nov 2025"
                        uploadedBy="Zara Khan"
                      />
                      <DocumentRow 
                        name="Consent_Form_Signed.pdf"
                        source="Prospects"
                        uploadedOn="10 Nov 2025"
                        uploadedBy="Siti Nurul"
                      />
                      <DocumentRow 
                        name="Lab_Test_Results.pdf"
                        source="Clinical Records"
                        uploadedOn="08 Nov 2025"
                        uploadedBy="Gary Johnson"
                      />
                      <DocumentRow 
                        name="Insurance_Documents.pdf"
                        source="Prospects"
                        uploadedOn="05 Nov 2025"
                        uploadedBy="System"
                      />
                      <DocumentRow 
                        name="Referral_Letter.pdf"
                        source="Referrals"
                        uploadedOn="03 Nov 2025"
                        uploadedBy="Zara Khan"
                      />
                      <DocumentRow 
                        name="Treatment_Plan.pdf"
                        source="Clinical Records"
                        uploadedOn="01 Nov 2025"
                        uploadedBy="Siti Nurul"
                      />
                      <DocumentRow 
                        name="Follow_Up_Notes.pdf"
                        source="Clinical Records"
                        uploadedOn="28 Oct 2025"
                        uploadedBy="Gary Johnson"
                      />
                      <DocumentRow 
                        name="Patient_Registration.pdf"
                        source="Prospects"
                        uploadedOn="25 Oct 2025"
                        uploadedBy="System"
                      />
                      <DocumentRow 
                        name="Appointment_Confirmation.pdf"
                        source="Prospects"
                        uploadedOn="20 Oct 2025"
                        uploadedBy="Zara Khan"
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#6B7280' }}>
                  Showing 1 to 10 out of 10 records
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                    style={{
                      borderColor: '#DEE2E6',
                      color: '#6B7280'
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    1
                  </button>
                  <button
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                    style={{
                      borderColor: '#DEE2E6',
                      color: '#6B7280'
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'medical-history' && (
            <div className="flex gap-6">
              {/* Left Sidebar Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                  <nav className="space-y-1">
                      {[
                        { id: 'family-cancer', label: 'Family Cancer Background' },
                        { id: 'history-cancer', label: 'History of Cancer' },
                        { id: 'treatment', label: 'Treatment Done' }
                      ].map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block px-3 py-2 rounded transition-colors"
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: activeMedicalSection === section.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                            color: activeMedicalSection === section.id ? 'var(--primary)' : '#111827',
                            backgroundColor: activeMedicalSection === section.id ? '#F3F4F6' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (activeMedicalSection !== section.id) {
                              e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeMedicalSection !== section.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {section.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative">
                  {/* Sticky Edit/Save Buttons */}
                  <div className="sticky bottom-0 z-10 py-4 flex justify-end gap-3">
                    {!isEditingMedicalHistory ? (
                      <Button 
                        variant="outline" 
                        onClick={handleEditMedicalHistory}
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={handleCancelMedicalHistory}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveMedicalHistory}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF'
                          }}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="space-y-6">
                  {/* Family Cancer Background Section */}
                  <section id="family-cancer" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      FAMILY CANCER BACKGROUND
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableSelect
                        label="Breast Cancer"
                        value="Yes"
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => {}}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Colorectal Cancer"
                        value="No"
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => {}}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Ovarian Cancer"
                        value="No"
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => {}}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Other Cancer"
                        value="No"
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => {}}
                        options={['Yes', 'No']}
                      />
                    </div>
                  </section>

                  {/* History of Cancer Section */}
                  <section id="history-cancer" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      HISTORY OF CANCER
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableSelect
                        label="History of Cancer"
                        value={medicalHistoryFormData.historyOfCancer}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, historyOfCancer: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableField
                        label="Diagnosed Year"
                        value={medicalHistoryFormData.diagnosedYear}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, diagnosedYear: value})}
                      />
                      
                      <EditableTextArea
                        label="Cancer Detail"
                        value={medicalHistoryFormData.cancerDetail}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, cancerDetail: value})}
                        className="col-span-2"
                        rows={3}
                      />
                      
                      <EditableField
                        label="Follow Up At"
                        value={medicalHistoryFormData.followUpAt}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, followUpAt: value})}
                        className="col-span-2"
                      />
                    </div>
                  </section>

                  {/* Treatment Done Section */}
                  <section id="treatment" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      TREATMENT DONE
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableSelect
                        label="Surgery"
                        value={medicalHistoryFormData.surgery}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, surgery: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Radiation Therapy"
                        value={medicalHistoryFormData.radiationTherapy}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, radiationTherapy: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Chemotherapy"
                        value={medicalHistoryFormData.chemotherapy}
                        isEditing={isEditingMedicalHistory}
                        onChange={(value) => setMedicalHistoryFormData({...medicalHistoryFormData, chemotherapy: value})}
                        options={['Yes', 'No']}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Other Details Tab */}
          {activeTab === 'other-details' && (
            <div className="flex gap-6">
              {/* Left Sidebar Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                  <nav className="space-y-1">
                    {[
                      { id: 'other-medical', label: 'Other Medical Details' },
                      { id: 'cervical-risk', label: 'Cervical Cancer Risk Factors' },
                      { id: 'other-info', label: 'Other Details' },
                      { id: 'breast-risk', label: 'Breast Cancer Risk Factors' }
                    ].map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block px-3 py-2 rounded transition-colors"
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: activeOtherDetailsSection === section.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                          color: activeOtherDetailsSection === section.id ? 'var(--primary)' : '#111827',
                          backgroundColor: activeOtherDetailsSection === section.id ? '#F3F4F6' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (activeOtherDetailsSection !== section.id) {
                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeOtherDetailsSection !== section.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 relative">
                {/* Sticky Edit/Save Buttons */}
                <div className="sticky bottom-0 z-10 py-4 flex justify-end gap-3">
                  {!isEditingOtherDetails ? (
                    <Button 
                      variant="outline" 
                      onClick={handleEditOtherDetails}
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelOtherDetails}
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveOtherDetails}
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF'
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Other Medical Details Section */}
                  <section id="other-medical" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      OTHER MEDICAL DETAILS
                    </h2>
                    
                    <div className="space-y-6">
                      <EditableTextArea
                        label="Other Medical/Surgical Illness"
                        value={otherDetailsFormData.otherMedicalIllness}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, otherMedicalIllness: value})}
                        rows={5}
                      />
                      
                      <div className="grid grid-cols-2 gap-6">
                        <EditableField
                          label="Current Medication"
                          value={otherDetailsFormData.currentMedication}
                          isEditing={isEditingOtherDetails}
                          onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, currentMedication: value})}
                        />
                        
                        <EditableField
                          label="Any Drug Allergy"
                          value={otherDetailsFormData.drugAllergy}
                          isEditing={isEditingOtherDetails}
                          onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, drugAllergy: value})}
                        />
                      </div>
                      
                      <EditableField
                        label="High Risk Immunosuppressive clinical condition"
                        value={otherDetailsFormData.immunosuppressiveCondition}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, immunosuppressiveCondition: value})}
                      />
                    </div>
                  </section>

                  {/* Cervical Cancer Risk Factors Section */}
                  <section id="cervical-risk" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      CERVICAL CANCER RISK FACTORS
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableField
                        label="Age at First Sexual Intercourse"
                        value={otherDetailsFormData.ageFirstIntercourse}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, ageFirstIntercourse: value})}
                      />
                      
                      <EditableSelect
                        label="Multiple Sexual Partners"
                        value={otherDetailsFormData.multipleSexualPartners}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, multipleSexualPartners: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableSelect
                        label="Smoking"
                        value={otherDetailsFormData.smoking}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, smoking: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableField
                        label="Duration Smoking (in Yrs)"
                        value={otherDetailsFormData.smokingDuration}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, smokingDuration: value})}
                      />
                      
                      <EditableSelect
                        label="History of Sexually Transmitted Infections"
                        value={otherDetailsFormData.sexuallyTransmittedInfections}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, sexuallyTransmittedInfections: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableField
                        label="Use of OCP (in Yrs)"
                        value={otherDetailsFormData.ocpUse}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, ocpUse: value})}
                      />
                      
                      <EditableSelect
                        label="HPV Vaccination"
                        value={otherDetailsFormData.hpvVaccinated}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, hpvVaccinated: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <div className="col-span-2">
                        <EditableTextArea
                          label="Other Details"
                          value={otherDetailsFormData.cervicalOtherDetails}
                          isEditing={isEditingOtherDetails}
                          onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, cervicalOtherDetails: value})}
                          rows={2}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Other Details Section */}
                  <section id="other-info" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      OTHER DETAILS
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableField
                        label="Para (No. Of Children Delivered)"
                        value={otherDetailsFormData.childrenCount}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, childrenCount: value})}
                      />
                      
                      <EditableField
                        label="Last Pap / HPV Test Done On"
                        value={otherDetailsFormData.lastPapTestDate}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, lastPapTestDate: value})}
                        type="date"
                      />
                      
                      <EditableField
                        label="Last Pap / HPV Test Result"
                        value={otherDetailsFormData.lastPapTestResult}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, lastPapTestResult: value})}
                      />
                      
                      <EditableField
                        label="Last Mammogram Date"
                        value={otherDetailsFormData.lastMammogramDate}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, lastMammogramDate: value})}
                        type="date"
                      />
                      
                      <EditableSelect
                        label="CHAS Card Holder"
                        value={otherDetailsFormData.chasCardHolder}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, chasCardHolder: value})}
                        options={['Yes', 'No']}
                      />
                    </div>
                  </section>

                  {/* Breast Cancer Risk Factors Section */}
                  <section id="breast-risk" className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#6B7280',
                      letterSpacing: '0.05em',
                      marginBottom: '24px'
                    }}>
                      BREAST CANCER RISK FACTORS
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <EditableField
                        label="Age at Menarche (FMP)"
                        value={otherDetailsFormData.ageAtMenarche}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, ageAtMenarche: value})}
                      />
                      
                      <EditableField
                        label="Age at Menopause"
                        value={otherDetailsFormData.ageAtMenopause}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, ageAtMenopause: value})}
                      />
                      
                      <EditableField
                        label="Age at First Childbirth"
                        value={otherDetailsFormData.ageAtFirstChildbirth}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, ageAtFirstChildbirth: value})}
                      />
                      
                      <EditableField
                        label="Duration of Use of HRT (in Yrs)"
                        value={otherDetailsFormData.hrtDuration}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, hrtDuration: value})}
                      />
                      
                      <EditableSelect
                        label="Pre-Malignant Breast Conditions"
                        value={otherDetailsFormData.preMalignantConditions}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, preMalignantConditions: value})}
                        options={['Yes', 'No']}
                      />
                      
                      <EditableTextArea
                        label="Breast Conditions (Details)"
                        value={otherDetailsFormData.breastConditionsDetails}
                        isEditing={isEditingOtherDetails}
                        onChange={(value) => setOtherDetailsFormData({...otherDetailsFormData, breastConditionsDetails: value})}
                        className="col-span-2"
                        rows={3}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Screening Tab */}
          {activeTab === 'screening' && (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Screening History Section */}
              <div className="p-6">
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                  marginBottom: '24px'
                }}>
                  SCREENING HISTORY
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F8F9FA' }}>
                      <tr>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Visit No.
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Date of Visit
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Doctor Name
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Test Type
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Result Date PAP
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Pap Result Class
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          HPV 16
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          HPV 18
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Other High Risk
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Next Appointment In
                        </th>
                        <th className="text-left py-3 px-4 border-b" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#111827', borderColor: '#E5E7EB' }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          V001
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          15/11/2025
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Dr. Sarah Chen
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Pap Smear
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          20/11/2025
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          3 years
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded" style={{ 
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}>
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          V002
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          20/05/2024
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Dr. Michael Tan
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Pap Smear + HPV Test
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          28/05/2024
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Normal
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          1 year
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded" style={{ 
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}>
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          V003
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          18/11/2023
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Dr. Sarah Chen
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Pap Smear
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          25/11/2023
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Normal
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          -
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          -
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          -
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          6 months
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded" style={{ 
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}>
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          V004
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          15/02/2023
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Dr. Linda Wong
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          HPV Test
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          22/02/2023
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          -
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Negative
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          Positive
                        </td>
                        <td className="py-3 px-4" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: '#272B30' }}>
                          3 months
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded" style={{ 
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)'
                          }}>
                            Follow-up Required
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onCreateTask={handleCreateTask}
      />

      {/* Add Contact Log Dialog */}
      <AddContactLogDialog
        open={isAddContactLogOpen}
        onOpenChange={setIsAddContactLogOpen}
        onAddContactLog={handleAddContactLog}
      />

      {/* Add Note Dialog */}
      <AddNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        onSaveNote={handleAddNote}
      />

      {/* Manual Route Dialog */}
      <ManualRouteDialog
        open={isManualRouteOpen}
        onOpenChange={setIsManualRouteOpen}
        prospectName="John Tan"
      />

      {/* Add Tag Dialog */}
      <AddTagDialog
        open={isAddTagOpen}
        onOpenChange={setIsAddTagOpen}
        currentTags={prospectTags}
        onAddTags={(tags) => setProspectTags(tags)}
      />
    </div>
  );
}