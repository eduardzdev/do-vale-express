import { useState, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { DeliveryZone } from './types';
import { useConfig } from './hooks/useConfig';
import MapView from './components/Map/MapView';
import PriceCard from './components/UI/PriceCard';
import WhatsAppButton from './components/UI/WhatsAppButton';
import InfoPanel from './components/UI/InfoPanel';
import LoadingScreen from './components/UI/LoadingScreen';
import AdminPage from './admin/AdminPage';
import { Settings } from 'lucide-react';

// ── Map View ─────────────────────────────────────────────────
function MapScreen() {
  const { config } = useConfig();
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const navigate = useNavigate();

  const activeZones = config.zones.filter((z) => z.active && !z.isOrigin);

  return (
    <div className="app">
      {/* Sidebar — desktop */}
      <aside className="app__sidebar">
        <InfoPanel config={config} totalZones={activeZones.length} />
      </aside>

      {/* Mapa principal */}
      <main className="app__map">
        <Suspense fallback={<LoadingScreen />}>
          <MapView
            config={config}
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
          />
        </Suspense>

        {/* Header mobile */}
        <div className="app__mobile-header">
          <div className="app__mobile-brand">
            <span className="app__mobile-icon">🏍️</span>
            <div>
              <span className="app__mobile-name">{config.motoboy.name}</span>
              <span className="app__mobile-subtitle">Tele Expressa</span>
            </div>
          </div>
        </div>

        {/* Price Card */}
        {selectedZone && (
          <PriceCard
            zone={selectedZone}
            config={config}
            onClose={() => setSelectedZone(null)}
          />
        )}

        {/* FAB WhatsApp */}
        <WhatsAppButton config={config} />

        {/* Admin access button */}
        <button
          className="admin-fab"
          onClick={() => navigate('/admin')}
          title="Painel Admin"
          id="open-admin-fab"
        >
          <Settings size={18} />
        </button>
      </main>
    </div>
  );
}

// ── App with Routes ──────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapScreen />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
