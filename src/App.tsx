import { useState, Suspense } from 'react';
import type { DeliveryZone } from './types';
import { motoboyConfig } from './config/motoboy';
import MapView from './components/Map/MapView';
import PriceCard from './components/UI/PriceCard';
import WhatsAppButton from './components/UI/WhatsAppButton';
import InfoPanel from './components/UI/InfoPanel';
import LoadingScreen from './components/UI/LoadingScreen';

export default function App() {
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  const activeZones = motoboyConfig.zones.filter((z) => z.active && !z.isOrigin);

  return (
    <div className="app">
      {/* Painel lateral — desktop */}
      <aside className="app__sidebar">
        <InfoPanel config={motoboyConfig} totalZones={activeZones.length} />
      </aside>

      {/* Mapa principal */}
      <main className="app__map">
        <Suspense fallback={<LoadingScreen />}>
          <MapView
            config={motoboyConfig}
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
          />
        </Suspense>

        {/* Header mobile */}
        <div className="app__mobile-header">
          <div className="app__mobile-brand">
            <span className="app__mobile-icon">🏍️</span>
            <div>
              <span className="app__mobile-name">{motoboyConfig.motoboy.name}</span>
              <span className="app__mobile-subtitle">Tele Expressa</span>
            </div>
          </div>
        </div>

        {/* Price Card — aparece ao selecionar zona */}
        {selectedZone && (
          <PriceCard
            zone={selectedZone}
            config={motoboyConfig}
            onClose={() => setSelectedZone(null)}
          />
        )}

        {/* FAB WhatsApp — sempre visível */}
        <WhatsAppButton config={motoboyConfig} />
      </main>
    </div>
  );
}
