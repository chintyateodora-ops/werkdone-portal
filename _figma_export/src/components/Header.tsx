import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import logoExpanded from 'figma:asset/ae0b8fff1405d98baa9a044f42bdd53a710097a7.png';
import { Page } from '../App';

type HeaderProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

function prospectRefFromPage(page: Page): string | null {
  if (typeof page !== 'object') return null;
  if ('prospectRef' in page && typeof page.prospectRef === 'string') return page.prospectRef;
  return null;
}

function isProspectContextPage(page: Page): boolean {
  return (
    typeof page === 'object' &&
    (page.page === 'client-360-v2' ||
      page.page === 'prospect-detail' ||
      page.page === 'prospect-detail-v3' ||
      page.page === 'screening-details-v2' ||
      page.page === 'screening-details-v4')
  );
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const prospectRef = prospectRefFromPage(currentPage);
  const showSwitcher = Boolean(prospectRef && isProspectContextPage(currentPage));

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center">
        <img src={logoExpanded} alt="Singapore Cancer Society" className="h-10" />
      </div>

      {/* Right side - Profile and Help */}
      <div className="flex items-center gap-3">
        {showSwitcher && prospectRef ? (
          <div className="flex items-center gap-2">
            <Button
              variant={typeof currentPage === 'object' && currentPage.page === 'prospect-detail' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate({ page: 'prospect-detail', prospectRef })}
            >
              classic
            </Button>
            <Button
              variant={typeof currentPage === 'object' && currentPage.page === 'prospect-detail-v3' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate({ page: 'prospect-detail-v3', prospectRef })}
            >
              v1
            </Button>
            <Button
              variant={typeof currentPage === 'object' && currentPage.page === 'client-360-v2' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate({ page: 'client-360-v2', prospectRef })}
            >
              v2
            </Button>
            <Button
              variant={
                typeof currentPage === 'object' &&
                (currentPage.page === 'screening-details-v2' || currentPage.page === 'screening-details-v4')
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => onNavigate({ page: 'screening-details-v4', prospectRef })}
            >
              v3
            </Button>
          </div>
        ) : null}
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(124, 81, 161, 0.1)',
              color: 'var(--primary)'
            }}
          >
            <span>SJ</span>
          </div>
          <span>Saphira Jane</span>
          <span style={{ color: 'var(--muted-foreground)' }}>|</span>
          <span style={{ color: 'var(--foreground)' }}>CPC Team</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button variant="outline">
          Need Help?
        </Button>
      </div>
    </header>
  );
}