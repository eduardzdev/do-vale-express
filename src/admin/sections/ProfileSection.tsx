// ============================================================
// ProfileSection — edita perfil, tema, WhatsApp, cidade base
// ============================================================

import { User, Phone, Clock, MapPin, Palette, MessageSquare, Image, RotateCcw } from 'lucide-react';
import type { MotoboyConfig } from '../../types';
import { useState } from 'react';
interface Props {
  config: MotoboyConfig;
  setConfig: (c: MotoboyConfig) => void;
  onReset: () => void;
}

const PRESET_COLORS = [
  '#f97316', // orange
  '#ef4444', // red
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#eab308', // yellow
  '#14b8a6', // teal
  '#f43f5e', // rose
  '#6366f1', // indigo
];

export default function ProfileSection({ config, setConfig, onReset }: Props) {
  const [showReset, setShowReset] = useState(false);

  // ── Helpers ──────────────────────────────────────────────
  function updateMotoboy(field: string, value: string) {
    setConfig({ ...config, motoboy: { ...config.motoboy, [field]: value } });
  }

  function updateOrigin(field: string, value: string | number) {
    setConfig({ ...config, origin: { ...config.origin, [field]: value } });
  }

  function updateTheme(field: string, value: string) {
    setConfig({ ...config, theme: { ...config.theme, [field]: value } });
    // Also update CSS variable live
    document.documentElement.style.setProperty('--primary', value);
  }


  function handleReset() {
    onReset();
    setShowReset(false);
  }

  return (
    <div className="admin-section">

      {/* ── Identidade ────────────────────────────────────── */}
      <div className="admin-card">
        <div className="admin-card__header">
          <User size={16} />
          <h3>Identidade da Empresa</h3>
        </div>
        <div className="admin-form">
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="profile-name">Nome da empresa / motoboy</label>
              <input
                id="profile-name"
                type="text"
                value={config.motoboy.name}
                onChange={(e) => updateMotoboy('name', e.target.value)}
                placeholder="Ex: do Vale Express"
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="profile-phone">
                <Phone size={12} /> WhatsApp (com DDI e DDD)
              </label>
              <input
                id="profile-phone"
                type="text"
                value={config.motoboy.phone}
                onChange={(e) => updateMotoboy('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="5551999999999"
              />
              <span className="admin-form__hint">Formato: 55 + DDD + número (sem espaços ou traços)</span>
            </div>
          </div>

          <div className="admin-form__field">
            <label htmlFor="profile-description">Descrição curta</label>
            <input
              id="profile-description"
              type="text"
              value={config.motoboy.description ?? ''}
              onChange={(e) => updateMotoboy('description', e.target.value)}
              placeholder="Tele expressa e segura para todo o RS."
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="profile-hours">
                <Clock size={12} /> Horário de funcionamento
              </label>
              <input
                id="profile-hours"
                type="text"
                value={config.motoboy.workingHours ?? ''}
                onChange={(e) => updateMotoboy('workingHours', e.target.value)}
                placeholder="Seg–Sex: 7h às 19h | Sáb: 8h às 14h"
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="profile-photo">
                <Image size={12} /> URL da foto / avatar
              </label>
              <input
                id="profile-photo"
                type="text"
                value={config.motoboy.photo ?? ''}
                onChange={(e) => updateMotoboy('photo', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Preview do avatar */}
          {config.motoboy.photo && (
            <div className="admin-avatar-preview">
              <img src={config.motoboy.photo} alt="Avatar" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <span>Preview do avatar</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Cidade Base ───────────────────────────────────── */}
      <div className="admin-card">
        <div className="admin-card__header">
          <MapPin size={16} />
          <h3>Cidade Base (Ponto de Saída)</h3>
        </div>
        <div className="admin-form">
          <div className="admin-form__row admin-form__row--3">
            <div className="admin-form__field">
              <label htmlFor="origin-name">Nome da cidade</label>
              <input
                id="origin-name"
                type="text"
                value={config.origin.name}
                onChange={(e) => updateOrigin('name', e.target.value)}
                placeholder="Sapiranga"
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="origin-lat">Latitude</label>
              <input
                id="origin-lat"
                type="number"
                step="0.0001"
                value={config.origin.coordinates[0]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    origin: {
                      ...config.origin,
                      coordinates: [parseFloat(e.target.value) || 0, config.origin.coordinates[1]],
                    },
                  })
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="origin-lng">Longitude</label>
              <input
                id="origin-lng"
                type="number"
                step="0.0001"
                value={config.origin.coordinates[1]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    origin: {
                      ...config.origin,
                      coordinates: [config.origin.coordinates[0], parseFloat(e.target.value) || 0],
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="admin-form__field">
            <label htmlFor="origin-desc">Descrição</label>
            <input
              id="origin-desc"
              type="text"
              value={config.origin.description}
              onChange={(e) => updateOrigin('description', e.target.value)}
              placeholder="Ponto de saída de todas as entregas"
            />
          </div>
          <p className="admin-form__hint">
            💡 Para obter lat/lng: abra{' '}
            <a href="https://maps.google.com" target="_blank" rel="noreferrer">
              Google Maps
            </a>
            , clique direito em qualquer ponto → "O que há aqui?"
          </p>
        </div>
      </div>

      {/* ── Tema & Cores ──────────────────────────────────── */}
      <div className="admin-card">
        <div className="admin-card__header">
          <Palette size={16} />
          <h3>Cor Primária da Marca</h3>
        </div>
        <div className="admin-form">
          <div className="admin-color-picker">
            <div className="admin-color-picker__presets">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`admin-color-preset ${config.theme.primaryColor === color ? 'admin-color-preset--active' : ''}`}
                  style={{ background: color }}
                  onClick={() => updateTheme('primaryColor', color)}
                  title={color}
                />
              ))}
            </div>
            <div className="admin-color-picker__custom">
              <label htmlFor="color-custom">Cor personalizada:</label>
              <input
                id="color-custom"
                type="color"
                value={config.theme.primaryColor}
                onChange={(e) => updateTheme('primaryColor', e.target.value)}
              />
              <span className="admin-color-picker__value">{config.theme.primaryColor}</span>
            </div>
          </div>

          <div className="admin-form__field" style={{ marginTop: 12 }}>
            <label htmlFor="theme-style">Estilo do mapa</label>
            <select
              id="theme-style"
              value={config.theme.mapStyle}
              onChange={(e) => updateTheme('mapStyle', e.target.value)}
            >
              <option value="dark">Escuro (recomendado)</option>
              <option value="light">Claro</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Mensagem WhatsApp ─────────────────────────────── */}
      <div className="admin-card">
        <div className="admin-card__header">
          <MessageSquare size={16} />
          <h3>Mensagem WhatsApp (template)</h3>
        </div>
        <div className="admin-form">
          <div className="admin-form__field">
            <label htmlFor="whatsapp-template">Mensagem pré-preenchida</label>
            <textarea
              id="whatsapp-template"
              rows={4}
              value={config.whatsappTemplate}
              onChange={(e) => setConfig({ ...config, whatsappTemplate: e.target.value })}
            />
          </div>
          <div className="admin-form__hint admin-variables">
            <strong>Variáveis disponíveis:</strong>
            <code>{'{name}'}</code> — nome da empresa &nbsp;
            <code>{'{origin}'}</code> — cidade base &nbsp;
            <code>{'{destination}'}</code> — cidade clicada &nbsp;
            <code>{'{price}'}</code> — valor da tele
          </div>
          {/* Preview */}
          <div className="admin-preview-box">
            <span className="admin-preview-box__label">Preview:</span>
            <p>
              {config.whatsappTemplate
                .replace('{name}', config.motoboy.name)
                .replace('{origin}', config.origin.name)
                .replace('{destination}', 'Gramado')
                .replace('{price}', 'R$ 110')}
            </p>
          </div>
        </div>
      </div>


      {/* ── Reset ─────────────────────────────────────────── */}
      <div className="admin-card admin-card--danger">
        <div className="admin-card__header">
          <RotateCcw size={16} />
          <h3>Restaurar configurações padrão</h3>
        </div>
        <p className="admin-card__desc">
          Isso apaga todas as customizações e restaura os dados originais do sistema. Não pode ser desfeito.
        </p>
        {!showReset ? (
          <button className="admin-btn admin-btn--danger" onClick={() => setShowReset(true)} id="reset-btn">
            Restaurar padrões
          </button>
        ) : (
          <div className="admin-confirm">
            <p>Tem certeza? Isso irá apagar todas as alterações.</p>
            <div className="admin-confirm__actions">
              <button className="admin-btn admin-btn--danger" onClick={handleReset} id="reset-confirm-btn">
                Sim, restaurar
              </button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowReset(false)} id="reset-cancel-btn">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
