// ============================================================
// ZoneModal — formulário de criação / edição de cidade
// ============================================================

import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import type { DeliveryZone, ZoneType, PriceType } from '../../types';

interface Props {
  zone: DeliveryZone | null;   // null = new
  onSave: (zone: DeliveryZone) => void;
  onClose: () => void;
}

const ZONE_COLORS = [
  { label: 'Verde (barato)',  value: '#22c55e' },
  { label: 'Âmbar (médio)',   value: '#f59e0b' },
  { label: 'Vermelho (caro)', value: '#ef4444' },
  { label: 'Laranja',         value: '#f97316' },
  { label: 'Roxo',            value: '#a855f7' },
  { label: 'Azul',            value: '#3b82f6' },
];

const EMPTY: DeliveryZone = {
  id: '',
  name: '',
  state: 'RS',
  type: 'city',
  center: [-29.0, -51.0],
  price: { type: 'fixed', value: 50 },
  color: '#22c55e',
  etaMinutes: 60,
  notes: '',
  radiusMeters: 4000,
  active: true,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function ZoneModal({ zone, onSave, onClose }: Props) {
  const isNew = !zone;
  const [form, setForm] = useState<DeliveryZone>(zone ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate ID from name when creating
  useEffect(() => {
    if (isNew && form.name) {
      setForm((f) => ({ ...f, id: slugify(f.name) }));
    }
  }, [form.name, isNew]);

  function update(field: keyof DeliveryZone, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updatePrice(field: string, value: unknown) {
    setForm((f) => ({ ...f, price: { ...f.price, [field]: value } }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome obrigatório';
    if (!form.state.trim()) e.state = 'Estado obrigatório';
    if (!form.id.trim()) e.id = 'ID obrigatório';
    if (form.price.type === 'fixed' && !form.price.value) e.price = 'Valor obrigatório';
    if (form.price.type === 'range' && (!form.price.min || !form.price.max)) e.price = 'Mínimo e máximo obrigatórios';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal__header">
          <div className="admin-modal__title">
            <MapPin size={16} />
            <h3>{isNew ? 'Nova cidade' : `Editar — ${zone.name}`}</h3>
          </div>
          <button className="admin-modal__close" onClick={onClose} id="modal-close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-modal__body">
          <div className="admin-form">

            {/* Identificação */}
            <div className="admin-form__section-title">Identificação</div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="zone-name">Nome da cidade *</label>
                <input
                  id="zone-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ex: Gramado"
                  autoFocus
                />
                {errors.name && <span className="admin-form__error">{errors.name}</span>}
              </div>
              <div className="admin-form__field">
                <label htmlFor="zone-state">Estado (sigla) *</label>
                <input
                  id="zone-state"
                  type="text"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => update('state', e.target.value.toUpperCase())}
                  placeholder="RS"
                />
                {errors.state && <span className="admin-form__error">{errors.state}</span>}
              </div>
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="zone-id">ID único (gerado automaticamente)</label>
                <input
                  id="zone-id"
                  type="text"
                  value={form.id}
                  onChange={(e) => update('id', slugify(e.target.value))}
                  placeholder="gramado"
                />
                {errors.id && <span className="admin-form__error">{errors.id}</span>}
              </div>
              <div className="admin-form__field">
                <label htmlFor="zone-type">Tipo de área</label>
                <select
                  id="zone-type"
                  value={form.type}
                  onChange={(e) => update('type', e.target.value as ZoneType)}
                >
                  <option value="city">Cidade</option>
                  <option value="district">Bairro / Região</option>
                  <option value="region">Mesorregião</option>
                </select>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="admin-form__section-title">Coordenadas no mapa</div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="zone-lat">Latitude</label>
                <input
                  id="zone-lat"
                  type="number"
                  step="0.0001"
                  value={form.center[0]}
                  onChange={(e) =>
                    update('center', [parseFloat(e.target.value) || 0, form.center[1]])
                  }
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="zone-lng">Longitude</label>
                <input
                  id="zone-lng"
                  type="number"
                  step="0.0001"
                  value={form.center[1]}
                  onChange={(e) =>
                    update('center', [form.center[0], parseFloat(e.target.value) || 0])
                  }
                />
              </div>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="admin-link"
            >
              📍 Clique direito no Google Maps → "O que há aqui?" para obter lat/lng
            </a>

            {/* Preço */}
            <div className="admin-form__section-title">Preço</div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="price-type">Tipo de preço</label>
                <select
                  id="price-type"
                  value={form.price.type}
                  onChange={(e) => updatePrice('type', e.target.value as PriceType)}
                >
                  <option value="fixed">Fixo (ex: R$ 50)</option>
                  <option value="range">Faixa (ex: R$ 40 – 60)</option>
                  <option value="consult">Sob consulta</option>
                </select>
              </div>

              {form.price.type === 'fixed' && (
                <div className="admin-form__field">
                  <label htmlFor="price-value">Valor (R$)</label>
                  <input
                    id="price-value"
                    type="number"
                    min={0}
                    step={1}
                    value={form.price.value ?? ''}
                    onChange={(e) => updatePrice('value', parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}

              {form.price.type === 'range' && (
                <>
                  <div className="admin-form__field">
                    <label htmlFor="price-min">Mínimo (R$)</label>
                    <input
                      id="price-min"
                      type="number"
                      min={0}
                      value={form.price.min ?? ''}
                      onChange={(e) => updatePrice('min', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="admin-form__field">
                    <label htmlFor="price-max">Máximo (R$)</label>
                    <input
                      id="price-max"
                      type="number"
                      min={0}
                      value={form.price.max ?? ''}
                      onChange={(e) => updatePrice('max', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}
            </div>
            {errors.price && <span className="admin-form__error">{errors.price}</span>}

            {/* Visual */}
            <div className="admin-form__section-title">Visual</div>
            <div className="admin-form__field">
              <label>Cor do marcador</label>
              <div className="admin-color-swatches">
                {ZONE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`admin-color-swatch ${form.color === c.value ? 'admin-color-swatch--active' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => update('color', c.value)}
                    title={c.label}
                  />
                ))}
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => update('color', e.target.value)}
                  title="Cor personalizada"
                  className="admin-color-input"
                />
              </div>
            </div>

            {/* Raio do círculo */}
            <div className="admin-form__field">
              <label htmlFor="zone-radius">
                Expansão da área colorida no mapa —{' '}
                <strong style={{ color: 'var(--primary)' }}>
                  {((form.radiusMeters ?? 4000) / 1000).toFixed(1)} km
                </strong>
              </label>
              <div className="admin-radius-control">
                <span className="admin-radius-control__label">500 m</span>
                <input
                  id="zone-radius"
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  value={form.radiusMeters ?? 4000}
                  onChange={(e) => update('radiusMeters', parseInt(e.target.value))}
                  className="admin-radius-slider"
                />
                <span className="admin-radius-control__label">20 km</span>
                <input
                  type="number"
                  min={500}
                  max={20000}
                  step={500}
                  value={form.radiusMeters ?? 4000}
                  onChange={(e) => update('radiusMeters', parseInt(e.target.value) || 4000)}
                  className="admin-radius-input"
                  title="Raio em metros"
                />
                <span className="admin-radius-control__label">m</span>
              </div>
              <p className="admin-form__hint">Padrão: 4000 m (4 km). Cidades menores → valor menor; cidades grandes ou regiões → valor maior.</p>
            </div>

            {/* Extras */}
            <div className="admin-form__section-title">Informações extras</div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="zone-eta">Prazo estimado (minutos)</label>
                <input
                  id="zone-eta"
                  type="number"
                  min={0}
                  value={form.etaMinutes ?? ''}
                  onChange={(e) => update('etaMinutes', parseInt(e.target.value) || undefined)}
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="zone-active">Status</label>
                <select
                  id="zone-active"
                  value={form.active ? 'true' : 'false'}
                  onChange={(e) => update('active', e.target.value === 'true')}
                >
                  <option value="true">Ativa — aparece no mapa</option>
                  <option value="false">Inativa — oculta no mapa</option>
                </select>
              </div>
            </div>

            <div className="admin-form__field">
              <label htmlFor="zone-notes">Observações (exibidas no card)</label>
              <input
                id="zone-notes"
                type="text"
                value={form.notes ?? ''}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Ex: Apenas região central"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} id="modal-cancel">
              Cancelar
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" id="modal-save">
              {isNew ? 'Adicionar cidade' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
