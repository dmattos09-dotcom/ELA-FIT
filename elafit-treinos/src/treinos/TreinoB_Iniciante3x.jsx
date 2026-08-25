import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Dumbbell, Clock, Flame } from 'lucide-react';

export default function TreinoElaFit() {
  const exercicios = [
    { id: 1, nome: 'Caminhada ou Bicicleta', series: '1', reps: '5 min', tipo: 'aquecimento' },
    { id: 2, nome: 'Ponte de Glúteo', series: '2', reps: '15', tipo: 'ativacao', obs: 'Ativação' },
    { id: 3, nome: 'Stiff com Halteres', series: '3', reps: '12', tipo: 'principal' },
    { id: 4, nome: 'Cadeira Flexora', series: '3', reps: '12', tipo: 'principal' },
    { id: 5, nome: 'Mesa Flexora', series: '3', reps: '15', tipo: 'principal' },
    { id: 6, nome: 'Elevação Pélvica na Máquina', series: '3', reps: '12', tipo: 'principal' },
    { id: 7, nome: 'Desenvolvimento Máquina', series: '3', reps: '12', tipo: 'principal' },
    { id: 8, nome: 'Remada Sentada', series: '3', reps: '12', tipo: 'principal' },
    { id: 9, nome: 'Prancha Abdominal', series: '3', reps: '30s', tipo: 'principal' },
  ];

  const [feitos, setFeitos] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('treinoB-i3x-feitos');
      if (saved) setFeitos(JSON.parse(saved));
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem('treinoB-i3x-feitos', JSON.stringify(feitos)); } catch(e) {}
  }, [feitos, loaded]);

  const toggle = (id) => {
    setFeitos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => setFeitos({});

  const totalFeitos = Object.values(feitos).filter(Boolean).length;
  const progresso = (totalFeitos / exercicios.length) * 100;
  const completo = totalFeitos === exercicios.length;

  // Paleta oficial Ela Fit
  const NAVY_DEEP = '#192542';
  const NAVY = '#2A3958';
  const NAVY_SOFT = '#4A5B7D';
  const GOLD = '#C9A876';
  const GOLD_LIGHT = '#E5D5B5';
  const CREAM = '#F7F3EC';
  const CREAM_DK = '#EDE5D3';
  const INK = '#1A1F2E';
  const SOFT = '#7B8394';
  const BORDER = '#DDD5C4';

  return (
    <div style={{
      fontFamily: "'Mulish', -apple-system, sans-serif",
      background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_DK} 100%)`,
      minHeight: '100vh',
      padding: '0',
      color: INK,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Mulish:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input[type="text"]:focus { outline: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-appear { animation: fadeIn 0.35s ease-out both; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>

        {/* HEADER */}
        <header style={{
          background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`,
          color: '#fff',
          margin: '0 -20px',
          padding: '36px 24px 44px 24px',
          position: 'relative',
        }}>
          <div style={{
            border: `1px solid ${GOLD}59`,
            padding: '28px 24px 32px 24px',
            position: 'relative',
          }}>
            <div style={{
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 700,
              fontSize: '9.5px',
              letterSpacing: '4.5px',
              color: GOLD,
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              Nível 1 · Iniciante · 3× na semana
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: '52px',
              lineHeight: '1',
              margin: '0 0 6px 0',
              letterSpacing: '-1px',
            }}>
              Treino <em style={{ color: GOLD, fontWeight: 400 }}>B</em>
            </h1>

            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '17px',
              color: GOLD_LIGHT,
              marginBottom: '20px',
              fontWeight: 400,
            }}>
              Full Body · Ênfase em Posteriores e Glúteos
            </div>

            <div style={{
              height: '1px',
              width: '32px',
              background: GOLD,
              opacity: 0.6,
              marginBottom: '20px',
            }} />

            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              fontSize: '11px',
              fontFamily: "'Mulish', sans-serif",
              color: GOLD_LIGHT,
              letterSpacing: '0.5px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} strokeWidth={1.5} />
                <span>60 min</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Dumbbell size={12} strokeWidth={1.5} />
                <span>9 exercícios</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={12} strokeWidth={1.5} />
                <span>Descanso 45–60s</span>
              </div>
            </div>
          </div>
        </header>

        {/* PROGRESSO */}
        <div style={{
          background: '#fff',
          padding: '18px 22px',
          margin: '-16px 4px 24px 4px',
          boxShadow: `0 6px 20px ${NAVY_DEEP}14`,
          borderRadius: '4px',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <span style={{
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 800,
              fontSize: '8px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: NAVY,
            }}>
              Seu treino de hoje
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '20px',
              fontWeight: 500,
              color: NAVY_DEEP,
              fontStyle: 'italic',
            }}>
              {totalFeitos}/{exercicios.length}
            </span>
          </div>

          <div style={{
            height: '4px',
            background: CREAM_DK,
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progresso}%`,
              background: `linear-gradient(90deg, ${GOLD} 0%, ${NAVY} 100%)`,
              transition: 'width 0.4s ease-out',
              borderRadius: '2px',
            }} />
          </div>
        </div>

        {/* EXERCÍCIOS */}
        <div style={{ paddingBottom: '32px' }}>
          {exercicios.map((ex, idx) => {
            const feito = feitos[ex.id];
            const isAquecimento = ex.tipo === 'aquecimento';
            const isAtivacao = ex.tipo === 'ativacao';

            return (
              <div
                key={ex.id}
                className="card-appear"
                style={{
                  background: feito ? '#F0EDE6' : '#fff',
                  border: `1px solid ${feito ? GOLD_LIGHT : CREAM_DK}`,
                  borderLeft: `4px solid ${feito ? NAVY_DEEP : (isAquecimento || isAtivacao ? GOLD : NAVY)}`,
                  borderRadius: '3px',
                  padding: '18px 20px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'all 0.25s ease',
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <button
                  onClick={() => toggle(ex.id)}
                  style={{
                    minWidth: '28px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `1.5px solid ${feito ? NAVY_DEEP : NAVY}`,
                    background: feito ? NAVY_DEEP : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={`Marcar ${ex.nome} como concluído`}
                >
                  {feito && <Check size={15} color="#fff" strokeWidth={2.5} />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {(isAquecimento || isAtivacao || ex.obs) && (
                    <div style={{
                      fontFamily: "'Mulish', sans-serif",
                      fontWeight: 700,
                      fontSize: '7.5px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: SOFT,
                      marginBottom: '4px',
                    }}>
                      {isAquecimento ? 'Aquecimento' : (isAtivacao ? 'Ativação' : ex.obs)}
                    </div>
                  )}

                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '22px',
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: INK,
                    marginBottom: '8px',
                    textDecoration: feito ? 'line-through' : 'none',
                    textDecorationColor: NAVY,
                    textDecorationThickness: '1px',
                    opacity: feito ? 0.55 : 1,
                    transition: 'all 0.25s ease',
                  }}>
                    {ex.nome}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    opacity: feito ? 0.55 : 1,
                    transition: 'opacity 0.25s ease',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'Mulish', sans-serif",
                        fontWeight: 700,
                        fontSize: '7px',
                        letterSpacing: '1.5px',
                        color: SOFT,
                        textTransform: 'uppercase',
                      }}>
                        Séries
                      </div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '20px',
                        fontWeight: 500,
                        color: NAVY_DEEP,
                        lineHeight: 1,
                        marginTop: '2px',
                      }}>
                        {ex.series}
                      </div>
                    </div>

                    <div style={{ width: '1px', background: GOLD_LIGHT }} />

                    <div>
                      <div style={{
                        fontFamily: "'Mulish', sans-serif",
                        fontWeight: 700,
                        fontSize: '7px',
                        letterSpacing: '1.5px',
                        color: SOFT,
                        textTransform: 'uppercase',
                      }}>
                        Repetições
                      </div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '20px',
                        fontWeight: 500,
                        color: NAVY_DEEP,
                        lineHeight: 1,
                        marginTop: '2px',
                      }}>
                        {ex.reps}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONCLUÍDO */}
        {completo && (
          <div className="card-appear" style={{
            background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`,
            color: '#fff',
            padding: '32px 28px',
            textAlign: 'center',
            marginBottom: '24px',
            borderRadius: '3px',
          }}>
            <div style={{
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '3.5px',
              color: GOLD,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Treino Concluído
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '30px',
              fontWeight: 500,
              lineHeight: 1.15,
              fontStyle: 'italic',
            }}>
              Posteriores fortes, <span style={{ color: GOLD }}>corpo estável</span>.
            </div>
            <div style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: '11px',
              color: GOLD_LIGHT,
              marginTop: '14px',
              opacity: 0.85,
              lineHeight: 1.6,
            }}>
              Cada treino cumprido é uma escolha que sustenta seu próximo passo.
            </div>
          </div>
        )}

        {/* REGRAS */}
        <div style={{
          background: '#fff',
          border: `1px solid ${CREAM_DK}`,
          padding: '22px 24px',
          marginBottom: '24px',
          borderRadius: '3px',
        }}>
          <div style={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 800,
            fontSize: '8px',
            letterSpacing: '2.5px',
            color: NAVY,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Regras do Método Ela Fit
          </div>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontFamily: "'Mulish', sans-serif",
            fontSize: '11.5px',
            color: '#4A5568',
            lineHeight: 1.7,
          }}>
            {[
              'A técnica sempre vem antes da carga.',
              'Registre os pesos utilizados para acompanhar sua evolução.',
              'Respeite os intervalos de descanso.',
              'Assista ao vídeo demonstrativo antes de iniciar um exercício novo.',
              'Mantenha boa hidratação durante o treino.',
            ].map((r, i) => (
              <li key={i} style={{
                paddingLeft: '14px',
                position: 'relative',
                marginBottom: '5px',
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: GOLD,
                  fontWeight: 700,
                }}>·</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* RESET */}
        <div style={{
          textAlign: 'center',
          paddingBottom: '32px',
        }}>
          <button
            onClick={reset}
            style={{
              background: 'transparent',
              border: `1px solid ${CREAM_DK}`,
              color: SOFT,
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 700,
              fontSize: '8.5px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '2px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = NAVY;
              e.currentTarget.style.color = NAVY_DEEP;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = CREAM_DK;
              e.currentTarget.style.color = SOFT;
            }}
          >
            <RotateCcw size={11} strokeWidth={2} />
            Reiniciar treino
          </button>
        </div>

        {/* FOOTER MARK */}
        <div style={{
          textAlign: 'center',
          paddingBottom: '32px',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '18px',
          color: NAVY_DEEP,
          fontWeight: 500,
        }}>
          Ela <span style={{ color: GOLD }}>Fit</span>
        </div>
      </div>
    </div>
  );
}
