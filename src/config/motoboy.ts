// ============================================================
// CONFIGURAÇÃO PRINCIPAL — do Vale Express
// Edite aqui os dados do motoboy/empresa
// ============================================================

import type { MotoboyConfig } from '../types';

export const motoboyConfig: MotoboyConfig = {
  id: 'do-vale-express-001',
  tenantSlug: 'do-vale-express',

  motoboy: {
    name: 'do Vale Express',
    phone: '5551981827886',   // DDI 55 + DDD 51 + número
    description: 'Tele expressa e segura para todo o Rio Grande do Sul.',
    workingHours: 'Seg–Sex: 7h às 19h | Sáb: 8h às 14h',
  },

  origin: {
    name: 'Sapiranga',
    coordinates: [-29.6385, -51.0072],
    description: 'Ponto de saída de todas as entregas',
  },

  // Mensagem pré-preenchida no WhatsApp
  // Variáveis disponíveis: {name}, {origin}, {destination}, {price}
  whatsappTemplate:
    'Olá {name}! 🏍️ Quero contratar uma tele de {origin} para {destination}. Vi no mapa que o valor é {price}. Poderia confirmar a disponibilidade?',

  theme: {
    primaryColor: '#f97316',   // Laranja — cor da do Vale Express
    accentColor: '#fbbf24',    // Âmbar
    mapStyle: 'dark',
  },

  mapConfig: {
    defaultZoom: 9,
    minZoom: 7,
    maxZoom: 16,
  },

  // ============================================================
  // ZONAS DE ENTREGA
  // Preços fixos com aviso de variação por horário e peso
  // Cores por faixa de preço:
  //   Barato  → #22c55e (verde)   até R$ 60
  //   Médio   → #f59e0b (âmbar)   R$ 60 – R$ 120
  //   Caro    → #ef4444 (vermelho) acima de R$ 120
  // ============================================================
  zones: [

    // ── ORIGEM — SAPIRANGA ───────────────────────────────────
    {
      id: 'sapiranga',
      name: 'Sapiranga',
      state: 'RS',
      type: 'city',
      center: [-29.6385, -51.0072],
      price: { type: 'fixed', value: 12 },
      color: '#22c55e',
      isOrigin: true,
      etaMinutes: 20,
      notes: 'Tele dentro da cidade de Sapiranga',
      active: true,
    },

    // ── VALE DOS SINOS ───────────────────────────────────────
    {
      id: 'campo-bom',
      name: 'Campo Bom',
      state: 'RS',
      type: 'city',
      center: [-29.6730, -51.0513],
      price: { type: 'fixed', value: 25 },
      color: '#22c55e',
      etaMinutes: 20,
      active: true,
    },
    {
      id: 'ararica',
      name: 'Araricá',
      state: 'RS',
      type: 'city',
      center: [-29.6263, -50.9718],
      price: { type: 'fixed', value: 25 },
      color: '#22c55e',
      etaMinutes: 20,
      active: true,
    },
    {
      id: 'nova-hartz',
      name: 'Nova Hartz',
      state: 'RS',
      type: 'city',
      center: [-29.5824, -50.9153],
      price: { type: 'fixed', value: 35 },
      color: '#22c55e',
      etaMinutes: 30,
      active: true,
    },
    {
      id: 'estancia-velha',
      name: 'Estância Velha',
      state: 'RS',
      type: 'city',
      center: [-29.6447, -51.1839],
      price: { type: 'fixed', value: 35 },
      color: '#22c55e',
      etaMinutes: 30,
      active: true,
    },
    {
      id: 'dois-irmaos',
      name: 'Dois Irmãos',
      state: 'RS',
      type: 'city',
      center: [-29.5791, -51.0913],
      price: { type: 'fixed', value: 35 },
      color: '#22c55e',
      etaMinutes: 30,
      active: true,
    },
    {
      id: 'novo-hamburgo',
      name: 'Novo Hamburgo',
      state: 'RS',
      type: 'city',
      center: [-29.6783, -51.1306],
      price: { type: 'fixed', value: 35 },
      color: '#22c55e',
      etaMinutes: 35,
      active: true,
    },
    {
      id: 'ivoti',
      name: 'Ivoti',
      state: 'RS',
      type: 'city',
      center: [-29.6007, -51.1553],
      price: { type: 'fixed', value: 50 },
      color: '#22c55e',
      etaMinutes: 40,
      active: true,
    },
    {
      id: 'sao-leopoldo',
      name: 'São Leopoldo',
      state: 'RS',
      type: 'city',
      center: [-29.7606, -51.1470],
      price: { type: 'fixed', value: 50 },
      color: '#22c55e',
      etaMinutes: 45,
      active: true,
    },
    {
      id: 'portao',
      name: 'Portão',
      state: 'RS',
      type: 'city',
      center: [-29.7042, -51.2402],
      price: { type: 'fixed', value: 60 },
      color: '#22c55e',
      etaMinutes: 50,
      active: true,
    },
    {
      id: 'sapucaia-do-sul',
      name: 'Sapucaia do Sul',
      state: 'RS',
      type: 'city',
      center: [-29.8321, -51.1504],
      price: { type: 'fixed', value: 60 },
      color: '#22c55e',
      etaMinutes: 55,
      active: true,
    },
    {
      id: 'esteio',
      name: 'Esteio',
      state: 'RS',
      type: 'city',
      center: [-29.8541, -51.1784],
      price: { type: 'fixed', value: 70 },
      color: '#f59e0b',
      etaMinutes: 60,
      active: true,
    },
    {
      id: 'canoas',
      name: 'Canoas',
      state: 'RS',
      type: 'city',
      center: [-29.9177, -51.1836],
      price: { type: 'fixed', value: 90 },
      color: '#f59e0b',
      etaMinutes: 70,
      active: true,
    },
    {
      id: 'nova-santa-rita',
      name: 'Nova Santa Rita',
      state: 'RS',
      type: 'city',
      center: [-29.8540, -51.2810],
      price: { type: 'fixed', value: 100 },
      color: '#f59e0b',
      etaMinutes: 75,
      active: true,
    },

    // ── REGIÃO METROPOLITANA ─────────────────────────────────
    {
      id: 'gravataí-morungava',
      name: 'Gravataí (Morungava)',
      state: 'RS',
      type: 'district',
      center: [-29.8930, -50.9920],
      price: { type: 'fixed', value: 90 },
      color: '#f59e0b',
      etaMinutes: 70,
      active: true,
    },
    {
      id: 'cachoeirinha',
      name: 'Cachoeirinha',
      state: 'RS',
      type: 'city',
      center: [-29.9511, -51.0938],
      price: { type: 'fixed', value: 100 },
      color: '#f59e0b',
      etaMinutes: 75,
      active: true,
    },
    {
      id: 'gravataí',
      name: 'Gravataí',
      state: 'RS',
      type: 'city',
      center: [-29.9437, -50.9917],
      price: { type: 'fixed', value: 110 },
      color: '#f59e0b',
      etaMinutes: 80,
      active: true,
    },
    {
      id: 'porto-alegre',
      name: 'Porto Alegre',
      state: 'RS',
      type: 'city',
      center: [-30.0346, -51.2177],
      price: { type: 'fixed', value: 110 },
      color: '#f59e0b',
      etaMinutes: 80,
      notes: 'Região central de Porto Alegre',
      active: true,
    },
    {
      id: 'porto-alegre-zona-sul',
      name: 'POA Zona Sul',
      state: 'RS',
      type: 'district',
      center: [-30.1100, -51.2300],
      price: { type: 'fixed', value: 130 },
      color: '#ef4444',
      etaMinutes: 95,
      active: true,
    },
    {
      id: 'alvorada',
      name: 'Alvorada',
      state: 'RS',
      type: 'city',
      center: [-29.9897, -51.0783],
      price: { type: 'fixed', value: 120 },
      color: '#f59e0b',
      etaMinutes: 85,
      active: true,
    },
    {
      id: 'eldorado-do-sul',
      name: 'Eldorado do Sul',
      state: 'RS',
      type: 'city',
      center: [-30.0867, -51.3720],
      price: { type: 'fixed', value: 120 },
      color: '#f59e0b',
      etaMinutes: 90,
      active: true,
    },
    {
      id: 'viamao',
      name: 'Viamão',
      state: 'RS',
      type: 'city',
      center: [-30.0807, -51.0229],
      price: { type: 'fixed', value: 140 },
      color: '#ef4444',
      etaMinutes: 100,
      active: true,
    },
    {
      id: 'guaiba',
      name: 'Guaíba',
      state: 'RS',
      type: 'city',
      center: [-30.1140, -51.3253],
      price: { type: 'fixed', value: 150 },
      color: '#ef4444',
      etaMinutes: 110,
      active: true,
    },

    // ── SERRA GAÚCHA ─────────────────────────────────────────
    {
      id: 'gramado',
      name: 'Gramado',
      state: 'RS',
      type: 'city',
      center: [-29.3789, -50.8762],
      price: { type: 'fixed', value: 110 },
      color: '#f59e0b',
      etaMinutes: 80,
      active: true,
    },
    {
      id: 'canela',
      name: 'Canela',
      state: 'RS',
      type: 'city',
      center: [-29.3638, -50.8154],
      price: { type: 'fixed', value: 120 },
      color: '#f59e0b',
      etaMinutes: 85,
      active: true,
    },
    {
      id: 'carlos-barbosa',
      name: 'Carlos Barbosa',
      state: 'RS',
      type: 'city',
      center: [-29.2964, -51.5018],
      price: { type: 'fixed', value: 140 },
      color: '#ef4444',
      etaMinutes: 100,
      active: true,
    },
    {
      id: 'farroupilha',
      name: 'Farroupilha',
      state: 'RS',
      type: 'city',
      center: [-29.2255, -51.3424],
      price: { type: 'fixed', value: 150 },
      color: '#ef4444',
      etaMinutes: 110,
      active: true,
    },
    {
      id: 'garibaldi',
      name: 'Garibaldi',
      state: 'RS',
      type: 'city',
      center: [-29.2560, -51.5340],
      price: { type: 'fixed', value: 150 },
      color: '#ef4444',
      etaMinutes: 110,
      active: true,
    },
    {
      id: 'caxias-do-sul',
      name: 'Caxias do Sul',
      state: 'RS',
      type: 'city',
      center: [-29.1678, -51.1794],
      price: { type: 'fixed', value: 180 },
      color: '#ef4444',
      etaMinutes: 130,
      active: true,
    },
    {
      id: 'bento-goncalves',
      name: 'Bento Gonçalves',
      state: 'RS',
      type: 'city',
      center: [-29.1699, -51.5185],
      price: { type: 'fixed', value: 200 },
      color: '#ef4444',
      etaMinutes: 150,
      active: true,
    },
  ],
};

// ─── Utilitários ────────────────────────────────────────────

export function formatPrice(price: MotoboyConfig['zones'][0]['price']): string {
  switch (price.type) {
    case 'fixed':
      return `R$ ${price.value!.toFixed(0)}`;
    case 'range':
      return `R$ ${price.min!.toFixed(0)} – ${price.max!.toFixed(0)}`;
    case 'consult':
      return 'Sob consulta';
  }
}

export function buildWhatsAppUrl(
  config: MotoboyConfig,
  destination: string,
  price: string
): string {
  const message = config.whatsappTemplate
    .replace('{name}', config.motoboy.name)
    .replace('{origin}', config.origin.name)
    .replace('{destination}', destination)
    .replace('{price}', price);

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${config.motoboy.phone}?text=${encoded}`;
}

export function getZonesByPriceCategory(zones: MotoboyConfig['zones']) {
  return {
    cheap: zones.filter((z) => z.price.type === 'fixed' && (z.price.value ?? 0) <= 60),
    medium: zones.filter((z) =>
      (z.price.type === 'fixed' && (z.price.value ?? 0) > 60 && (z.price.value ?? 0) <= 130) ||
      z.price.type === 'range'
    ),
    expensive: zones.filter((z) => z.price.type === 'fixed' && (z.price.value ?? 0) > 130),
    consult: zones.filter((z) => z.price.type === 'consult'),
  };
}
