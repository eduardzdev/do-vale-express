import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { MotoboyConfig, DeliveryZone } from '../types';
import { motoboyConfig as defaultConfig } from '../config/motoboy';

// References
export const tenantsRef = collection(db, 'tenants');

// Mapeia os dados do Firestore para o tipo local
function mapTenantToConfig(tenantDoc: any, zonesDocs: any[]): MotoboyConfig {
  const data = tenantDoc;
  return {
    ...defaultConfig,
    motoboy: data.motoboy || defaultConfig.motoboy,
    origin: data.origin || defaultConfig.origin,
    theme: data.theme || defaultConfig.theme,
    whatsappTemplate: data.whatsappTemplate || defaultConfig.whatsappTemplate,
    zones: zonesDocs.map(z => ({ id: z.id, ...z.data() } as DeliveryZone))
  };
}

export async function fetchConfigBySlug(slug: string): Promise<{ tenantId: string | null, config: MotoboyConfig | null }> {
  const q = query(tenantsRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return { tenantId: null, config: null };
  }

  const tenantDoc = snapshot.docs[0];
  const zonesRef = collection(db, `tenants/${tenantDoc.id}/zones`);
  const zonesSnapshot = await getDocs(zonesRef);
  
  const config = mapTenantToConfig(tenantDoc.data(), zonesSnapshot.docs);
  return { tenantId: tenantDoc.id, config };
}

// Quando for o primeiro acesso, podemos popular o Firestore
export async function initializeTenant(slug: string, initialConfig: MotoboyConfig, ownerUid?: string) {
  // Vamos criar um novo tenant usando slug como ID para simplificar (ou um ID aleatório)
  // Para fins práticos, o ID do documento pode ser o slug, ou podemos deixar o firebase gerar
  const newTenantRef = doc(tenantsRef); // gera ID auto
  
  // Profile & origin
  const { zones, ...rest } = initialConfig;
  
  await setDoc(newTenantRef, {
    slug,
    ownerUid: ownerUid || null,
    motoboy: rest.motoboy,
    origin: rest.origin,
    theme: rest.theme,
    whatsappTemplate: rest.whatsappTemplate,
    createdAt: new Date().toISOString()
  });

  // Salva as zones na subcoleção
  const zonesRef = collection(newTenantRef, 'zones');
  for (const zone of zones) {
    // vamos usar o mesmo ID que existia ou um novo
    const zRef = doc(zonesRef, zone.id.toString());
    await setDoc(zRef, { ...zone });
  }

  return newTenantRef.id;
}
