// ============================================================
// Painel Admin — do Vale Express
// Rota: /admin  (protegido por PIN)
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Map, Settings, LogOut, Bike, ListOrdered } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import ProfileSection from './sections/ProfileSection';
import ZonesSection from './sections/ZonesSection';

type Tab = 'profile' | 'zones';

export default function AdminPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { config, updateConfig } = useConfig(slug);

  // ── Auth state ───────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  // ── Auth Listener ─────────────────────────────────────────
  useState(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setAuthed(!!user);
    });
    return unsubscribe;
  });

  // ── Login / Logout ────────────────────────────────────────
  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginError('');
    } catch (err: any) {
      setLoginError('Credenciais incorretas.');
      console.error(err);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setAuthed(false);
  }

  function handleSave() {
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
          <form onSubmit={handleLoginSubmit} className="admin-lock__form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-lock__input"
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-lock__input"
              style={{ marginTop: 10 }}
              required
            />
            {loginError && <p className="admin-lock__error">{loginError}</p>}
            <button type="submit" className="admin-lock__btn">
              Entrar
            </button>
          </form>
          <p className="admin-lock__hint">Acesse com sua conta motoboy</p>
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
            onClick={() => navigate(`/${slug}`)}
            id="admin-view-map"
          >
            <Map size={15} />
            <span>Ver Mapa</span>
          </button>
          <button
            className="admin__action-btn admin__action-btn--ghost"
            onClick={handleLogout}
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
            <ProfileSection config={config} setConfig={(conf: any) => updateConfig(() => conf)} onReset={() => {}} />
          )}
          {activeTab === 'zones' && (
            <ZonesSection config={config} setConfig={(conf: any) => updateConfig(() => conf)} />
          )}
        </div>
      </main>
    </div>
  );
}
