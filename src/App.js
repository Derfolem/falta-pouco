import React, { useState, useEffect } from 'react';
import { Calendar, Gift, MapPin, Clock, Heart, Copy, Check } from 'lucide-react';

export default function WeddingSite() {
  const [tempoRestante, setTempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });
  const [pixCopiado, setPixCopiado] = useState(false);

  const dataEvento = new Date('2025-12-04T13:00:00');
  const chavePix = '106.733.327-48';

  // Cronômetro regressivo
  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const diferenca = dataEvento - agora;

      if (diferenca > 0) {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        setTempoRestante({ dias, horas, minutos, segundos });
      } else {
        // Se a data já passou, mostrar zeros
        setTempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calcularTempo();
    const intervalo = setInterval(calcularTempo, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Adicionar ao Google Calendar
  const adicionarGoogleCalendar = () => {
    const titulo = encodeURIComponent('Casamento Fred e Domi');
    const detalhes = encodeURIComponent('Celebração do casamento de Fred e Domi');
    const local = encodeURIComponent('Restaurante Casa Bounasera');
    const dataInicio = '20251104T130000';
    const dataFim = '20251104T160000';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalhes}&location=${local}&dates=${dataInicio}/${dataFim}`;
    window.open(url, '_blank');
  };

  // Baixar arquivo .ics
  const baixarICS = () => {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Fred e Domi Wedding//PT-BR
BEGIN:VEVENT
UID:${Date.now()}@wedding
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251104T130000
DTEND:20251104T160000
SUMMARY:Casamento Fred e Domi
DESCRIPTION:Celebração do casamento de Fred e Domi
LOCATION:Restaurante Casa Bounasera
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'casamento-fred-domi.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copiar chave PIX
  const copiarPix = async () => {
    try {
      await navigator.clipboard.writeText(chavePix);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Scroll suave para seção de presentes
  const irParaPresentes = () => {
    const secao = document.getElementById('presentes');
    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const formatarNumero = (num) => String(num).padStart(2, '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/70 via-purple-900/70 to-pink-900/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse text-pink-200" />
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-4 tracking-wide">
            Fred e Domi
          </h1>
          <p className="text-2xl md:text-3xl mb-6 font-light">Celebrando nosso amor</p>
          <p className="text-xl md:text-2xl font-mono">04 de Dezembro de 2025 • 13h00</p>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Cronômetro Regressivo */}
      <div className="container mx-auto px-4 -mt-32 relative z-20 mb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent font-bold">
            Contagem Regressiva
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            ✨ Cada segundo nos aproxima deste momento especial ✨
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Dias', valor: tempoRestante.dias },
              { label: 'Horas', valor: tempoRestante.horas },
              { label: 'Minutos', valor: tempoRestante.minutos },
              { label: 'Segundos', valor: tempoRestante.segundos }
            ].map((item, idx) => (
              <div 
                key={item.label}
                className={`bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg hover:scale-105 transition-all duration-300 ${
                  idx === 3 ? 'animate-pulse' : ''
                }`}
              >
                <div className="font-mono text-5xl md:text-6xl font-bold mb-2">
                  {formatarNumero(item.valor)}
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={irParaPresentes}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white py-4 px-8 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mx-auto animate-pulse hover:animate-none"
            >
              <Gift className="w-6 h-6 animate-bounce" />
              Quer presentear o casal? Clique aqui
            </button>
          </div>
        </div>
      </div>

      {/* Layout de Duas Colunas */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Nosso Grande Dia */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-serif text-3xl mb-6 text-rose-600 flex items-center gap-3">
              <Heart className="w-8 h-8" />
              Nosso Grande Dia
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                <Clock className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Data e Horário</div>
                  <div className="text-gray-600">04 de Novembro de 2025</div>
                  <div className="text-gray-600">13h00 (Almoço)</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Local do Evento</div>
                  <div className="text-gray-600">Restaurante Casa Bounasera</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={adicionarGoogleCalendar}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Adicionar ao Google Calendar
              </button>

              <button
                onClick={baixarICS}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Baixar para Agenda (.ics)
              </button>
            </div>
          </div>

          {/* Coluna Direita - Lista de Presentes */}
          <div id="presentes" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-8">
            <h3 className="font-serif text-3xl mb-6 text-purple-600 flex items-center gap-3">
              <Gift className="w-8 h-8" />
              Lista de Presentes
            </h3>

            <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-xl p-6 mb-6">
              <p className="text-center text-lg text-gray-700 mb-4 font-medium">
                Sua presença é nosso maior presente!
              </p>
              <p className="text-center text-gray-600 mb-6">
                Se desejar nos presentear, aceitamos contribuições via PIX:
              </p>

              <div className="bg-white rounded-xl p-6 shadow-inner mb-4">
                <div className="text-center mb-2 text-sm text-gray-500 uppercase tracking-wide">
                  Chave PIX (CPF)
                </div>
                <div className="text-center font-mono text-2xl font-bold text-gray-800 mb-4">
                  {chavePix}
                </div>

                <button
                  onClick={copiarPix}
                  className={`w-full py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    pixCopiado
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                  }`}
                >
                  {pixCopiado ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar Chave PIX
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem Final */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose-500" />
          <p className="font-serif text-2xl text-gray-700">
            Com amor, <span className="text-rose-600 font-bold">Fred e Domi</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">04 de Novembro de 2025</p>
          <p className="text-sm opacity-90">Nosso amor, nossa celebração</p>
        </div>
      </footer>
    </div>
  );
}
function App() {
  return <WeddingSite />;
}
