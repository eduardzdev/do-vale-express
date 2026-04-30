import { useEffect, useRef } from 'react';
import { X, MapPin, Clock, MessageCircle, ChevronRight, Info } from 'lucide-react';
import type { DeliveryZone, MotoboyConfig } from '../../types';
import { formatPrice, buildWhatsAppUrl } from '../../config/motoboy';

interface PriceCardProps {
  zone: DeliveryZone;
  config: MotoboyConfig;
  onClose: () => void;
}

export default function PriceCard({ zone, config, onClose }: PriceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const priceText = formatPrice(zone.price);
  const whatsappUrl = buildWhatsAppUrl(config, `${zone.name} - ${zone.state}`, priceText);

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        // Não fechar se clicar no mapa (o mapa tem seu próprio handler)
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const isOrigin = zone.isOrigin;

  return (
    <div className="price-card-overlay">
      <div ref={cardRef} className="price-card" style={{ '--zone-color': zone.color } as React.CSSProperties}>
        {/* Header */}
        <div className="price-card__header">
          <div className="price-card__location">
            <div className="price-card__dot" style={{ background: zone.color }} />
            <div>
              <h2 className="price-card__city">
                {zone.name}
                <span className="price-card__state">{zone.state}</span>
              </h2>
              {isOrigin && (
                <span className="price-card__badge price-card__badge--origin">📍 Cidade Base</span>
              )}
            </div>
          </div>
          <button className="price-card__close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Preço */}
        <div className="price-card__price-section">
          <span className="price-card__label">Valor da tele</span>
          <div className="price-card__price" style={{ color: zone.color }}>
            {priceText}
          </div>
          <span className="price-card__price-note">
            ⚠️ Pode variar conforme horário e peso
          </span>
          {zone.price.type === 'consult' && (
            <span className="price-card__price-note">consulte disponibilidade e valores</span>
          )}
        </div>

        {/* Detalhes */}
        <div className="price-card__details">
          {!isOrigin && (
            <div className="price-card__detail">
              <MapPin size={14} className="price-card__detail-icon" />
              <span>De <strong>{config.origin.name}</strong> para <strong>{zone.name}</strong></span>
            </div>
          )}
          {zone.etaMinutes && (
            <div className="price-card__detail">
              <Clock size={14} className="price-card__detail-icon" />
              <span>
                Prazo estimado:{' '}
                <strong>
                  {zone.etaMinutes < 60
                    ? `${zone.etaMinutes} min`
                    : `${Math.floor(zone.etaMinutes / 60)}h${zone.etaMinutes % 60 > 0 ? `${zone.etaMinutes % 60}min` : ''}`}
                </strong>
              </span>
            </div>
          )}
          {zone.notes && (
            <div className="price-card__detail price-card__detail--note">
              <Info size={14} className="price-card__detail-icon" />
              <span>{zone.notes}</span>
            </div>
          )}
        </div>

        {/* CTA WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="price-card__cta"
          id={`whatsapp-cta-${zone.id}`}
        >
          <MessageCircle size={20} className="price-card__cta-icon" />
          <span>Contratar no WhatsApp</span>
          <ChevronRight size={18} style={{ marginLeft: 'auto', opacity: 0.8 }} />
        </a>

        {/* Info horário */}
        {config.motoboy.workingHours && (
          <p className="price-card__hours">
            <Clock size={11} />
            {config.motoboy.workingHours}
          </p>
        )}
      </div>
    </div>
  );
}
