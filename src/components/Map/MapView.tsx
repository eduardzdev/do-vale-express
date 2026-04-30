import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { MotoboyConfig, DeliveryZone } from '../../types';
import PriceMarker from './PriceMarker';
import ZoneLayer from './ZoneLayer';

interface MapViewProps {
  config: MotoboyConfig;
  selectedZone: DeliveryZone | null;
  onZoneSelect: (zone: DeliveryZone | null) => void;
}

// Tiles CartoDB Dark Matter — gratuitos, sem API key
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function MapView({ config, selectedZone, onZoneSelect }: MapViewProps) {
  const tileUrl = config.theme.mapStyle === 'dark' ? DARK_TILE_URL : LIGHT_TILE_URL;

  const handleZoneClick = (zone: DeliveryZone) => {
    onZoneSelect(zone.id === selectedZone?.id ? null : zone);
  };

  const handleZoneIdClick = (zoneId: string) => {
    const zone = config.zones.find((z) => z.id === zoneId);
    if (zone) handleZoneClick(zone);
  };

  return (
    <MapContainer
      center={config.origin.coordinates}
      zoom={config.mapConfig.defaultZoom}
      minZoom={config.mapConfig.minZoom}
      maxZoom={config.mapConfig.maxZoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer url={tileUrl} attribution={TILE_ATTRIBUTION} />

      {/* Áreas coloridas por zona */}
      <ZoneLayer
        zones={config.zones}
        selectedZoneId={selectedZone?.id ?? null}
        onZoneClick={handleZoneIdClick}
      />

      {/* Pins de preço */}
      {config.zones
        .filter((z) => z.active)
        .map((zone) => (
          <PriceMarker
            key={zone.id}
            zone={zone}
            isSelected={selectedZone?.id === zone.id}
            onClick={handleZoneClick}
          />
        ))}
    </MapContainer>
  );
}
