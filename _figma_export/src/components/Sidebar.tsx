import { useState } from 'react';
import { 
  Home as HomeIcon, 
  Users, 
  UserPlus, 
  User, 
  Briefcase, 
  Heart, 
  FileText, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  Shield, 
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  Clipboard
} from 'lucide-react';
import type { Page } from '../App';
import logoExpanded from 'figma:asset/ae0b8fff1405d98baa9a044f42bdd53a710097a7.png';
import logoCollapsed from 'figma:asset/c3f452a680df49a886019ef3b882eedf3292e461.png';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [prospectOpen, setProspectOpen] = useState(true);
  const [referralsOpen, setReferralsOpen] = useState(true);
  const [screeningOpen, setScreeningOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to get the current page string
  const getCurrentPageString = (): string => {
    if (typeof currentPage === 'object' && 'page' in currentPage) {
      return currentPage.page;
    }
    return currentPage;
  };

  const currentPageStr = getCurrentPageString();

  const menuItems = [
    { id: 'home' as Page, label: 'Home', icon: HomeIcon, onClick: () => onNavigate('home') },
    {
      id: 'prospect',
      label: 'Prospect',
      icon: Users,
      hasSubmenu: true,
      isOpen: prospectOpen,
      onToggle: () => setProspectOpen(!prospectOpen),
      submenu: [
        { id: 'all-prospects' as Page, label: 'All Prospects', onClick: () => onNavigate('all-prospects') },
        { id: 'mammobus-prospects' as Page, label: 'Mammogram Prospects', onClick: () => onNavigate('mammobus-prospects') },
        { id: 'hpv-prospects' as Page, label: 'HPV Prospects', onClick: () => onNavigate('hpv-prospects') },
        { id: 'fit-prospects' as Page, label: 'FIT Prospects', onClick: () => onNavigate('fit-prospects') },
      ]
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: UserPlus,
      hasSubmenu: true,
      isOpen: referralsOpen,
      onToggle: () => setReferralsOpen(!referralsOpen),
      submenu: [
        { id: 'new-referrals' as Page, label: 'New Referrals', onClick: () => onNavigate('new-referrals') },
        { id: 'internal-referrals' as Page, label: 'Internal Referrals', onClick: () => onNavigate('internal-referrals') },
      ]
    },
    { id: 'client-360' as Page, label: 'Client 360', icon: User, onClick: () => onNavigate('client-360') },
    {
      id: 'screening',
      label: 'Screening Management',
      icon: Clipboard,
      hasSubmenu: true,
      isOpen: screeningOpen,
      onToggle: () => setScreeningOpen(!screeningOpen),
      submenu: [
        { id: 'screening-management' as Page, label: 'Screening Bookings', onClick: () => onNavigate('screening-management') },
      ]
    },
    { id: 'services' as Page, label: 'Services', icon: Briefcase, onClick: () => onNavigate('coming-soon') },
    { id: 'care-plan' as Page, label: 'Care Plan', icon: Heart, onClick: () => onNavigate('coming-soon') },
    { id: 'clinical-records' as Page, label: 'Clinical Records', icon: FileText, onClick: () => onNavigate('coming-soon') },
    { id: 'assessment' as Page, label: 'Assessment', icon: ClipboardList, onClick: () => onNavigate('coming-soon') },
    { id: 'schedule' as Page, label: 'Schedule', icon: Calendar, onClick: () => onNavigate('coming-soon') },
    { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3, onClick: () => onNavigate('coming-soon') },
    { id: 'admins' as Page, label: 'Admins', icon: Shield, onClick: () => onNavigate('coming-soon') },
    { id: 'configurations' as Page, label: 'Configurations', icon: Settings, onClick: () => onNavigate('configurations') },
  ];

  const isInSubmenu = (item: typeof menuItems[number]) => {
    if (item.hasSubmenu && item.submenu) {
      return item.submenu.some(sub => sub.id === currentPage);
    }
    return false;
  };

  return (
    <div 
      className={`bg-white border-r flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-56' : 'w-16'
      }`}
      style={{ borderColor: 'var(--sidebar-border)' }}
    >
      {/* Logo and Toggle */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: '#F2EEF6' }}>
        {isExpanded ? (
          <img src={logoExpanded} alt="Singapore Cancer Society" className="h-10" />
        ) : (
          <img src={logoCollapsed} alt="SCS" className="h-8 mx-auto" />
        )}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 rounded hover:bg-opacity-10 transition-colors"
            style={{ 
              color: 'var(--sidebar-primary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 bg-[rgb(242,238,246)]">
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center py-3 mb-2 transition-colors"
            style={{ 
              color: 'var(--sidebar-primary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        {menuItems.map((item) => {
          const isSubmenuActive = isInSubmenu(item);
          const isActive = currentPageStr === item.id;
          
          return (
            <div key={item.id}>
              <button
                onClick={item.hasSubmenu ? item.onToggle : item.onClick}
                className={`w-full flex items-center justify-between py-2.5 transition-colors ${
                  isExpanded ? 'px-4' : 'px-3 justify-center'
                }`}
                style={{
                  backgroundColor: isSubmenuActive 
                    ? 'var(--sidebar-primary)' 
                    : isActive
                    ? 'var(--sidebar-hover)'
                    : 'transparent',
                  color: isSubmenuActive 
                    ? 'var(--sidebar-primary-foreground)' 
                    : 'var(--sidebar-foreground)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmenuActive && !isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmenuActive && !isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={!isExpanded ? item.label : undefined}
              >
                <div className={`flex items-center ${isExpanded ? 'gap-3' : ''}`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {isExpanded && <span className="text-sm">{item.label}</span>}
                </div>
                {isExpanded && item.hasSubmenu && (
                  item.isOpen ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {isExpanded && item.hasSubmenu && item.isOpen && item.submenu && (
                <div style={{ backgroundColor: 'var(--sidebar-accent)' }}>
                  {item.submenu.map((subItem) => {
                    const isSubActive = currentPageStr === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={subItem.onClick}
                        className="w-full text-left px-4 py-2.5 pl-11 text-sm transition-colors"
                        style={{
                          backgroundColor: isSubActive 
                            ? 'var(--sidebar-selected-submenu)' 
                            : 'transparent',
                          color: 'var(--sidebar-foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubActive) {
                            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {subItem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}