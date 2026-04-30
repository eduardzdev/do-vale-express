// ============================================================
// Tipos centrais do sistema de Mapa de Preços para Motoboys
// Preparado para multi-tenant e rastreamento em tempo real
// ============================================================

export type PriceType = 'fixed' | 'range' | 'consult';

export interface Price {
  type: PriceType;
  value?: number;    // Para type: 'fixed'
  min?: number;      // Para type: 'range'
  max?: number;      // Para type: 'range'
}

export type ZoneType = 'city' | 'district' | 'region';

export interface DeliveryZone {
  id: string;
  name: string;
  state: string;        // Ex: "SP", "MG"
  type: ZoneType;
  center: [number, number]; // [lat, lng]
  price: Price;
  color: string;            // Cor do polígono e pin
  isOrigin?: boolean;       // Cidade base do motoboy
  geojsonFile?: string;     // Nome do arquivo GeoJSON para colorir área
  etaMinutes?: number;      // Tempo estimado de entrega
  notes?: string;           // Observações (ex: "Somente até 18h")
  active: boolean;          // Zona ativa/desativada
}

export interface MotoboyInfo {
  name: string;
  phone: string;            // Número WhatsApp com DDI: "5519999999999"
  photo?: string;           // URL da foto
  description?: string;     // Breve descrição
  workingHours?: string;    // Ex: "Seg-Sex 8h-18h"
}

export interface MapTheme {
  primaryColor: string;
  accentColor: string;
  mapStyle: 'dark' | 'light';
}

export interface MotoboyConfig {
  // Identificação (preparado para multi-tenant)
  id: string;
  tenantSlug: string;       // URL slug: mapa.app/meu-motoboy

  // Info do motoboy/empresa
  motoboy: MotoboyInfo;

  // Cidade de origem
  origin: {
    name: string;
    coordinates: [number, number];
    description: string;
  };

  // Mensagem WhatsApp - variáveis: {name}, {origin}, {destination}, {price}
  whatsappTemplate: string;

  // Visual
  theme: MapTheme;

  // Configurações do mapa
  mapConfig: {
    defaultZoom: number;
    minZoom: number;
    maxZoom: number;
  };

  // Zonas de entrega
  zones: DeliveryZone[];
}

// ============================================================
// Tipos para Fase 2 (Rastreamento em Tempo Real - Firebase)
// ============================================================

export interface DriverLocation {
  driverId: string;
  tenantId: string;
  coordinates: [number, number];
  heading?: number;         // Direção em graus
  speed?: number;           // km/h
  updatedAt: Date;
  isOnline: boolean;
}

export interface ActiveDelivery {
  id: string;
  tenantId: string;
  driverId: string;
  clientToken: string;      // Token único para o cliente acompanhar
  origin: string;
  destination: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
  estimatedArrival?: Date;
}
