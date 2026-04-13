import { useState } from 'react';
import { Header } from './components/Header';
import { AllProspects } from './components/prospects/AllProspects';
import { AddProspect } from './components/prospects/AddProspect';
import { ProspectDetail } from './components/prospects/ProspectDetail';
import { Segments } from './components/prospects/Segments';
import { SelfRegistration } from './components/prospects/SelfRegistration';
import { ScreeningRequestEmail } from './components/emails/ScreeningRequestEmail';
import { FollowUpScreeningEmail } from './components/emails/FollowUpScreeningEmail';
import { ScreeningResultsEmail } from './components/emails/ScreeningResultsEmail';
import { TreatmentRequestEmail } from './components/emails/TreatmentRequestEmail';
import { FollowUpTreatmentEmail } from './components/emails/FollowUpTreatmentEmail';
import { NewReferrals } from './components/referrals/NewReferrals';
import { InternalReferrals } from './components/referrals/InternalReferrals';
import { ReferralDetails } from './components/referrals/ReferralDetails';
import { ScreeningResults } from './components/referrals/ScreeningResults';
import { ReferralWithdrawn } from './components/referrals/ReferralWithdrawn';
import { ReferralAccepted } from './components/referrals/ReferralAccepted';
import { Client360 } from './components/client/Client360';
import { Configurations } from './components/config/Configurations';
import { TagConfiguration } from './components/config/TagConfiguration';
import { ScreeningManagement } from './components/screening/ScreeningManagement';
import { VisitDetails } from './components/screening/VisitDetails';
import { VisitNotes } from './components/screening/VisitNotes';
import { ScreeningPrograms } from './components/screening/ScreeningPrograms';
import { ComingSoon } from './components/ComingSoon';
import { Home } from './components/Home';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { AddProspectPlaceholder } from './components/prospects/AddProspectPlaceholder';

/** Screening programme key when opening Add Prospect from the toolbar dropdown */
export type ScreeningProgramKey = 'mammobus' | 'hpv' | 'fit';

export type Page = 
  | 'home'
  | 'all-prospects'
  | 'mammobus-prospects'
  | 'hpv-prospects'
  | 'fit-prospects'
  | { page: 'add-prospect'; program: ScreeningProgramKey }
  | { page: 'prospect-detail'; prospectRef: string }
  | { page: 'visit-details'; visitId: string; prospectRef: string }
  | { page: 'visit-notes'; visitId: string; prospectRef: string }
  | 'segments'
  | 'self-registration'
  | 'email-screening-request'
  | 'email-followup-screening'
  | 'email-screening-results'
  | 'email-treatment-request'
  | 'email-followup-treatment'
  | 'new-referrals'
  | 'internal-referrals'
  | 'referral-details'
  | 'screening-results'
  | 'referral-withdrawn'
  | 'referral-accepted'
  | 'withdrawn-referral'
  | 'accept-referral'
  | 'client-360'
  | 'screening-management'
  | 'screening-programs'
  | 'configurations'
  | 'tag-configuration'
  | 'coming-soon';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('all-prospects');

  const renderPage = () => {
    if (typeof currentPage === 'object' && currentPage.page === 'prospect-detail') {
      return <ProspectDetail onNavigate={setCurrentPage} prospectRef={currentPage.prospectRef} />;
    }
    if (typeof currentPage === 'object' && currentPage.page === 'visit-details') {
      return <VisitDetails onNavigate={setCurrentPage} visitId={currentPage.visitId} prospectRef={currentPage.prospectRef} />;
    }
    if (typeof currentPage === 'object' && currentPage.page === 'visit-notes') {
      return <VisitNotes onNavigate={setCurrentPage} visitId={currentPage.visitId} prospectRef={currentPage.prospectRef} />;
    }
    if (typeof currentPage === 'object' && currentPage.page === 'add-prospect') {
      if (currentPage.program === 'mammobus') {
        return <AddProspect onNavigate={setCurrentPage} initialProgram="mammobus" />;
      }
      return <AddProspectPlaceholder program={currentPage.program} onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'all-prospects':
        return <AllProspects onNavigate={setCurrentPage} programFilter="all" />;
      case 'mammobus-prospects':
        return <AllProspects onNavigate={setCurrentPage} programFilter="mammobus" />;
      case 'hpv-prospects':
        return <AllProspects onNavigate={setCurrentPage} programFilter="hpv" />;
      case 'fit-prospects':
        return <AllProspects onNavigate={setCurrentPage} programFilter="fit" />;
      case 'segments':
        return <Segments onNavigate={setCurrentPage} />;
      case 'self-registration':
        return <SelfRegistration />;
      case 'email-screening-request':
        return <ScreeningRequestEmail />;
      case 'email-followup-screening':
        return <FollowUpScreeningEmail />;
      case 'email-screening-results':
        return <ScreeningResultsEmail />;
      case 'email-treatment-request':
        return <TreatmentRequestEmail />;
      case 'email-followup-treatment':
        return <FollowUpTreatmentEmail />;
      case 'new-referrals':
        return <NewReferrals />;
      case 'internal-referrals':
        return <InternalReferrals />;
      case 'referral-details':
        return <ReferralDetails onNavigate={setCurrentPage} />;
      case 'screening-results':
        return <ScreeningResults onNavigate={setCurrentPage} />;
      case 'referral-withdrawn':
        return <ReferralWithdrawn onNavigate={setCurrentPage} />;
      case 'referral-accepted':
        return <ReferralAccepted onNavigate={setCurrentPage} />;
      case 'withdrawn-referral':
        return <ReferralWithdrawn onNavigate={setCurrentPage} />;
      case 'accept-referral':
        return <ReferralAccepted onNavigate={setCurrentPage} />;
      case 'client-360':
        return <Client360 />;
      case 'screening-management':
        return <ScreeningManagement onNavigate={setCurrentPage} />;
      case 'screening-programs':
        return <ScreeningPrograms onNavigate={setCurrentPage} />;
      case 'configurations':
        return <Configurations />;
      case 'tag-configuration':
        return <TagConfiguration onNavigate={setCurrentPage} />;
      case 'coming-soon':
        return <ComingSoon />;
      default:
        return <AllProspects onNavigate={setCurrentPage} />;
    }
  };

  const fullBleedPages =
    currentPage === 'self-registration' ||
    currentPage === 'email-screening-request' ||
    currentPage === 'email-followup-screening' ||
    currentPage === 'email-screening-results' ||
    currentPage === 'email-treatment-request' ||
    currentPage === 'email-followup-treatment' ||
    currentPage === 'referral-details' ||
    currentPage === 'screening-results' ||
    currentPage === 'referral-withdrawn' ||
    currentPage === 'referral-accepted' ||
    currentPage === 'withdrawn-referral' ||
    currentPage === 'accept-referral';

  return (
    <>
      {fullBleedPages ? (
        <div className="flex flex-col h-screen min-h-0 bg-white">
          <main className="flex-1 min-h-0 overflow-auto">{renderPage()}</main>
          <Footer />
          <Toaster />
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-gray-50 min-h-0">
          <Header />
          <main className="flex-1 min-h-0 overflow-auto">{renderPage()}</main>
          <Footer />
          <Toaster />
        </div>
      )}
    </>
  );
}