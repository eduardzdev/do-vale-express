// ============================================================
// MobileBottomSheet — drawer arrastável para mobile
// Substitui o header fixo mobile com um bottom sheet drag-to-expand
// ============================================================

import { useState, useRef, useCallback } from 'react';
import { MapPin, Clock, Bike, Settings, ChevronUp } from 'lucide-react';
import type { MotoboyConfig } from '../../types';

interface Props {
  config: MotoboyConfig;
  totalZones: number;
  onAdminClick: () => void;
}

const PEEK_HEIGHT = 76;      // px visíveis quando recolhido
const SHEET_HEIGHT_VH = 52;  // % da tela quando expandido
const SNAP_THRESHOLD = 50;   // px de drag para disparar snap

export default function MobileBottomSheet({ config, totalZones, onAdminClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaY, setDragDeltaY] = useState(0);

  const startYRef = useRef(0);
  const wasExpandedRef = useRef(false);

  // ── Handlers de touch ──────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    wasExpandedRef.current = expanded;
    setIsDragging(true);
    setDragDeltaY(0);
  }, [expanded]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startYRef.current;
    setDragDeltaY(delta);
    // Previne scroll da página enquanto arrasta
    e.stopPropagation();
  }, []);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (wasExpandedRef.current) {
      setExpanded(dragDeltaY < SNAP_THRESHOLD);   // drag down → recolhe
    } else {
      setExpanded(dragDeltaY < -SNAP_THRESHOLD);  // drag up → expande
    }
    setDragDeltaY(0);
  }, [dragDeltaY]);

  // ── Cálculo da posição ─────────────────────────────────────
  // collapsedY: empurra a sheet pra baixo, deixando só PEEK_HEIGHT visível
  // expandedY : 0 → top da sheet alinhado com o topo da área (50vh do fundo)
  let translateY: string;
  if (isDragging) {
    if (wasExpandedRef.current) {
      // Estava expandido: começa em 0, arrasta pra baixo (delta positivo)
      const clamped = Math.max(0, dragDeltaY);
      translateY = `${clamped}px`;
    } else {
      // Estava recolhido: começa no fundo, arrasta pra cima (delta negativo)
      const base = `calc(${SHEET_HEIGHT_VH}vh - ${PEEK_HEIGHT}px)`;
      translateY = `calc(${base} + ${dragDeltaY}px)`;
    }
  } else {
    translateY = expanded
      ? '0px'
      : `calc(${SHEET_HEIGHT_VH}vh - ${PEEK_HEIGHT}px)`;
  }

  return (
    <div
      className="mobile-sheet"
      style={{
        transform: `translateY(${translateY})`,
        transition: isDragging ? 'none' : 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        height: `${SHEET_HEIGHT_VH}vh`,
      }}
      role="dialog"
      aria-label="Informações do serviço"
    >
      {/* ── Área de drag (sempre visível) ── */}
      <div
        className="mobile-sheet__handle-area"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => !isDragging && setExpanded((v) => !v)}
      >
        {/* Indicador de arraste */}
        <div className="mobile-sheet__drag-pill" />

        {/* Linha com brand + ações */}
        <div className="mobile-sheet__header-row">
          <div className="mobile-sheet__brand">
            <div className="mobile-sheet__avatar">
              {config.motoboy.photo ? (
                <img src={config.motoboy.photo} alt={config.motoboy.name} />
              ) : (
                <Bike size={22} style={{ color: 'var(--primary)' }} />
              )}
            </div>
            <div className="mobile-sheet__brand-text">
              <span className="mobile-sheet__brand-name">{config.motoboy.name}</span>
              <span className="mobile-sheet__brand-sub">
                {config.motoboy.description ?? 'Tele Expressa — Todo o RS'}
              </span>
            </div>
          </div>

          <div className="mobile-sheet__actions">
            <button
              className="mobile-sheet__admin-btn"
              onClick={(e) => { e.stopPropagation(); onAdminClick(); }}
              title="Painel Admin"
              id="mobile-admin-btn"
            >
              <Settings size={16} />
            </button>
            <div className={`mobile-sheet__chevron ${expanded ? 'mobile-sheet__chevron--up' : ''}`}>
              <ChevronUp size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo expandido (scrollável) ── */}
      <div className="mobile-sheet__body">

        {/* Stats */}
        <div className="info-panel__stats">
          <div className="info-panel__stat">
            <span className="info-panel__stat-value">{totalZones}</span>
            <span className="info-panel__stat-label">cidades</span>
          </div>
          <div className="info-panel__stat-divider" />
          <div className="info-panel__stat">
            <span className="info-panel__stat-value">🏍️</span>
            <span className="info-panel__stat-label">express</span>
          </div>
        </div>

        {/* Origem */}
        <div className="info-panel__origin">
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <span className="info-panel__origin-label">Saindo de</span>
            <span className="info-panel__origin-city">{config.origin.name}</span>
          </div>
        </div>

        {/* Horário */}
        {config.motoboy.workingHours && (
          <div className="info-panel__hours">
            <Clock size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            <span>{config.motoboy.workingHours}</span>
          </div>
        )}

        {/* Legenda */}
        <div className="info-panel__legend">
          <span className="info-panel__legend-title">Faixa de preço</span>
          <div className="info-panel__legend-items">
            <div className="info-panel__legend-item">
              <div className="info-panel__legend-dot" style={{ background: '#22c55e' }} />
              <span>Até R$ 60</span>
            </div>
            <div className="info-panel__legend-item">
              <div className="info-panel__legend-dot" style={{ background: '#f59e0b' }} />
              <span>R$ 61 – R$ 130</span>
            </div>
            <div className="info-panel__legend-item">
              <div className="info-panel__legend-dot" style={{ background: '#ef4444' }} />
              <span>Acima de R$ 130</span>
            </div>
          </div>
          <p className="info-panel__price-warning">
            ⚠️ Preços podem variar conforme horário e peso
          </p>
        </div>

        <p className="info-panel__hint">
          Toque em uma cidade no mapa para ver o valor e contratar
        </p>
      </div>
    </div>
  );
}
