import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import logoExpanded from 'figma:asset/ae0b8fff1405d98baa9a044f42bdd53a710097a7.png';

export function Header() {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center">
        <img src={logoExpanded} alt="Singapore Cancer Society" className="h-10" />
      </div>

      {/* Right side - Profile and Help */}
      <div className="flex items-center gap-3">
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
            <span>TH</span>
          </div>
          <span>Thong Han</span>
          <span style={{ color: 'var(--muted-foreground)' }}>|</span>
          <span style={{ color: 'var(--foreground)' }}>Super Admin</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button variant="outline">
          Need Help?
        </Button>
      </div>
    </header>
  );
}