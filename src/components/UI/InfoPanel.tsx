import { MapPin, Clock, Bike } from 'lucide-react';
import type { MotoboyConfig } from '../../types';

interface InfoPanelProps {
  config: MotoboyConfig;
  totalZones: number;
}

export default function InfoPanel({ config, totalZones }: InfoPanelProps) {
  return (
    <div className="info-panel" id="info-panel">
      {/* Logo / Nome */}
      <div className="info-panel__header">
        <div className="info-panel__avatar">
          {config.motoboy.photo ? (
            <img src={config.motoboy.photo} alt={config.motoboy.name} />
          ) : (
            <Bike size={28} style={{ color: 'var(--primary)' }} />
          )}
        </div>
        <div>
          <h1 className="info-panel__name">{config.motoboy.name}</h1>
          <p className="info-panel__tagline">Tele Expressa — Todo o RS</p>
        </div>
      </div>

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

      {/* Legenda de cores */}
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
  );
}
