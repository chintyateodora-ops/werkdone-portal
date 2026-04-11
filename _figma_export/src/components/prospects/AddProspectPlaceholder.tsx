import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { Page, ScreeningProgramKey } from '../../App';

const PROGRAM_META: Record<Exclude<ScreeningProgramKey, 'mammobus'>, { title: string; description: string }> = {
  hpv: {
    title: 'HPV Screening Programme',
    description: 'Screening registration form — fields coming soon',
  },
  fit: {
    title: 'FIT Screening Programme',
    description: 'Screening registration form — fields coming soon',
  },
};

interface AddProspectPlaceholderProps {
  program: 'hpv' | 'fit';
  onNavigate: (page: Page) => void;
}

export function AddProspectPlaceholder({ program, onNavigate }: AddProspectPlaceholderProps) {
  const meta = PROGRAM_META[program];

  return (
    <div className="flex flex-col min-h-0 h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => onNavigate('all-prospects')}
            className="text-[var(--primary)] hover:underline bg-transparent border-0 p-0 cursor-pointer font-inherit"
          >
            Prospect Management
          </button>
          <span aria-hidden="true">›</span>
          <span className="text-gray-900">{meta.title}</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0 hover:bg-transparent -ml-2 shrink-0"
              onClick={() => onNavigate('all-prospects')}
              aria-label="Back to prospects"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">{meta.title}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{meta.description}</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => onNavigate('all-prospects')}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-8">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600 text-sm leading-relaxed">
            This screening programme registration form is a placeholder. Form fields and validation will be added when
            requirements are finalised.
          </p>
        </div>
      </div>
    </div>
  );
}
