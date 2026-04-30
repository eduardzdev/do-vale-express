import { MessageCircle } from 'lucide-react';
import type { MotoboyConfig } from '../../types';

interface WhatsAppButtonProps {
  config: MotoboyConfig;
}

export default function WhatsAppButton({ config }: WhatsAppButtonProps) {
  const url = `https://wa.me/${config.motoboy.phone}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      id="whatsapp-fab-button"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <MessageCircle size={26} />
      <span className="whatsapp-fab__label">WhatsApp</span>
    </a>
  );
}
