import React, { useState, useEffect, useMemo } from 'react';
import { Home, Ruler, Target, Calendar, FileText, Trophy, Check, X, Camera, Lock, Download } from 'lucide-react';

/* ===== Paleta Ela Fit ===== */
const NAVY_DEEP = '#192542';
const NAVY = '#2A3958';
const GOLD = '#C9A876';
const GOLD_LIGHT = '#E5D5B5';
const CREAM = '#F7F3EC';
const CREAM_DK = '#EDE5D3';
const INK = '#1A1F2E';
const SOFT = '#7B8394';

const KEY = 'elafit-diario-move50';
const TOTAL_DIAS = 50;
const CHALLENGE_END = new Date(2026, 11, 31); // 31/12/2026

const SEMANAS = [
  { nome: 'Começar', ini: 1, fim: 7 },
  { nome: 'Ritmo', ini: 8, fim: 14 },
  { nome: 'Força', ini: 15, fim: 21 },
  { nome: 'Movimento', ini: 22, fim: 28 },
  { nome: 'Alimentação', ini: 29, fim: 35 },
  { nome: 'Autoestima', ini: 36, fim: 42 },
  { nome: 'Reta final', ini: 43, fim: 50 },
];

const CAMPOS = [
  { key: 'peso', label: 'Peso', unit: 'kg' },
  { key: 'altura', label: 'Altura', unit: 'cm' },
  { key: 'cintura', label: 'Cintura', unit: 'cm' },
  { key: 'quadril', label: 'Quadril', unit: 'cm' },
  { key: 'coxa', label: 'Coxa', unit: 'cm' },
  { key: 'braco', label: 'Braço', unit: 'cm' },
];

const ABAS = [
  { id: 'inicio', nome: 'Início', Icon: Home },
  { id: 'medidas', nome: 'Medidas', Icon: Ruler },
  { id: 'metas', nome: 'Metas', Icon: Target },
  { id: 'calendario', nome: 'Calendário', Icon: Calendar },
  { id: 'anotacoes', nome: 'Anotações', Icon: FileText },
  { id: 'evolucao', nome: 'Evolução', Icon: Trophy },
];

/* ===== Helpers de data ===== */
function todayDate() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function parseISO(s) { if (!s) return null; const p = String(s).split('-').map(Number); if (p.length !== 3) return null; return new Date(p[0], p[1] - 1, p[2]); }
function toISO(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function fmtBR(iso) { const d = parseISO(iso); return d ? d.toLocaleDateString('pt-BR') : ''; }

const EMPTY = {
  nome: '',
  dataInicio: toISO(todayDate()),
  medidasIniciais: {},
  medidasFinais: {},
  metas: {},
  dias: {},
};

/* ===== Redimensiona foto antes de salvar (evita estourar localStorage) ===== */
function processImage(file, onOk, onErr) {
  if (!file) return;
  if (!/^image\//.test(file.type)) { onErr && onErr(); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      try {
        const max = 720;
        let { width: w, height: h } = img;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        onOk(cv.toDataURL('image/jpeg', 0.72));
      } catch (err) { onErr && onErr(); }
    };
    img.onerror = () => onErr && onErr();
    img.src = e.target.result;
  };
  reader.onerror = () => onErr && onErr();
  reader.readAsDataURL(file);
}

/* ===== Pequenos blocos de estilo reutilizáveis ===== */
function Kicker({ children, style }) {
  return <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase', color: NAVY, ...style }}>{children}</div>;
}
function CardBox({ children, style }) {
  return <div style={{ background: '#fff', border: `1px solid ${CREAM_DK}`, borderLeft: `4px solid ${GOLD}`, borderRadius: '3px', padding: '22px 24px', marginBottom: '16px', ...style }}>{children}</div>;
}
function Btn({ children, onClick, variant = 'solid', style }) {
  const base = { fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '9.5px', letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 22px', borderRadius: '2px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease', border: '1px solid transparent' };
  const variants = {
    solid: { background: NAVY_DEEP, color: CREAM, borderColor: NAVY_DEEP },
    ghost: { background: 'transparent', color: SOFT, borderColor: CREAM_DK },
    gold: { background: GOLD, color: NAVY_DEEP, borderColor: GOLD },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

export default function Diario() {
  const [data, setData] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [aba, setAba] = useState('inicio');
  const [diaModal, setDiaModal] = useState(null);
  const [fotoErro, setFotoErro] = useState(null); // 'iniciais' | 'finais' | null

  /* carregar */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const parsed = JSON.parse(raw); setData({ ...EMPTY, ...parsed }); }
    } catch (e) {}
    setLoaded(true);
  }, []);

  /* salvar imediatamente */
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }, [data, loaded]);

  /* salva um "próximo estado" só se couber no localStorage (usado p/ fotos) */
  const tryPersist = (next) => { try { localStorage.setItem(KEY, JSON.stringify(next)); return true; } catch (e) { return false; } };

  /* ===== cálculo dos dias ===== */
  const hoje = todayDate();
  const inicio = parseISO(data.dataInicio) || todayDate();
  const encerrado = hoje > CHALLENGE_END;
  const diaRaw = Math.floor((hoje - inicio) / 86400000) + 1; // 1 no dia de início
  const comecou = diaRaw >= 1;
  const diaDisplay = Math.min(Math.max(diaRaw, 1), TOTAL_DIAS);
  const faltamInicio = Math.max(0, -(diaRaw - 1)); // dias até começar
  const progresso = Math.min(Math.max(diaRaw, 0), TOTAL_DIAS) / TOTAL_DIAS * 100;

  const metasReadOnly = diaRaw > 3; // após o 3º dia, sela
  const evolucaoAberta = diaRaw >= 45;
  const faltamEvolucao = Math.max(0, 45 - diaRaw);

  /* ===== stats calendário ===== */
  const treinosFeitos = useMemo(() => Object.values(data.dias || {}).filter(d => d && d.treino).length, [data.dias]);
  const miniSemanas = useMemo(() => {
    let c = 0;
    SEMANAS.forEach(s => {
      let ok = false;
      for (let n = s.ini; n <= s.fim; n++) { if (data.dias && data.dias[n] && data.dias[n].mini) { ok = true; break; } }
      if (ok) c++;
    });
    return c;
  }, [data.dias]);

  /* ===== setters ===== */
  const setCampo = (campo, valor) => setData(prev => ({ ...prev, [campo]: valor }));
  const setMedida = (sec, key, valor) => setData(prev => ({ ...prev, [sec]: { ...prev[sec], [key]: valor } }));
  const setMeta = (key, valor) => setData(prev => ({ ...prev, metas: { ...prev.metas, [key]: valor } }));

  const salvarMedidas = (sec) => setData(prev => ({ ...prev, [sec]: { ...prev[sec], savedAt: toISO(todayDate()) } }));

  const selarMetas = () => {
    if (!window.confirm('Depois de salvar, você poderá editar nos primeiros 3 dias do desafio. Depois disso, só poderá ler. Deseja selar suas metas?')) return;
    setData(prev => ({ ...prev, metas: { ...prev.metas, seladoAt: prev.metas.seladoAt || toISO(todayDate()) } }));
  };

  const uploadFoto = (sec, file) => {
    setFotoErro(null);
    processImage(file, (b64) => {
      setData(prev => {
        const next = { ...prev, [sec]: { ...prev[sec], foto: b64 } };
        if (tryPersist(next)) return next;
        setFotoErro(sec);
        return prev;
      });
    }, () => setFotoErro(sec));
  };

  const salvarDia = (n, dia) => {
    setData(prev => ({ ...prev, dias: { ...prev.dias, [n]: { ...dia, savedAt: toISO(todayDate()) } } }));
    setDiaModal(null);
  };

  if (!loaded) return <div style={{ minHeight: '100vh', background: CREAM }} />;

  /* ===== estilos de container ===== */
  const page = { fontFamily: "'Mulish', -apple-system, sans-serif", background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM_DK} 100%)`, minHeight: '100vh', color: INK };
  const wrap = { maxWidth: '720px', margin: '0 auto', padding: '0 20px' };

  /* ===== anotações ordenadas ===== */
  const anotacoes = Object.entries(data.dias || {})
    .filter(([, d]) => d && d.sentimento && d.sentimento.trim())
    .map(([n, d]) => ({ n: Number(n), ...d }))
    .sort((a, b) => b.n - a.n);

  return (
    <div className="diario-app" style={page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Mulish:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .diario-appear { animation: fadeIn 0.35s ease-out both; }
        .diario-input { width:100%; font-family:'Mulish',sans-serif; font-size:16px; color:${INK}; background:transparent; border:none; border-bottom:1.5px solid ${CREAM_DK}; padding:9px 2px; outline:none; transition:border-color .2s; }
        .diario-input:focus { border-bottom-color:${GOLD}; }
        .diario-input:disabled { color:${NAVY_DEEP}; -webkit-text-fill-color:${NAVY_DEEP}; opacity:1; }
        .diario-ta { width:100%; font-family:'Mulish',sans-serif; font-size:15px; color:${INK}; background:#fff; border:1px solid ${CREAM_DK}; border-radius:4px; padding:12px 14px; outline:none; resize:vertical; min-height:90px; line-height:1.55; transition:border-color .2s; }
        .diario-ta:focus { border-color:${GOLD}; }
        .diario-ta:disabled { background:${CREAM}; color:${NAVY_DEEP}; -webkit-text-fill-color:${NAVY_DEEP}; opacity:1; }
        .diario-tabs::-webkit-scrollbar { display:none; }
        .diario-print { display:none; }
        @media print {
          .diario-app { display:none !important; }
          .diario-print { display:block !important; }
        }
      `}</style>

      <div style={wrap}>
        {/* HEADER */}
        <header style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`, color: '#fff', margin: '0 -20px', padding: '40px 24px 30px 24px' }}>
          <div style={{ border: `1px solid ${GOLD}59`, padding: '28px 24px' }}>
            <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9.5px', letterSpacing: '4.5px', color: GOLD, textTransform: 'uppercase', marginBottom: '14px' }}>
              Método Ela Fit · MOVE 50
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '48px', lineHeight: '1', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
              Meu <em style={{ color: GOLD, fontWeight: 400 }}>Diário</em>
            </h1>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '17px', color: GOLD_LIGHT, fontWeight: 400 }}>
              50 dias de movimento e constância
            </div>
          </div>
        </header>

        {/* TABS STICKY */}
        <div className="diario-tabs" style={{ position: 'sticky', top: 0, zIndex: 20, background: CREAM, margin: '0 -20px', padding: '0 20px', borderBottom: `1px solid ${CREAM_DK}`, display: 'flex', gap: '2px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {ABAS.map(({ id, nome, Icon }) => {
            const ativa = aba === id;
            return (
              <button key={id} onClick={() => setAba(id)} style={{
                flex: '0 0 auto', background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '14px 12px 11px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                borderBottom: `3px solid ${ativa ? GOLD : 'transparent'}`, color: ativa ? NAVY_DEEP : SOFT, transition: 'all 0.2s ease',
              }}>
                <Icon size={17} strokeWidth={1.6} />
                <span style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.8px', textTransform: 'uppercase' }}>{nome}</span>
              </button>
            );
          })}
        </div>

        <div style={{ padding: '26px 4px 20px 4px' }}>

          {/* ======================= SEÇÃO 1 · INÍCIO ======================= */}
          {aba === 'inicio' && (
            <div className="diario-appear">
              <CardBox>
                <Kicker>Seu nome</Kicker>
                <input className="diario-input" style={{ marginTop: '12px' }} placeholder="Seu primeiro nome" value={data.nome}
                  onChange={(e) => setCampo('nome', e.target.value.replace(/\s+/g, ' ').trimStart())} maxLength={40} />
                {data.nome.trim() && (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '24px', color: NAVY_DEEP, marginTop: '14px' }}>
                    Olá, <span style={{ color: GOLD }}>{data.nome.trim()}</span>.
                  </div>
                )}
              </CardBox>

              <CardBox>
                <Kicker>Data de início</Kicker>
                <input className="diario-input" type="date" style={{ marginTop: '12px', maxWidth: '220px' }} value={data.dataInicio}
                  max="2026-12-31" onChange={(e) => setCampo('dataInicio', e.target.value)} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: SOFT, marginTop: '10px' }}>
                  Começou em {fmtBR(data.dataInicio)}
                </div>
              </CardBox>

              {/* Contador */}
              <div style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`, color: '#fff', borderRadius: '3px', padding: '34px 28px', textAlign: 'center', marginBottom: '16px' }}>
                {encerrado ? (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '34px', color: GOLD }}>Desafio encerrado</div>
                ) : !comecou ? (
                  <>
                    <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '3.5px', color: GOLD, textTransform: 'uppercase', marginBottom: '10px' }}>Contagem regressiva</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '46px', fontWeight: 500, lineHeight: 1 }}>
                      Faltam <span style={{ color: GOLD }}>{faltamInicio}</span> {faltamInicio === 1 ? 'dia' : 'dias'}
                    </div>
                    <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: '11px', color: GOLD_LIGHT, marginTop: '10px', letterSpacing: '0.5px' }}>pro seu desafio começar</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '3.5px', color: GOLD, textTransform: 'uppercase', marginBottom: '10px' }}>Você está no</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '56px', fontWeight: 500, lineHeight: 1 }}>
                      Dia <span style={{ color: GOLD }}>{diaDisplay}</span> <span style={{ fontSize: '30px', color: GOLD_LIGHT }}>de {TOTAL_DIAS}</span>
                    </div>
                  </>
                )}
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.14)', borderRadius: '3px', overflow: 'hidden', marginTop: '24px' }}>
                  <div style={{ height: '100%', width: `${progresso}%`, background: `linear-gradient(90deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '21px', color: NAVY_DEEP, lineHeight: 1.4, padding: '16px 10px 8px' }}>
                “Você não precisa fazer o treino perfeito.<br />Você precisa <span style={{ color: GOLD }}>continuar</span>.”
              </div>
            </div>
          )}

          {/* ======================= SEÇÃO 2 · MEDIDAS INICIAIS ======================= */}
          {aba === 'medidas' && (
            <div className="diario-appear">
              <SectionHead kicker="Ponto de partida" titulo="Medidas" emphasis="iniciais" sub="Registre seu ponto de partida. Isso vai ser comparado com as medidas finais no dia 45." />
              <CardBox style={{ borderLeftColor: NAVY }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px' }}>
                  {CAMPOS.map(c => (
                    <MedidaInput key={c.key} campo={c} value={data.medidasIniciais[c.key] || ''} onChange={(v) => setMedida('medidasIniciais', c.key, v)} />
                  ))}
                </div>

                <div style={{ marginTop: '26px' }}>
                  <Kicker>Foto inicial</Kicker>
                  <FotoBlock foto={data.medidasIniciais.foto} onPick={(f) => uploadFoto('medidasIniciais', f)} erro={fotoErro === 'medidasIniciais'} />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Btn onClick={() => salvarMedidas('medidasIniciais')}>{data.medidasIniciais.savedAt ? 'Editar medidas iniciais' : 'Salvar medidas iniciais'}</Btn>
                </div>

                {data.medidasIniciais.savedAt && (
                  <div style={{ marginTop: '18px', padding: '14px 16px', background: `${GOLD}1f`, border: `1px solid ${GOLD}66`, borderRadius: '3px' }}>
                    <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: '11px', color: SOFT, marginBottom: '4px' }}>Registrado em {fmtBR(data.medidasIniciais.savedAt)}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16.5px', color: NAVY_DEEP }}>
                      Suas medidas iniciais estão registradas. Elas serão comparadas com as finais no <span style={{ color: GOLD, fontWeight: 500 }}>dia 45</span>.
                    </div>
                  </div>
                )}
              </CardBox>
            </div>
          )}

          {/* ======================= SEÇÃO 3 · METAS & PROPÓSITO ======================= */}
          {aba === 'metas' && (
            <div className="diario-appear">
              <SectionHead kicker="Propósito" titulo="Metas &" emphasis="propósito" sub="Escreva com sinceridade. Depois do 3º dia, essa página fica selada — pra você reler quando precisar." />

              {metasReadOnly && (
                <div style={{ background: CREAM, border: `1px solid ${GOLD}66`, borderLeft: `4px solid ${GOLD}`, borderRadius: '3px', padding: '16px 18px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '17px', color: NAVY_DEEP }}>
                    <Lock size={15} color={GOLD} strokeWidth={1.8} />
                    Selado{data.metas.seladoAt ? ` em ${fmtBR(data.metas.seladoAt)}` : ''}. Volte aqui quando precisar lembrar por que começou.
                  </div>
                </div>
              )}

              <CardBox style={{ background: metasReadOnly ? CREAM : '#fff' }}>
                <Kicker>Por que eu entrei nesse desafio?</Kicker>
                <textarea className="diario-ta" style={{ marginTop: '10px', minHeight: '110px' }} maxLength={500} disabled={metasReadOnly}
                  placeholder="Escreva o que te trouxe até aqui…" value={data.metas.porque || ''} onChange={(e) => setMeta('porque', e.target.value)} />
                {!metasReadOnly && <CharCount v={data.metas.porque} max={500} />}

                <div style={{ marginTop: '22px', display: 'grid', gap: '16px' }}>
                  {[['meta1', 'Meta concreta 1', 'Ex: Treinar 5x por semana'], ['meta2', 'Meta concreta 2', 'Ex: Beber 2L de água por dia'], ['meta3', 'Meta concreta 3', 'Ex: Dormir 7h por noite']].map(([k, lbl, ph]) => (
                    <div key={k}>
                      <Kicker>{lbl}</Kicker>
                      <input className="diario-input" style={{ marginTop: '8px' }} disabled={metasReadOnly} placeholder={ph} maxLength={120} value={data.metas[k] || ''} onChange={(e) => setMeta(k, e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <Kicker>Meta emocional</Kicker>
                    <input className="diario-input" style={{ marginTop: '8px' }} disabled={metasReadOnly} placeholder="Ex: Terminar o ano em paz comigo" maxLength={160} value={data.metas.metaEmocional || ''} onChange={(e) => setMeta('metaEmocional', e.target.value)} />
                  </div>
                </div>

                {!metasReadOnly && (
                  <div style={{ marginTop: '24px' }}>
                    <Btn variant="gold" onClick={selarMetas}><Lock size={13} strokeWidth={2} />Salvar e selar</Btn>
                  </div>
                )}
              </CardBox>
            </div>
          )}

          {/* ======================= SEÇÃO 4 · CALENDÁRIO ======================= */}
          {aba === 'calendario' && (
            <div className="diario-appear">
              <SectionHead kicker="Sua jornada" titulo="Calendário" emphasis="50 dias" />

              <div style={{ background: '#fff', border: `1px solid ${CREAM_DK}`, borderRadius: '3px', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 500, color: NAVY_DEEP }}>{treinosFeitos}<span style={{ color: SOFT, fontSize: '16px' }}>/{TOTAL_DIAS}</span></div>
                  <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '1.8px', color: SOFT, textTransform: 'uppercase', marginTop: '2px' }}>Treinos feitos</div>
                </div>
                <div style={{ width: '1px', background: CREAM_DK }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 500, color: NAVY_DEEP }}>{miniSemanas}<span style={{ color: SOFT, fontSize: '16px' }}>/7</span></div>
                  <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '1.8px', color: SOFT, textTransform: 'uppercase', marginTop: '2px' }}>Mini-desafios</div>
                </div>
              </div>

              {SEMANAS.map((s, si) => (
                <div key={si} style={{ marginBottom: '18px' }}>
                  <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '8.5px', letterSpacing: '2px', color: SOFT, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Semana {si + 1} · <span style={{ color: GOLD }}>{s.nome}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                    {Array.from({ length: s.fim - s.ini + 1 }, (_, k) => s.ini + k).map(n => {
                      const reg = data.dias[n];
                      const feito = reg && reg.treino;
                      const isHoje = comecou && n === diaRaw && !encerrado;
                      const futuro = n > diaRaw || !comecou;
                      let bg = '#fff', color = NAVY_DEEP, border = `1px solid ${CREAM_DK}`, opacity = 1;
                      if (feito) { bg = GOLD; color = NAVY_DEEP; border = `1px solid ${GOLD}`; }
                      if (isHoje) { border = `2px solid ${GOLD}`; if (!feito) { bg = NAVY_DEEP; color = '#fff'; } }
                      if (futuro && !isHoje) { opacity = 0.4; }
                      const clicavel = comecou && !encerrado && n <= diaRaw;
                      return (
                        <button key={n} disabled={!clicavel} onClick={() => clicavel && setDiaModal(n)} style={{
                          aspectRatio: '1 / 1', background: bg, color, border, borderRadius: '4px', opacity,
                          cursor: clicavel ? 'pointer' : 'default', padding: 0, position: 'relative',
                          fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 500,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                        }}>
                          {n}
                          {feito && <Check size={10} color={NAVY_DEEP} strokeWidth={3} style={{ position: 'absolute', top: '3px', right: '3px' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '14px', fontFamily: "'Mulish', sans-serif", fontSize: '9.5px', color: SOFT, letterSpacing: '0.5px' }}>
                <Legenda cor={GOLD} txt="Feito" /><Legenda cor={NAVY_DEEP} txt="Hoje" /><Legenda cor="#fff" txt="Pendente" borda /><Legenda cor={CREAM_DK} txt="Futuro" />
              </div>
            </div>
          )}

          {/* ======================= SEÇÃO 5 · ANOTAÇÕES ======================= */}
          {aba === 'anotacoes' && (
            <div className="diario-appear">
              <SectionHead kicker="Reflexões" titulo="Anotações" emphasis="livres" />
              {anotacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: `1px solid ${CREAM_DK}`, borderRadius: '3px' }}>
                  <FileText size={28} color={GOLD} strokeWidth={1.3} style={{ marginBottom: '14px' }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '20px', color: SOFT, lineHeight: 1.4 }}>
                    Suas reflexões aparecerão aqui<br />conforme você preencher o calendário.
                  </div>
                </div>
              ) : anotacoes.map(a => (
                <CardBox key={a.n}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '8px', letterSpacing: '2px', color: NAVY, textTransform: 'uppercase' }}>Dia {a.n} de 50</span>
                    {a.savedAt && <span style={{ fontFamily: "'Mulish', sans-serif", fontSize: '10px', color: SOFT }}>{fmtBR(a.savedAt)}</span>}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: INK, lineHeight: 1.5, fontStyle: 'italic' }}>{a.sentimento}</div>
                </CardBox>
              ))}
            </div>
          )}

          {/* ======================= SEÇÃO 6 · EVOLUÇÃO ======================= */}
          {aba === 'evolucao' && (
            <div className="diario-appear">
              <SectionHead kicker="Reta final" titulo="Medidas finais &" emphasis="evolução" />
              {!evolucaoAberta ? (
                <div style={{ textAlign: 'center', padding: '46px 26px', background: CREAM, border: `1px dashed ${GOLD}`, borderRadius: '3px' }}>
                  <Lock size={26} color={GOLD} strokeWidth={1.4} style={{ marginBottom: '14px' }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '21px', color: NAVY_DEEP, lineHeight: 1.4 }}>
                    Esta seção abre no <span style={{ color: GOLD }}>dia 45</span> do seu desafio.
                  </div>
                  {!encerrado && <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: '11px', color: SOFT, marginTop: '12px', letterSpacing: '0.5px' }}>Faltam {faltamEvolucao} {faltamEvolucao === 1 ? 'dia' : 'dias'}.</div>}
                </div>
              ) : (
                <>
                  <CardBox style={{ borderLeftColor: NAVY }}>
                    <Kicker>Preencha suas medidas finais</Kicker>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', marginTop: '16px' }}>
                      {CAMPOS.map(c => (
                        <MedidaInput key={c.key} campo={c} value={data.medidasFinais[c.key] || ''} onChange={(v) => setMedida('medidasFinais', c.key, v)} />
                      ))}
                    </div>
                    <div style={{ marginTop: '26px' }}>
                      <Kicker>Foto final</Kicker>
                      <FotoBlock foto={data.medidasFinais.foto} onPick={(f) => uploadFoto('medidasFinais', f)} erro={fotoErro === 'medidasFinais'} />
                    </div>
                    <div style={{ marginTop: '24px' }}>
                      <Btn onClick={() => salvarMedidas('medidasFinais')}>{data.medidasFinais.savedAt ? 'Editar medidas finais' : 'Salvar medidas finais'}</Btn>
                    </div>
                  </CardBox>

                  {data.medidasFinais.savedAt && (
                    <>
                      <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '8px', letterSpacing: '2.5px', color: NAVY, textTransform: 'uppercase', margin: '28px 0 14px' }}>Sua evolução</div>
                      <Comparacao ini={data.medidasIniciais} fin={data.medidasFinais} />
                      <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Btn variant="gold" onClick={() => window.print()}><Download size={13} strokeWidth={2} />Exportar meu diário em PDF</Btn>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, #0F1A32 100%)`, color: '#fff', margin: '0 -20px', padding: '30px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '19px', color: GOLD }}>Meu Diário Ela Fit · MOVE 50</div>
        </div>
      </div>

      {/* ===== MODAL DO DIA ===== */}
      {diaModal != null && (
        <DiaModal n={diaModal} reg={data.dias[diaModal] || {}} onClose={() => setDiaModal(null)} onSave={(d) => salvarDia(diaModal, d)} />
      )}

      {/* ===== VERSÃO IMPRESSÃO (PDF) ===== */}
      <PrintView data={data} diaDisplay={diaDisplay} treinosFeitos={treinosFeitos} miniSemanas={miniSemanas} />
    </div>
  );
}

/* ===================== Subcomponentes (escopo de módulo) ===================== */

function SectionHead({ kicker, titulo, emphasis, sub }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '3.5px', color: GOLD, textTransform: 'uppercase', marginBottom: '8px' }}>{kicker}</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '34px', lineHeight: 1.05, margin: 0, color: NAVY_DEEP, letterSpacing: '-0.5px' }}>
        {titulo} <em style={{ color: GOLD, fontWeight: 400 }}>{emphasis}</em>
      </h2>
      {sub && <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: SOFT, marginTop: '10px', lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}

function MedidaInput({ campo, value, onChange }) {
  return (
    <div>
      <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '1.8px', color: SOFT, textTransform: 'uppercase', marginBottom: '2px' }}>{campo.label} ({campo.unit})</div>
      <input className="diario-input" type="number" inputMode="decimal" step="0.1" min="0" placeholder="—" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FotoBlock({ foto, onPick, erro }) {
  return (
    <div style={{ marginTop: '10px' }}>
      {foto && <img src={foto} alt="" style={{ width: '100%', maxWidth: '240px', borderRadius: '4px', border: `1px solid ${CREAM_DK}`, marginBottom: '12px', display: 'block' }} />}
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '9.5px', letterSpacing: '2px', textTransform: 'uppercase', color: NAVY_DEEP, border: `1px solid ${CREAM_DK}`, padding: '12px 18px', borderRadius: '2px' }}>
        <Camera size={14} strokeWidth={1.8} />
        {foto ? 'Trocar foto' : 'Enviar foto'}
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onPick(f); e.target.value = ''; }} />
      </label>
      <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: '10.5px', color: SOFT, marginTop: '10px', fontStyle: 'italic' }}>A foto fica apenas no seu dispositivo.</div>
      {erro && <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: '11px', color: '#B85C5C', marginTop: '6px', fontWeight: 600 }}>Imagem muito pesada. Tente uma foto menor.</div>}
    </div>
  );
}

function CharCount({ v, max }) {
  return <div style={{ textAlign: 'right', fontFamily: "'Mulish', sans-serif", fontSize: '10px', color: SOFT, marginTop: '4px' }}>{(v || '').length}/{max}</div>;
}

function Legenda({ cor, txt, borda }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: cor, border: borda ? `1px solid ${CREAM_DK}` : 'none', display: 'inline-block' }} />{txt}
    </span>
  );
}

function DiaModal({ n, reg, onClose, onSave }) {
  const [treino, setTreino] = useState(!!reg.treino);
  const [agua, setAgua] = useState(!!reg.agua);
  const [mini, setMini] = useState(!!reg.mini);
  const [sentimento, setSentimento] = useState(reg.sentimento || '');

  const checks = [
    ['Treinei hoje?', treino, setTreino],
    ['Bebi 2L de água?', agua, setAgua],
    ['Cumpri o mini-desafio da semana?', mini, setMini],
  ];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0', animation: 'fadeIn 0.2s ease-out' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: CREAM, width: '100%', maxWidth: '520px', borderRadius: '14px 14px 0 0', padding: '26px 24px 30px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '8px', letterSpacing: '2.5px', color: NAVY, textTransform: 'uppercase' }}>Registro do</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 500, color: NAVY_DEEP, lineHeight: 1 }}>Dia <em style={{ color: GOLD }}>{n}</em></div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: SOFT, padding: '4px' }}><X size={22} /></button>
        </div>

        {checks.map(([label, val, set]) => (
          <button key={label} onClick={() => set(!val)} style={{
            width: '100%', textAlign: 'left', background: val ? '#fff' : 'transparent', border: `1px solid ${val ? GOLD : CREAM_DK}`,
            borderLeft: `4px solid ${val ? GOLD : CREAM_DK}`, borderRadius: '3px', padding: '14px 16px', marginBottom: '10px',
            display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
          }}>
            <span style={{ minWidth: '24px', width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${val ? NAVY_DEEP : NAVY}`, background: val ? NAVY_DEEP : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {val && <Check size={13} color="#fff" strokeWidth={2.5} />}
            </span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '19px', fontWeight: 500, color: NAVY_DEEP }}>{label}</span>
          </button>
        ))}

        <div style={{ marginTop: '14px' }}>
          <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '8px', letterSpacing: '2.5px', color: NAVY, textTransform: 'uppercase', marginBottom: '8px' }}>Como me senti hoje?</div>
          <textarea className="diario-ta" maxLength={300} placeholder="Opcional — escreva uma linha sobre o seu dia…" value={sentimento} onChange={(e) => setSentimento(e.target.value)} />
          <div style={{ textAlign: 'right', fontFamily: "'Mulish', sans-serif", fontSize: '10px', color: SOFT, marginTop: '4px' }}>{sentimento.length}/300</div>
        </div>

        <div style={{ marginTop: '18px' }}>
          <Btn style={{ width: '100%' }} onClick={() => onSave({ treino, agua, mini, sentimento })}>Salvar dia</Btn>
        </div>
      </div>
    </div>
  );
}

function diffTxt(ini, fin, unit) {
  const a = parseFloat(ini), b = parseFloat(fin);
  if (isNaN(a) || isNaN(b)) return null;
  const d = Math.round((b - a) * 10) / 10;
  const sinal = d > 0 ? '+' : '';
  return { d, txt: `${sinal}${d}${unit}`, down: d < 0 };
}

function Comparacao({ ini, fin }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {[['Antes', ini.foto], ['Depois', fin.foto]].map(([lbl, foto]) => (
          <div key={lbl}>
            <div style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '2px', color: SOFT, textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>{lbl}</div>
            <div style={{ aspectRatio: '3/4', background: CREAM, border: `1px solid ${CREAM_DK}`, borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {foto ? <img src={foto} alt={lbl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: SOFT, fontSize: '15px' }}>sem foto</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: `1px solid ${CREAM_DK}`, borderRadius: '3px', overflow: 'hidden' }}>
        {CAMPOS.map((c, i) => {
          const diff = diffTxt(ini[c.key], fin[c.key], c.unit);
          return (
            <div key={c.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: i === 0 ? 'none' : `1px solid ${CREAM_DK}` }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: NAVY_DEEP, fontWeight: 500 }}>{c.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: "'Mulish', sans-serif", fontSize: '12px', color: SOFT }}>{ini[c.key] || '—'} → {fin[c.key] || '—'} {c.unit}</span>
                {diff && <span style={{ fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: '11px', color: diff.d === 0 ? SOFT : GOLD, minWidth: '46px', textAlign: 'right' }}>{diff.txt}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintView({ data, diaDisplay, treinosFeitos, miniSemanas }) {
  return (
    <div className="diario-print" style={{ fontFamily: "'Mulish', sans-serif", color: '#1A1F2E', padding: '24px 28px' }}>
      <div style={{ fontWeight: 800, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8956A' }}>Método Ela Fit · MOVE 50</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 600, margin: '4px 0 2px' }}>Meu Diário</h1>
      <div style={{ fontSize: '12px', color: '#555' }}>
        {data.nome ? `${data.nome} · ` : ''}Início em {fmtBR(data.dataInicio)} · Dia {diaDisplay} de 50
      </div>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '14px' }}>Treinos feitos: {treinosFeitos}/50 · Mini-desafios: {miniSemanas}/7</div>

      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', margin: '16px 0 6px' }}>Metas &amp; propósito</h3>
      <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
        <b>Por quê:</b> {data.metas.porque || '—'}<br />
        <b>Meta 1:</b> {data.metas.meta1 || '—'} · <b>Meta 2:</b> {data.metas.meta2 || '—'} · <b>Meta 3:</b> {data.metas.meta3 || '—'}<br />
        <b>Meta emocional:</b> {data.metas.metaEmocional || '—'}
      </div>

      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', margin: '16px 0 6px' }}>Medidas — início → fim</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          {CAMPOS.map(c => {
            const diff = diffTxt(data.medidasIniciais[c.key], data.medidasFinais[c.key], c.unit);
            return (
              <tr key={c.key} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '5px 0' }}>{c.label}</td>
                <td style={{ padding: '5px 0', textAlign: 'right' }}>{data.medidasIniciais[c.key] || '—'} → {data.medidasFinais[c.key] || '—'} {c.unit}</td>
                <td style={{ padding: '5px 0', textAlign: 'right', width: '60px', color: '#B8956A', fontWeight: 700 }}>{diff ? diff.txt : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
