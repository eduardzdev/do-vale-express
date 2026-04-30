// ============================================================
// Painel Admin — do Vale Express
// Rota: /admin  (protegido por PIN)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Map, Settings, LogOut, Bike, ListOrdered } from 'lucide-react';
import { useConfig, getAdminPin } from '../hooks/useConfig';
import ProfileSection from './sections/ProfileSection';
import ZonesSection from './sections/ZonesSection';

type Tab = 'profile' | 'zones';

export default function AdminPage() {
  const navigate = useNavigate();
  const { config, setConfig, resetToDefaults } = useConfig();

  // ── Auth state ───────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  // ── PIN Login ────────────────────────────────────────────
  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === getAdminPin()) {
      setAuthed(true);
      setPinError('');
    } else {
      setPinError('PIN incorreto. Tente novamente.');
      setPin('');
    }
  }

  function handleSave() {
    // config is already saved on each change via setConfig,
    // this just shows visual feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // ── PIN Screen ───────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-lock">
        <div className="admin-lock__card">
          <div className="admin-lock__icon">
            <Lock size={28} />
          </div>
          <h1 className="admin-lock__title">Painel Admin</h1>
          <p className="admin-lock__sub">do Vale Express</p>
          <form onSubmit={handlePinSubmit} className="admin-lock__form">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              placeholder="Digite seu PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="admin-lock__input"
              autoFocus
              id="admin-pin-input"
            />
            {pinError && <p className="admin-lock__error">{pinError}</p>}
            <button type="submit" className="admin-lock__btn" id="admin-pin-submit">
              Entrar
            </button>
          </form>
          <p className="admin-lock__hint">PIN padrão: 1234</p>
        </div>
      </div>
    );
  }

  // ── Admin Panel ──────────────────────────────────────────
  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <div className="admin__brand-icon">
            <Bike size={20} />
          </div>
          <div>
            <span className="admin__brand-name">do Vale Express</span>
            <span className="admin__brand-sub">Painel Admin</span>
          </div>
        </div>

        <nav className="admin__nav">
          <button
            className={`admin__nav-item ${activeTab === 'profile' ? 'admin__nav-item--active' : ''}`}
            onClick={() => setActiveTab('profile')}
            id="admin-tab-profile"
          >
            <Settings size={17} />
            <span>Perfil & Configurações</span>
          </button>
          <button
            className={`admin__nav-item ${activeTab === 'zones' ? 'admin__nav-item--active' : ''}`}
            onClick={() => setActiveTab('zones')}
            id="admin-tab-zones"
          >
            <ListOrdered size={17} />
            <span>Cidades & Preços</span>
          </button>
        </nav>

        <div className="admin__sidebar-footer">
          <button
            className="admin__action-btn admin__action-btn--secondary"
            onClick={() => navigate('/')}
            id="admin-view-map"
          >
            <Map size={15} />
            <span>Ver Mapa</span>
          </button>
          <button
            className="admin__action-btn admin__action-btn--ghost"
            onClick={() => setAuthed(false)}
            id="admin-logout"
          >
            <LogOut size={15} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin__main">
        <div className="admin__topbar">
          <div>
            <h2 className="admin__topbar-title">
              {activeTab === 'profile' ? 'Perfil & Configurações' : 'Cidades & Preços'}
            </h2>
            <p className="admin__topbar-sub">
              {activeTab === 'profile'
                ? 'Edite os dados exibidos no painel lateral do mapa'
                : 'Gerencie as cidades e preços exibidos no mapa'}
            </p>
          </div>
          <div className="admin__topbar-actions">
            <button
              className={`admin__save-btn ${saved ? 'admin__save-btn--saved' : ''}`}
              onClick={handleSave}
              id="admin-save-btn"
            >
              {saved ? '✓ Salvo!' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        <div className="admin__content">
          {activeTab === 'profile' && (
            <ProfileSection config={config} setConfig={setConfig} onReset={resetToDefaults} />
          )}
          {activeTab === 'zones' && (
            <ZonesSection config={config} setConfig={setConfig} />
          )}
        </div>
      </main>
    </div>
  );
}
