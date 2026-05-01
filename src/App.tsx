import { useState, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import type { DeliveryZone } from './types';
import { useConfig } from './hooks/useConfig';
import MapView from './components/Map/MapView';
import PriceCard from './components/UI/PriceCard';
import WhatsAppButton from './components/UI/WhatsAppButton';
import InfoPanel from './components/UI/InfoPanel';
import MobileBottomSheet from './components/UI/MobileBottomSheet';
import LoadingScreen from './components/UI/LoadingScreen';
import AdminPage from './admin/AdminPage';
import { Settings } from 'lucide-react';

// ── Map View ─────────────────────────────────────────────────
function MapScreen() {
  const { slug } = useParams();
  const { config } = useConfig();
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const navigate = useNavigate();

  const activeZones = config.zones.filter((z) => z.active && !z.isOrigin);

  return (
    <div className="app">
      {/* Sidebar — desktop only */}
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

        {/* Admin FAB — desktop only; mobile usa botão dentro do MobileBottomSheet */}
        <button
          className="admin-fab admin-fab--desktop"
          onClick={() => navigate(`/${slug}/admin`)}
          title="Painel Admin"
          id="open-admin-fab"
        >
          <Settings size={18} />
        </button>
      </main>

      {/* Bottom Sheet — mobile only */}
      <MobileBottomSheet
        config={config}
        totalZones={activeZones.length}
        onAdminClick={() => navigate(`/${slug}/admin`)}
      />
    </div>
  );
}

// ── App with Routes ──────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dovale" replace />} />
      <Route path="/admin" element={<Navigate to="/dovale/admin" replace />} />
      <Route path="/:slug" element={<MapScreen />} />
      <Route path="/:slug/admin" element={<AdminPage />} />
    </Routes>
  );
}
