/**
 * choicesService.ts
 * Manages dynamic platform choices (PLM Systems, PLM Modules, CAD Tools)
 * stored in Firestore under platform_settings/choices
 */
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SETTINGS_DOC = doc(db, 'platform_settings', 'choices');

export interface PlatformChoices {
  plmSystems: string[];
  plmModules: string[];
  cadTools: string[];
}

// Seed defaults used on first use or Firestore unavailable
export const DEFAULT_CHOICES: PlatformChoices = {
  plmSystems: [
    'Siemens Teamcenter',
    'PTC Windchill',
    'Dassault 3DEXPERIENCE / ENOVIA',
    'Aras Innovator',
    'SAP PLM',
    'Autodesk Fusion / Upchain',
    'Arena PLM',
    'Agile PLM',
  ],
  plmModules: [
    'BOM & Part Architecture',
    'Active Workspace (AWC)',
    'CAD / MCAD Integration',
    'ECAD Integration',
    'Engineering Change (ECN/ECO)',
    'Requirements & MBSE',
    'Manufacturing Process (MPP)',
    'Quality & CAPA',
    'Supplier Collaboration',
    'Data Migration & ETL',
  ],
  cadTools: [
    'Siemens NX',
    'CATIA V5/V6',
    'PTC Creo',
    'SolidWorks',
    'Autodesk Inventor',
    'Altium Designer',
  ],
};

/** Subscribe to platform choices in real-time */
export function subscribeToPlatformChoices(
  onData: (choices: PlatformChoices) => void,
  onError?: (err: unknown) => void
): () => void {
  try {
    return onSnapshot(
      SETTINGS_DOC,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<PlatformChoices>;
          onData({
            plmSystems: data.plmSystems?.length ? data.plmSystems : DEFAULT_CHOICES.plmSystems,
            plmModules: data.plmModules?.length ? data.plmModules : DEFAULT_CHOICES.plmModules,
            cadTools: data.cadTools?.length ? data.cadTools : DEFAULT_CHOICES.cadTools,
          });
        } else {
          // First time: seed defaults into Firestore
          setDoc(SETTINGS_DOC, DEFAULT_CHOICES).catch(console.warn);
          onData(DEFAULT_CHOICES);
        }
      },
      (err) => {
        console.warn('Platform choices listener error:', err);
        onError?.(err);
        onData(DEFAULT_CHOICES);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to platform choices:', err);
    onData(DEFAULT_CHOICES);
    return () => {};
  }
}

/** Add a single item to a category */
export async function addPlatformChoice(
  category: keyof PlatformChoices,
  item: string
): Promise<void> {
  const snap = await getDoc(SETTINGS_DOC);
  const current: PlatformChoices = snap.exists()
    ? (snap.data() as PlatformChoices)
    : { ...DEFAULT_CHOICES };
  const trimmed = item.trim();
  if (!trimmed || (current[category] ?? []).includes(trimmed)) return;
  await setDoc(
    SETTINGS_DOC,
    { [category]: [...(current[category] ?? []), trimmed] },
    { merge: true }
  );
}

/** Remove an item from a category */
export async function removePlatformChoice(
  category: keyof PlatformChoices,
  item: string
): Promise<void> {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) return;
  const current = snap.data() as PlatformChoices;
  await setDoc(
    SETTINGS_DOC,
    { [category]: (current[category] ?? []).filter((v: string) => v !== item) },
    { merge: true }
  );
}
