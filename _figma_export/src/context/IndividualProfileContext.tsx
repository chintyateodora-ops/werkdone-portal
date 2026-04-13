import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MOCK_PROSPECTS, type MockProspectListRow } from '../data/mockProspectsList';
import { maskNric } from '../lib/prospectRef';

function buildInitialProfileMap(): Record<string, MockProspectListRow> {
  return Object.fromEntries(MOCK_PROSPECTS.map((p) => [p.recordId, { ...p }]));
}

export type IndividualProfileContextValue = {
  /** recordId → current row (single source of truth for listings + detail) */
  profilesByRecordId: Record<string, MockProspectListRow>;
  orderedProspects: MockProspectListRow[];
  updateProfile: (recordId: string, patch: Partial<MockProspectListRow>) => void;
};

const IndividualProfileContext = createContext<IndividualProfileContextValue | null>(null);

export function IndividualProfileProvider({ children }: { children: ReactNode }) {
  const [profilesByRecordId, setProfilesByRecordId] = useState<Record<string, MockProspectListRow>>(
    buildInitialProfileMap
  );

  const updateProfile = useCallback((recordId: string, patch: Partial<MockProspectListRow>) => {
    setProfilesByRecordId((prev) => {
      const cur = prev[recordId];
      if (!cur) return prev;
      const next: MockProspectListRow = { ...cur, ...patch };
      if (patch.nric != null) {
        next.nric = patch.nric.trim().toUpperCase();
        next.maskedNric = maskNric(next.nric);
      }
      return { ...prev, [recordId]: next };
    });
  }, []);

  const orderedProspects = useMemo(
    () => MOCK_PROSPECTS.map((seed) => profilesByRecordId[seed.recordId]).filter(Boolean) as MockProspectListRow[],
    [profilesByRecordId]
  );

  const value = useMemo(
    () => ({
      profilesByRecordId,
      orderedProspects,
      updateProfile,
    }),
    [profilesByRecordId, orderedProspects, updateProfile]
  );

  return (
    <IndividualProfileContext.Provider value={value}>{children}</IndividualProfileContext.Provider>
  );
}

export function useIndividualProfiles(): IndividualProfileContextValue {
  const ctx = useContext(IndividualProfileContext);
  if (!ctx) {
    throw new Error('useIndividualProfiles must be used within IndividualProfileProvider');
  }
  return ctx;
}
