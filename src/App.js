import React, { useState, useEffect } from 'react';
import { Calendar, Gift, MapPin, Clock, Heart, Copy, Check } from 'lucide-react';

export default function WeddingSite() {
  const [tempoRestante1, setTempoRestante1] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });
  const [tempoRestante2, setTempoRestante2] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });
  const [pixCopiado, setPixCopiado] = useState(false);
  const [mostrarStats, setMostrarStats] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    cliquesPixCopiar: 0,
    cliquesPresentear: 0
  });

  const dataEvento1 = new Date('2025-12-04T13:00:00'); // Restaurante
  const dataEvento2 = new Date('2025-12-06T13:00:00'); // Residência
  const chavePix = '106.733.327-48';

  // Verificar se deve mostrar estatísticas
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stats') === 'true') {
      setMostrarStats(true);
    }

    // Carregar estatísticas do localStorage
    const stats = localStorage.getItem('wedding_stats');
    if (stats) {
      setEstatisticas(JSON.parse(stats));
    }
  }, []);

  // Salvar estatísticas no localStorage
  const salvarEstatisticas = (novasStats) => {
    localStorage.setItem('wedding_stats', JSON.stringify(novasStats));
    setEstatisticas(novasStats);
  };

  // Cronômetro 1 - Restaurante
  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const diferenca = dataEvento1 - agora;

      if (diferenca > 0) {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        setTempoRestante1({ dias, horas, minutos, segundos });
      } else {
        setTempoRestante1({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calcularTempo();
    const intervalo = setInterval(calcularTempo, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Cronômetro 2 - Residência
  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const diferenca = dataEvento2 - agora;

      if (diferenca > 0) {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        setTempoRestante2({ dias, horas, minutos, segundos });
      } else {
        setTempoRestante2({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calcularTempo();
    const intervalo = setInterval(calcularTempo, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Adicionar ao Google Calendar
  const adicionarGoogleCalendar = (evento) => {
    const configs = evento === 1 ? {
      titulo: 'Casamento Fred e Domi - Restaurante',
      detalhes: 'Almoço de celebração no Restaurante Casa Bounasera',
      local: 'Restaurante Casa Bounasera',
      dataInicio: '20251204T130000',
      dataFim: '20251204T160000'
    } : {
      titulo: 'Casamento Fred e Domi - Nossa Casa',
      detalhes: 'Celebração na residência do casal',
      local: 'Travessa Alaíde, 3 - Jacutinga, Mesquita - RJ',
      dataInicio: '20251206T130000',
      dataFim: '20251206T180000'
    };

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(configs.titulo)}&details=${encodeURIComponent(configs.detalhes)}&location=${encodeURIComponent(configs.local)}&dates=${configs.dataInicio}/${configs.dataFim}`;
    window.open(url, '_blank');
  };

  // Baixar arquivo .ics
  const baixarICS = (evento) => {
    const configs = evento === 1 ? {
      data: '20251204T130000',
      dataFim: '20251204T160000',
      titulo: 'Casamento Fred e Domi - Restaurante',
      descricao: 'Almoço de celebração no Restaurante Casa Bounasera',
      local: 'Restaurante Casa Bounasera',
      arquivo: 'casamento-restaurante.ics'
    } : {
      data: '20251206T130000',
      dataFim: '20251206T180000',
      titulo: 'Casamento Fred e Domi - Nossa Casa',
      descricao: 'Celebração na residência do casal',
      local: 'Travessa Alaíde, 3 - Jacutinga, Mesquita - RJ',
      arquivo: 'casamento-residencia.ics'
    };

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Fred e Domi Wedding//PT-BR
BEGIN:VEVENT
UID:${Date.now()}@wedding
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${configs.data}
DTEND:${configs.dataFim}
SUMMARY:${configs.titulo}
DESCRIPTION:${configs.descricao}
LOCATION:${configs.local}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = configs.arquivo;
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
      
      // Incrementar contador
      const novasStats = {
        ...estatisticas,
        cliquesPixCopiar: estatisticas.cliquesPixCopiar + 1
      };
      salvarEstatisticas(novasStats);
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
    
    // Incrementar contador
    const novasStats = {
      ...estatisticas,
      cliquesPresentear: estatisticas.cliquesPresentear + 1
    };
    salvarEstatisticas(novasStats);
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
          <p className="text-xl md:text-2xl font-mono mb-2">04 de Dezembro de 2025 • 13h00</p>
          <p className="text-lg md:text-xl opacity-90">Restaurante Casa Bounasera</p>
          <div className="my-4 opacity-75">✨</div>
          <p className="text-xl md:text-2xl font-mono mb-2">06 de Dezembro de 2025 • 13h00</p>
          <p className="text-lg md:text-xl opacity-90">Nossa Residência</p>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Cronômetros Regressivos */}
      <div className="container mx-auto px-4 -mt-32 relative z-20 mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cronômetro 1 - Restaurante */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-purple-100 px-4 py-2 rounded-full mb-3">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-rose-600">Restaurante</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent font-bold">
                04 de Dezembro
              </h3>
              <p className="text-gray-600 text-sm md:text-base">Casa Bounasera • 13h00</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Dias', valor: tempoRestante1.dias },
                { label: 'Horas', valor: tempoRestante1.horas },
                { label: 'Minutos', valor: tempoRestante1.minutos },
                { label: 'Segundos', valor: tempoRestante1.segundos }
              ].map((item, idx) => (
                <div 
                  key={item.label}
                  className={`bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl p-4 text-white text-center shadow-lg hover:scale-105 transition-all duration-300 ${
                    idx === 3 ? 'animate-pulse' : ''
                  }`}
                >
                  <div className="font-mono text-3xl md:text-4xl font-bold mb-1">
                    {formatarNumero(item.valor)}
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-90">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={irParaPresentes}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Quero presentear o casal! Clique aqui
            </button>
          </div>

          {/* Cronômetro 2 - Residência */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-600">Nossa Casa</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                06 de Dezembro
              </h3>
              <p className="text-gray-600 text-sm md:text-base">Nossa Residência • 13h00</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Dias', valor: tempoRestante2.dias },
                { label: 'Horas', valor: tempoRestante2.horas },
                { label: 'Minutos', valor: tempoRestante2.minutos },
                { label: 'Segundos', valor: tempoRestante2.segundos }
              ].map((item, idx) => (
                <div 
                  key={item.label}
                  className={`bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white text-center shadow-lg hover:scale-105 transition-all duration-300 ${
                    idx === 3 ? 'animate-pulse' : ''
                  }`}
                >
                  <div className="font-mono text-3xl md:text-4xl font-bold mb-1">
                    {formatarNumero(item.valor)}
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-90">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={irParaPresentes}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white py-3 px-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Quero presentear o casal! Clique aqui
            </button>
          </div>
        </div>
      </div>

      {/* Layout de Duas Colunas */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Nossos Grandes Dias */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-serif text-3xl mb-6 text-rose-600 flex items-center gap-3">
              <Heart className="w-8 h-8" />
              Nossos Grandes Dias
            </h3>
            
            {/* Evento 1 - Restaurante */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h4 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Restaurante Casa Bounasera
              </h4>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                  <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Data e Horário</div>
                    <div className="text-gray-600 text-sm">04 de Dezembro de 2025 • 13h00</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Local</div>
                    <div className="text-gray-600 text-sm">Restaurante Casa Bounasera</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => adicionarGoogleCalendar(1)}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Google Calendar
                </button>

                <button
                  onClick={() => baixarICS(1)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Baixar .ics
                </button>
              </div>
            </div>

            {/* Evento 2 - Residência */}
            <div>
              <h4 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Nossa Residência
              </h4>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                  <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Data e Horário</div>
                    <div className="text-gray-600 text-sm">06 de Dezembro de 2025 • 13h00</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Local</div>
                    <div className="text-gray-600 text-sm">Travessa Alaíde, 3<br/>Jacutinga, Mesquita - RJ</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => adicionarGoogleCalendar(2)}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Google Calendar
                </button>

                <button
                  onClick={() => baixarICS(2)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Baixar .ics
                </button>
              </div>
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

      {/* Painel de Estatísticas (Oculto - apenas com ?stats=true) */}
      {mostrarStats && (
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                📊 Painel Administrativo
              </h3>
              <button
                onClick={() => {
                  if (window.confirm('Deseja zerar todas as estatísticas?')) {
                    salvarEstatisticas({ cliquesPixCopiar: 0, cliquesPresentear: 0 });
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300"
              >
                Zerar Contadores
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Copy className="w-6 h-6" />
                  <span className="font-semibold text-lg">Copiar PIX</span>
                </div>
                <div className="font-mono text-5xl font-bold mb-2">
                  {estatisticas.cliquesPixCopiar}
                </div>
                <div className="text-sm opacity-90">cliques no botão "Copiar Chave PIX"</div>
              </div>

              <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="w-6 h-6" />
                  <span className="font-semibold text-lg">Presentear o Casal</span>
                </div>
                <div className="font-mono text-5xl font-bold mb-2">
                  {estatisticas.cliquesPresentear}
                </div>
                <div className="text-sm opacity-90">cliques nos botões "Quer presentear?"</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm text-center">
                💡 <strong>Dica:</strong> Para acessar este painel, adicione <code className="bg-gray-600 px-2 py-1 rounded">?stats=true</code> no final da URL
              </p>
              <p className="text-gray-400 text-xs text-center mt-2">
                Exemplo: <code className="bg-gray-600 px-2 py-0.5 rounded">seusite.vercel.app?stats=true</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-1">04 e 06 de Dezembro de 2025</p>
          <p className="text-sm opacity-90 mb-1">Restaurante Casa Bounasera • Nossa Residência</p>
          <p className="text-sm opacity-90">Nosso amor, nossa celebração</p>
        </div>
      </footer>
    </div>
  );
}
