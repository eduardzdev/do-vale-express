import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { DeliveryZone } from '../../types';
import { formatPrice } from '../../config/motoboy';

interface PriceMarkerProps {
  zone: DeliveryZone;
  isSelected: boolean;
  onClick: (zone: DeliveryZone) => void;
}

function createPriceIcon(zone: DeliveryZone, isSelected: boolean): L.DivIcon {
  const priceText = formatPrice(zone.price);
  const isOrigin = zone.isOrigin;
  const size = isOrigin ? 72 : isSelected ? 62 : 54;
  const borderWidth = isSelected ? 3 : 2;

  const html = isOrigin
    ? `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${zone.color}, ${zone.color}cc);
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px ${zone.color}60, 0 0 0 4px ${zone.color}30;
        cursor: pointer;
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        transition: transform 0.2s ease;
        position: relative;
      ">
        <span style="font-size: 20px; line-height: 1;">🏍️</span>
        <span style="font-size: 9px; font-weight: 700; color: white; letter-spacing: 0.3px; margin-top: 1px;">BASE</span>
        <div style="
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          background: ${zone.color};
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${zone.name}</div>
      </div>
    `
    : `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      ">
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(135deg, ${zone.color}ee, ${zone.color}bb);
          border: ${borderWidth}px solid ${isSelected ? 'white' : zone.color + '80'};
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px ${zone.color}50, 0 2px 6px rgba(0,0,0,0.3);
          transform: ${isSelected ? 'scale(1.12)' : 'scale(1)'};
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        ">
          <span style="
            font-size: ${priceText.length > 8 ? '8px' : '9px'};
            font-weight: 800;
            color: white;
            text-align: center;
            line-height: 1.1;
            padding: 0 3px;
            letter-spacing: -0.3px;
          ">${priceText}</span>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 7px solid ${zone.color}bb;
          margin-top: -1px;
        "></div>
      </div>
    `;

  const totalHeight = isOrigin ? size + 28 : size + 8;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, totalHeight],
    iconAnchor: [size / 2, isOrigin ? size + 28 : size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

export default function PriceMarker({ zone, isSelected, onClick }: PriceMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const icon = createPriceIcon(zone, isSelected);

    if (markerRef.current) {
      markerRef.current.setIcon(icon);
      return;
    }

    const marker = L.marker(zone.center, { icon, zIndexOffset: isSelected ? 1000 : zone.isOrigin ? 500 : 0 })
      .addTo(map)
      .on('click', () => onClick(zone));

    markerRef.current = marker;

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      const icon = createPriceIcon(zone, isSelected);
      markerRef.current.setIcon(icon);
      markerRef.current.setZIndexOffset(isSelected ? 1000 : zone.isOrigin ? 500 : 0);
    }
  }, [isSelected]);

  return null;
}
