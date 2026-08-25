import { Routes, Route, Link } from 'react-router-dom'

// Iniciante 3x
import TreinoA_Iniciante3x from './treinos/TreinoA_Iniciante3x.jsx'
import TreinoB_Iniciante3x from './treinos/TreinoB_Iniciante3x.jsx'
import TreinoC_Iniciante3x from './treinos/TreinoC_Iniciante3x.jsx'
// Iniciante 5x
import TreinoA_Iniciante5x from './treinos/TreinoA_Iniciante5x.jsx'
import TreinoB_Iniciante5x from './treinos/TreinoB_Iniciante5x.jsx'
import TreinoC_Iniciante5x from './treinos/TreinoC_Iniciante5x.jsx'
import TreinoD_Iniciante5x from './treinos/TreinoD_Iniciante5x.jsx'
import TreinoE_Iniciante5x from './treinos/TreinoE_Iniciante5x.jsx'
// Intermediário 3x
import TreinoA_Intermediario3x from './treinos/TreinoA_Intermediario3x.jsx'
import TreinoB_Intermediario3x from './treinos/TreinoB_Intermediario3x.jsx'
import TreinoC_Intermediario3x from './treinos/TreinoC_Intermediario3x.jsx'
// Intermediário 5x
import TreinoA_Intermediario5x from './treinos/TreinoA_Intermediario5x.jsx'
import TreinoB_Intermediario5x from './treinos/TreinoB_Intermediario5x.jsx'
import TreinoC_Intermediario5x from './treinos/TreinoC_Intermediario5x.jsx'
import TreinoD_Intermediario5x from './treinos/TreinoD_Intermediario5x.jsx'
import TreinoE_Intermediario5x from './treinos/TreinoE_Intermediario5x.jsx'
// Avançado 3x
import TreinoA_Avancado3x from './treinos/TreinoA_Avancado3x.jsx'
import TreinoB_Avancado3x from './treinos/TreinoB_Avancado3x.jsx'
import TreinoC_Avancado3x from './treinos/TreinoC_Avancado3x.jsx'
// Avançado 5x
import TreinoA_Avancado5x from './treinos/TreinoA_Avancado5x.jsx'
import TreinoB_Avancado5x from './treinos/TreinoB_Avancado5x.jsx'
import TreinoC_Avancado5x from './treinos/TreinoC_Avancado5x.jsx'
import TreinoD_Avancado5x from './treinos/TreinoD_Avancado5x.jsx'
import TreinoE_Avancado5x from './treinos/TreinoE_Avancado5x.jsx'

// Página inicial — índice de todos os treinos
function Home() {
  const NAVY_DEEP = '#192542'
  const NAVY = '#2A3958'
  const GOLD = '#C9A876'
  const GOLD_LIGHT = '#E5D5B5'
  const CREAM = '#F7F3EC'
  const CREAM_DK = '#EDE5D3'
  const INK = '#1A1F2E'
  const SOFT = '#7B8394'

  const grupos = [
    {
      nivel: 'Nível 1 · Iniciante',
      subgrupos: [
        { freq: '3× na semana', treinos: [
          { rota: 'iniciante-3x-a', letra: 'A', nome: 'Full Body · Quadríceps/Glúteos' },
          { rota: 'iniciante-3x-b', letra: 'B', nome: 'Full Body · Posteriores/Glúteos' },
          { rota: 'iniciante-3x-c', letra: 'C', nome: 'Full Body · Glúteos' },
        ]},
        { freq: '5× na semana', treinos: [
          { rota: 'iniciante-5x-a', letra: 'A', nome: 'Quadríceps + Glúteos' },
          { rota: 'iniciante-5x-b', letra: 'B', nome: 'Costas + Bíceps + Abdômen' },
          { rota: 'iniciante-5x-c', letra: 'C', nome: 'Posteriores + Glúteos' },
          { rota: 'iniciante-5x-d', letra: 'D', nome: 'Peito + Ombros + Tríceps' },
          { rota: 'iniciante-5x-e', letra: 'E', nome: 'Glúteos · Ênfase' },
        ]},
      ]
    },
    {
      nivel: 'Nível 2 · Intermediário',
      subgrupos: [
        { freq: '3× na semana', treinos: [
          { rota: 'intermediario-3x-a', letra: 'A', nome: 'Inferiores · Glúteos/Quadríceps' },
          { rota: 'intermediario-3x-b', letra: 'B', nome: 'Superiores' },
          { rota: 'intermediario-3x-c', letra: 'C', nome: 'Inferiores · Posteriores/Glúteos' },
        ]},
        { freq: '5× na semana', treinos: [
          { rota: 'intermediario-5x-a', letra: 'A', nome: 'Quadríceps + Glúteos' },
          { rota: 'intermediario-5x-b', letra: 'B', nome: 'Costas + Bíceps + Abdômen' },
          { rota: 'intermediario-5x-c', letra: 'C', nome: 'Posteriores + Glúteos' },
          { rota: 'intermediario-5x-d', letra: 'D', nome: 'Peito + Ombros + Tríceps' },
          { rota: 'intermediario-5x-e', letra: 'E', nome: 'Glúteos · Ênfase' },
        ]},
      ]
    },
    {
      nivel: 'Nível 3 · Avançado',
      subgrupos: [
        { freq: '3× na semana', treinos: [
          { rota: 'avancado-3x-a', letra: 'A', nome: 'Quadríceps + Glúteos + Ombros' },
          { rota: 'avancado-3x-b', letra: 'B', nome: 'Posteriores + Costas' },
          { rota: 'avancado-3x-c', letra: 'C', nome: 'Glúteos Premium + Superior' },
        ]},
        { freq: '5× na semana', treinos: [
          { rota: 'avancado-5x-a', letra: 'A', nome: 'Quadríceps + Glúteos' },
          { rota: 'avancado-5x-b', letra: 'B', nome: 'Costas + Ombros + Abdômen' },
          { rota: 'avancado-5x-c', letra: 'C', nome: 'Posteriores + Glúteos' },
          { rota: 'avancado-5x-d', letra: 'D', nome: 'Peito + Ombros + Tríceps' },
          { rota: 'avancado-5x-e', letra: 'E', nome: 'Glúteos · Ênfase máxima' },
        ]},
      ]
    },
  ]

  return (
    <div style={{
      fontFamily: "'Mulish', -apple-system, sans-serif",
      background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_DK} 100%)`,
      minHeight: '100vh',
      color: INK,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Mulish:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>

        <header style={{
          background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`,
          color: '#fff', margin: '0 -20px', padding: '48px 24px 56px 24px',
        }}>
          <div style={{ border: `1px solid ${GOLD}59`, padding: '32px 24px' }}>
            <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9.5px', letterSpacing: '4.5px', color: GOLD, textTransform: 'uppercase', marginBottom: '14px' }}>
              Método Ela Fit
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '48px', lineHeight: '1', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
              Ela <em style={{ color: GOLD, fontWeight: 400 }}>Fit</em>
            </h1>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '17px', color: GOLD_LIGHT, marginBottom: '4px', fontWeight: 400 }}>
              Índice completo dos treinos
            </div>
          </div>
        </header>

        <div style={{ padding: '32px 4px 48px 4px' }}>
          {grupos.map((grupo, gi) => (
            <div key={gi} style={{ marginBottom: '40px' }}>
              <div style={{
                fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9.5px',
                letterSpacing: '3.5px', color: NAVY_DEEP, textTransform: 'uppercase',
                marginBottom: '20px', paddingBottom: '8px', borderBottom: `1px solid ${GOLD_LIGHT}`,
              }}>
                {grupo.nivel}
              </div>

              {grupo.subgrupos.map((sub, si) => (
                <div key={si} style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    fontSize: '16px', color: SOFT, marginBottom: '10px', fontWeight: 500,
                  }}>
                    {sub.freq}
                  </div>
                  {sub.treinos.map((t) => (
                    <Link key={t.rota} to={`/${t.rota}`} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      background: '#fff', border: `1px solid ${CREAM_DK}`,
                      borderLeft: `4px solid ${NAVY}`, borderRadius: '3px',
                      padding: '14px 18px', marginBottom: '8px',
                      color: INK, transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = GOLD; e.currentTarget.style.background = CREAM }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = NAVY; e.currentTarget.style.background = '#fff' }}
                    >
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                        fontSize: '28px', fontWeight: 500, color: GOLD, minWidth: '24px',
                      }}>{t.letra}</div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '18px',
                        fontWeight: 500, color: NAVY_DEEP, flex: 1,
                      }}>{t.nome}</div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center', paddingBottom: '32px',
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: '18px', color: NAVY_DEEP, fontWeight: 500,
        }}>
          Ela <span style={{ color: GOLD }}>Fit</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Iniciante 3x */}
      <Route path="/iniciante-3x-a" element={<TreinoA_Iniciante3x />} />
      <Route path="/iniciante-3x-b" element={<TreinoB_Iniciante3x />} />
      <Route path="/iniciante-3x-c" element={<TreinoC_Iniciante3x />} />

      {/* Iniciante 5x */}
      <Route path="/iniciante-5x-a" element={<TreinoA_Iniciante5x />} />
      <Route path="/iniciante-5x-b" element={<TreinoB_Iniciante5x />} />
      <Route path="/iniciante-5x-c" element={<TreinoC_Iniciante5x />} />
      <Route path="/iniciante-5x-d" element={<TreinoD_Iniciante5x />} />
      <Route path="/iniciante-5x-e" element={<TreinoE_Iniciante5x />} />

      {/* Intermediário 3x */}
      <Route path="/intermediario-3x-a" element={<TreinoA_Intermediario3x />} />
      <Route path="/intermediario-3x-b" element={<TreinoB_Intermediario3x />} />
      <Route path="/intermediario-3x-c" element={<TreinoC_Intermediario3x />} />

      {/* Intermediário 5x */}
      <Route path="/intermediario-5x-a" element={<TreinoA_Intermediario5x />} />
      <Route path="/intermediario-5x-b" element={<TreinoB_Intermediario5x />} />
      <Route path="/intermediario-5x-c" element={<TreinoC_Intermediario5x />} />
      <Route path="/intermediario-5x-d" element={<TreinoD_Intermediario5x />} />
      <Route path="/intermediario-5x-e" element={<TreinoE_Intermediario5x />} />

      {/* Avançado 3x */}
      <Route path="/avancado-3x-a" element={<TreinoA_Avancado3x />} />
      <Route path="/avancado-3x-b" element={<TreinoB_Avancado3x />} />
      <Route path="/avancado-3x-c" element={<TreinoC_Avancado3x />} />

      {/* Avançado 5x */}
      <Route path="/avancado-5x-a" element={<TreinoA_Avancado5x />} />
      <Route path="/avancado-5x-b" element={<TreinoB_Avancado5x />} />
      <Route path="/avancado-5x-c" element={<TreinoC_Avancado5x />} />
      <Route path="/avancado-5x-d" element={<TreinoD_Avancado5x />} />
      <Route path="/avancado-5x-e" element={<TreinoE_Avancado5x />} />
    </Routes>
  )
}
