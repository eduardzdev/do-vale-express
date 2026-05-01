import { useState, useEffect, useCallback } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motoboyConfig as defaultConfig } from '../config/motoboy';
import type { MotoboyConfig, DeliveryZone } from '../types';
import { initializeTenant, fetchConfigBySlug } from '../lib/db';

const STORAGE_KEY = 'dve_config';

// Função auxiliar para carregar o backup local
function loadLocalConfig(): MotoboyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MotoboyConfig;
  } catch {
    // fallback
  }
  return defaultConfig;
}

export function useConfig(slug?: string) {
  // Inicialmente, tentamos usar o localStorage para não ter tela em branco (optimistic load)
  const [config, setConfigState] = useState<MotoboyConfig>(loadLocalConfig());
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Efeito principal: escutar o Firebase
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: () => void;
    let unsubscribeZones: () => void;

    async function setupCloud() {
      try {
        setLoading(true);
        // Primeiro, verifica se o tenant já existe na nuvem
        const { tenantId: tId } = await fetchConfigBySlug(slug!);
        
        let currentTenantId = tId;

        // Se o tenant NÃO existir na nuvem, fazemos a migração do localStorage para a nuvem
        if (!currentTenantId) {
          const localConf = loadLocalConfig();
          currentTenantId = await initializeTenant(slug!, localConf);
          console.log("Migração de localStorage para nuvem concluída!");
        }

        setTenantId(currentTenantId);

        // A partir daqui, o documento existe. Vamos configurar os listeners em TEMPO REAL.
        const tenantRef = doc(db, 'tenants', currentTenantId);
        const zonesRef = collection(db, `tenants/${currentTenantId}/zones`);

        // Escuta as alterações globais do motoboy
        unsubscribeProfile = onSnapshot(tenantRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setConfigState(prev => ({
              ...prev,
              motoboy: data.motoboy || prev.motoboy,
              origin: data.origin || prev.origin,
              theme: data.theme || prev.theme,
              whatsappTemplate: data.whatsappTemplate || prev.whatsappTemplate,
            }));
          }
        });

        // Escuta as alterações de zonas (cidades e preços)
        unsubscribeZones = onSnapshot(zonesRef, (snapshot) => {
          const zonesData = snapshot.docs.map(z => ({ id: z.id, ...z.data() } as DeliveryZone));
          
          setConfigState(prev => {
            const next = { ...prev, zones: zonesData };
            // Backup no localStorage apenas para otimizar próximos acessos offline
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
          });
        });

      } catch (err) {
        console.error("Erro ao buscar dados da nuvem:", err);
      } finally {
        setLoading(false);
      }
    }

    setupCloud();

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeZones) unsubscribeZones();
    };
  }, [slug]);

  // Função para salvar no Firebase (usada pelo painel Admin)
  const updateConfigCloud = useCallback(async (updater: (prev: MotoboyConfig) => MotoboyConfig) => {
    if (!tenantId) return;

    const next = updater(config);
    // Atualiza localmente para feedback instantâneo (optimistic UI)
    setConfigState(next);

    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      
      const { zones, ...rest } = next;
      // Atualiza o perfil e configs globais
      await setDoc(tenantRef, {
        motoboy: rest.motoboy,
        origin: rest.origin,
        theme: rest.theme,
        whatsappTemplate: rest.whatsappTemplate,
      }, { merge: true });

      // O AdminPage no momento lida com zones em lote, então o ideal
      // seria o updateConfigCloud não lidar com as zones todas juntas aqui,
      // mas como o Admin salva tudo junto, fazemos um loop:
      const zonesRef = collection(db, `tenants/${tenantId}/zones`);
      for (const zone of zones) {
        const zRef = doc(zonesRef, zone.id.toString());
        await setDoc(zRef, { ...zone });
      }
      
    } catch (e) {
      console.error("Erro ao salvar config:", e);
      // rollback se necessário
    }
  }, [config, tenantId]);

  return { config, loading, tenantId, updateConfig: updateConfigCloud };
}
