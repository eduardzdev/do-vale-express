import { Bike } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <div className="loading-screen__icon">
          <Bike size={40} />
        </div>
        <div className="loading-screen__dots">
          <span /><span /><span />
        </div>
        <p className="loading-screen__text">Carregando mapa...</p>
      </div>
    </div>
  );
}
