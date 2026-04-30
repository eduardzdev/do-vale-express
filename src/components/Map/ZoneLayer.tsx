import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MotoboyConfig } from '../../types';

interface ZoneLayerProps {
  zones: MotoboyConfig['zones'];
  selectedZoneId: string | null;
  onZoneClick: (zoneId: string) => void;
}

// Círculos de raio proporcional à cidade ao invés de GeoJSON
// (evita bundle pesado de polígonos; substituível por GeoJSON real)
export default function ZoneLayer({ zones, selectedZoneId, onZoneClick }: ZoneLayerProps) {
  const map = useMap();
  const layersRef = useRef<L.Circle[]>([]);

  useEffect(() => {
    layersRef.current.forEach((l) => l.remove());
    layersRef.current = [];

    zones
      .filter((z) => z.active && !z.isOrigin)
      .forEach((zone) => {
        const isSelected = zone.id === selectedZoneId;

        const circle = L.circle(zone.center, {
          radius: zone.radiusMeters ?? 4000,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isSelected ? 0.22 : 0.1,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.8 : 0.4,
          dashArray: zone.price.type === 'consult' ? '6, 4' : undefined,
        })
          .addTo(map)
          .on('click', () => onZoneClick(zone.id));

        layersRef.current.push(circle);
      });

    // Círculo de origem
    const originZone = zones.find((z) => z.isOrigin);
    if (originZone) {
      const originCircle = L.circle(originZone.center, {
        radius: originZone.radiusMeters ?? 2500,
        color: originZone.color,
        fillColor: originZone.color,
        fillOpacity: 0.12,
        weight: 2,
        opacity: 0.6,
      }).addTo(map);
      layersRef.current.push(originCircle);
    }

    return () => {
      layersRef.current.forEach((l) => l.remove());
      layersRef.current = [];
    };
  }, [zones, selectedZoneId]);

  return null;
}
