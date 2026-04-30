// ============================================================
// ZonesSection — tabela de cidades com CRUD completo
// ============================================================

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import type { MotoboyConfig, DeliveryZone } from '../../types';
import { formatPrice } from '../../config/motoboy';
import ZoneModal from '../components/ZoneModal';

interface Props {
  config: MotoboyConfig;
  setConfig: (c: MotoboyConfig) => void;
}

export default function ZonesSection({ config, setConfig }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = config.zones.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Move zone up/down in array ────────────────────────────
  function moveZone(id: string, dir: -1 | 1) {
    const zones = [...config.zones];
    const idx = zones.findIndex((z) => z.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= zones.length) return;
    [zones[idx], zones[newIdx]] = [zones[newIdx], zones[idx]];
    setConfig({ ...config, zones });
  }

  // ── Toggle active ─────────────────────────────────────────
  function toggleActive(id: string) {
    setConfig({
      ...config,
      zones: config.zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)),
    });
  }

  // ── Save from modal ───────────────────────────────────────
  function handleSaveZone(zone: DeliveryZone) {
    const exists = config.zones.some((z) => z.id === zone.id);
    if (exists) {
      setConfig({ ...config, zones: config.zones.map((z) => (z.id === zone.id ? zone : z)) });
    } else {
      setConfig({ ...config, zones: [...config.zones, zone] });
    }
    setModalOpen(false);
    setEditingZone(null);
  }

  // ── Delete ────────────────────────────────────────────────
  function handleDelete(id: string) {
    setConfig({ ...config, zones: config.zones.filter((z) => z.id !== id) });
    setDeleteId(null);
  }

  function openAdd() {
    setEditingZone(null);
    setModalOpen(true);
  }

  function openEdit(zone: DeliveryZone) {
    setEditingZone(zone);
    setModalOpen(true);
  }

  const activeCount = config.zones.filter((z) => z.active && !z.isOrigin).length;

  return (
    <div className="admin-section">
      {/* Header controls */}
      <div className="admin-zones-header">
        <div className="admin-zones-stats">
          <span><strong>{config.zones.length}</strong> cidades cadastradas</span>
          <span className="admin-zones-stats__sep">·</span>
          <span><strong>{activeCount}</strong> ativas</span>
        </div>
        <div className="admin-zones-controls">
          <input
            type="text"
            placeholder="Buscar cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
            id="zones-search"
          />
          <button className="admin-btn admin-btn--primary" onClick={openAdd} id="add-zone-btn">
            <Plus size={15} />
            <span>Nova cidade</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card admin-card--flush">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Preço</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    Nenhuma cidade encontrada.
                  </td>
                </tr>
              )}
              {filtered.map((zone, i) => (
                <tr key={zone.id} className={!zone.active ? 'admin-table__row--inactive' : ''}>
                  <td>
                    <div className="admin-order-btns">
                      <button
                        onClick={() => moveZone(zone.id, -1)}
                        disabled={i === 0}
                        title="Mover para cima"
                        className="admin-order-btn"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => moveZone(zone.id, 1)}
                        disabled={i === filtered.length - 1}
                        title="Mover para baixo"
                        className="admin-order-btn"
                      >
                        <ChevronDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__city">
                      <div
                        className="admin-table__city-dot"
                        style={{ background: zone.color }}
                      />
                      <span>{zone.name}</span>
                      {zone.isOrigin && (
                        <span className="admin-table__badge admin-table__badge--origin">BASE</span>
                      )}
                    </div>
                  </td>
                  <td>{zone.state}</td>
                  <td>
                    <span className="admin-table__type">{zone.type}</span>
                  </td>
                  <td>
                    <strong>{formatPrice(zone.price)}</strong>
                  </td>
                  <td>{zone.etaMinutes ? `${zone.etaMinutes} min` : '—'}</td>
                  <td>
                    <span className={`admin-table__status ${zone.active ? 'admin-table__status--on' : 'admin-table__status--off'}`}>
                      {zone.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        onClick={() => toggleActive(zone.id)}
                        title={zone.active ? 'Desativar' : 'Ativar'}
                        className="admin-icon-btn"
                      >
                        {zone.active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(zone)}
                        title="Editar"
                        className="admin-icon-btn admin-icon-btn--edit"
                      >
                        <Pencil size={14} />
                      </button>
                      {!zone.isOrigin && (
                        deleteId === zone.id ? (
                          <div className="admin-table__confirm">
                            <button
                              onClick={() => handleDelete(zone.id)}
                              className="admin-icon-btn admin-icon-btn--danger"
                              title="Confirmar exclusão"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="admin-icon-btn"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(zone.id)}
                            title="Remover"
                            className="admin-icon-btn admin-icon-btn--danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zone Modal */}
      {modalOpen && (
        <ZoneModal
          zone={editingZone}
          onSave={handleSaveZone}
          onClose={() => {
            setModalOpen(false);
            setEditingZone(null);
          }}
        />
      )}
    </div>
  );
}
