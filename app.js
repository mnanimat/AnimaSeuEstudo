const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = 'focovest_v1';
const DAY = 86400000;

const CHECK_STEPS = ['Aula', 'Resumo', 'Autoexplicação', 'Exercícios', 'Caderno de erros', 'Revisão', 'Simulado'];

const EXAM_DATA = {
  ENEM: {
    defaultDate: '2026-11-08',
    projectionLabel: 'pontos',
    subjects: {
      'Matemática': ['Matemática básica e porcentagem','Razão, proporção e escalas','Funções e gráficos','Geometria plana','Geometria espacial','Estatística e probabilidade','Análise combinatória','Trigonometria básica'],
      'Linguagens': ['Interpretação de textos','Gêneros textuais','Variação linguística','Figuras de linguagem','Funções da linguagem','Literatura brasileira','Gramática aplicada','Língua estrangeira'],
      'Biologia': ['Ecologia','Citologia','Genética','Evolução','Fisiologia humana','Botânica','Zoologia','Biotecnologia'],
      'Física': ['Cinemática','Dinâmica','Trabalho e energia','Hidrostática','Termologia','Óptica','Ondulatória','Eletricidade'],
      'Química': ['Química geral','Estequiometria','Soluções','Termoquímica','Cinética e equilíbrio','Eletroquímica','Química orgânica','Química ambiental'],
      'História': ['Brasil Colônia','Brasil Império','República brasileira','História Antiga','Idade Média','História Moderna','História Contemporânea','Movimentos sociais'],
      'Geografia': ['Cartografia','Geografia física','Urbanização','População','Globalização','Geopolítica','Agropecuária','Meio ambiente'],
      'Filosofia/Sociologia': ['Filosofia antiga','Filosofia moderna','Ética e política','Teoria do conhecimento','Cultura e sociedade','Trabalho e desigualdade','Cidadania','Movimentos sociais'],
      'Redação': ['Leitura da proposta','Projeto de texto','Tese e argumentos','Repertório sociocultural','Coesão','Proposta de intervenção','Norma-padrão','Reescrita estratégica']
    }
  },
  ITA: {
    defaultDate: '2026-09-27',
    projectionLabel: 'média',
    subjects: {
      'Matemática': ['Álgebra e polinômios','Funções e inequações','Trigonometria avançada','Geometria plana','Geometria espacial','Geometria analítica','Combinatória e probabilidade','Números complexos','Cálculo e sequências'],
      'Física': ['Cinemática vetorial','Dinâmica avançada','Gravitação','Trabalho, energia e momento','Hidrostática e fluidos','Termodinâmica','Ondas e óptica','Eletrostática','Eletrodinâmica','Magnetismo e indução'],
      'Química': ['Estrutura atômica','Ligações e geometria molecular','Estequiometria avançada','Soluções e propriedades coligativas','Termoquímica','Cinética','Equilíbrio químico','Eletroquímica','Química orgânica','Química descritiva'],
      'Português': ['Interpretação avançada','Gramática normativa','Sintaxe','Semântica','Estilística','Literatura','Coesão e coerência','Redação ITA'],
      'Inglês': ['Interpretação de textos','Vocabulário em contexto','Estruturas gramaticais','Conectores','Inferência','Textos técnico-científicos'],
      'Redação': ['Adequação ao tema','Tipo textual','Coerência','Coesão','Modalidade escrita','Projeto argumentativo','Repertório','Reescrita']
    }
  }
};

const VIDEOS = [
  {exam:'ENEM',subject:'Matemática',title:'Matemática básica do zero — aulão completo',channel:'Matemática em Evidência',url:'https://www.youtube.com/watch?v=ddZHkCUcYRM',id:'ddZHkCUcYRM',tags:['base','exercícios']},
  {exam:'ENEM',subject:'Biologia',title:'Biologia para o ENEM — temas mais frequentes',channel:'Curso Enem Gratuito',url:'https://www.youtube.com/watch?v=7LG4D_USSrU',id:'7LG4D_USSrU',tags:['revisão','ENEM']},
  {exam:'ENEM',subject:'Natureza',title:'Aulão: Biologia, Química, Geografia e Redação',channel:'Curso Enem Gratuito',url:'https://www.youtube.com/watch?v=UiuYDPyLzkg',id:'UiuYDPyLzkg',tags:['aulão','multidisciplinar']},
  {exam:'ENEM',subject:'Física',title:'Esquenta ENEM — Física, Química, Biologia e Matemática',channel:'Estúdio Educação MG',url:'https://www.youtube.com/watch?v=iVb2pMXewnI',id:'iVb2pMXewnI',tags:['revisão','natureza']},
  {exam:'ENEM',subject:'Redação',title:'Curso gratuito de redação ENEM',channel:'Curso Enem Gratuito',url:'https://www.youtube.com/cursoenemgratuito',id:null,tags:['redação','competências']},
  {exam:'ENEM',subject:'Geral',title:'Mais de 1.500 videoaulas do Ensino Médio',channel:'Canal Futura',url:'https://futura.frm.org.br/futura/videoaulas',id:null,tags:['curso','gratuito']},
  {exam:'ENEM',subject:'Matemática',title:'Matemática, Ciências e prática guiada',channel:'Khan Academy Brasil',url:'https://pt.khanacademy.org/',id:null,tags:['plataforma','exercícios']},
  {exam:'ENEM',subject:'Geral',title:'Aulas para ENEM e vestibulares',channel:'Toda Matéria',url:'https://www.youtube.com/channel/UCDVaeMc16MXLuleGQircOiQ',id:null,tags:['resumos','aulas']},
  {exam:'ITA',subject:'Matemática',title:'Especial ITA/IME — Matemática',channel:'Estratégia Vestibulares',url:'https://www.youtube.com/watch?v=QA2lAW7kvYY',id:'QA2lAW7kvYY',tags:['ITA','avançado']},
  {exam:'ITA',subject:'Matemática',title:'Resolução de Matemática ITA 2025/2026',channel:'Universo Narrado',url:'https://www.youtube.com/watch?v=GLhbUb5kUh8',id:'GLhbUb5kUh8',tags:['resolução','prova']},
  {exam:'ITA',subject:'Física',title:'Física para ITA e IME',channel:'Prof. Toni Burgatto',url:'https://www.youtube.com/watch?v=OfyHKLY6wAA',id:'OfyHKLY6wAA',tags:['física','ITA']},
  {exam:'ITA',subject:'Química',title:'Química descritiva para ITA',channel:'Prof. Thiago Cardoso',url:'https://www.youtube.com/watch?v=A7yEtum4zpg',id:'A7yEtum4zpg',tags:['química','2ª fase']},
  {exam:'ITA',subject:'Química',title:'Cinética química — teoria e exercícios',channel:'Impulsiona ITA IME',url:'https://www.youtube.com/@impulsiona.itaime',id:null,tags:['cinética','exercícios']},
  {exam:'ITA',subject:'Geral',title:'Aulas e resoluções criadas por alunos do ITA',channel:'ITA Topics',url:'https://www.youtube.com/@itatopics',id:null,tags:['resoluções','ITA']},
  {exam:'ITA',subject:'Estratégia',title:'Como iniciar os estudos para ITA/IME',channel:'Prof. Vinicius Fulconi',url:'https://www.youtube.com/watch?v=wQA8XiZSxrA',id:'wQA8XiZSxrA',tags:['planejamento','ITA']}
];

const OFFICIAL_RESOURCES = {
  ENEM: [
    {icon:'📄',title:'Provas e gabaritos do ENEM',desc:'Cadernos oficiais de várias edições e aplicações.',url:'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos'},
    {icon:'🧾',title:'Prova ENEM 2025 — 1º dia',desc:'Caderno oficial com Linguagens, Humanas e Redação.',url:'https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf'},
    {icon:'🎓',title:'Página oficial do ENEM',desc:'Editais, orientações e Página do Participante.',url:'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem'}
  ],
  ITA: [
    {icon:'📄',title:'Provas anteriores do ITA',desc:'1ª e 2ª fases, gabaritos e provas por disciplina.',url:'https://www.vestibular.ita.br/provas.htm'},
    {icon:'🧾',title:'Prova ITA 2026 — 1ª fase',desc:'Prova oficial com Matemática, Física, Química e Inglês.',url:'https://www.vestibular.ita.br/provas/2026_fase1.pdf'},
    {icon:'📊',title:'Estatísticas do vestibular ITA',desc:'Médias, concorrência, abstenção e perfil de aprovados.',url:'https://www.vestibular.ita.br/estatisticas.htm'}
  ]
};

const QUIZ_BANK = [
  {exam:'ENEM',subject:'Matemática',q:'Um produto de R$ 200 recebe desconto de 15%. Qual é o novo preço?',options:['R$ 160','R$ 170','R$ 175','R$ 185'],answer:1},
  {exam:'ENEM',subject:'Biologia',q:'Qual processo é responsável pela produção de matéria orgânica a partir de CO₂ em plantas?',options:['Respiração','Fermentação','Fotossíntese','Transpiração'],answer:2},
  {exam:'ENEM',subject:'Física',q:'Um carro percorre 120 km em 2 h. Sua velocidade média é:',options:['40 km/h','60 km/h','80 km/h','240 km/h'],answer:1},
  {exam:'ENEM',subject:'Química',q:'O número atômico corresponde ao número de:',options:['Nêutrons','Prótons','Núcleons','Moléculas'],answer:1},
  {exam:'ENEM',subject:'Linguagens',q:'Em um texto argumentativo, a tese é:',options:['Uma citação obrigatória','A posição central defendida','O título do texto','A conclusão apenas'],answer:1},
  {exam:'ITA',subject:'Matemática',q:'Se z = 1 + i, então |z| é:',options:['1','√2','2','2√2'],answer:1},
  {exam:'ITA',subject:'Física',q:'Em movimento circular uniforme, a aceleração centrípeta aponta:',options:['Tangente à trajetória','Para fora do círculo','Para o centro','Na direção da velocidade'],answer:2},
  {exam:'ITA',subject:'Química',q:'Para uma reação exotérmica em equilíbrio, elevar a temperatura tende a:',options:['Deslocar para os produtos','Deslocar para os reagentes','Não alterar o equilíbrio','Zerar a constante'],answer:1},
  {exam:'ITA',subject:'Português',q:'A coerência textual está ligada principalmente à:',options:['Grafia isolada','Progressão lógica de sentidos','Quantidade de parágrafos','Extensão do título'],answer:1},
  {exam:'ITA',subject:'Inglês',q:'In “Although it was difficult, she persisted”, although expresses:',options:['Cause','Contrast','Condition','Purpose'],answer:1}
];

function isoDate(d = new Date()) { return new Date(d).toISOString().slice(0,10); }
function localDate(date) { return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}); }
function uid() { return Math.random().toString(36).slice(2,10); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function esc(value=''){ return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[ch])); }

function defaultState(){
  const exam = 'ENEM';
  const topics = buildTopics(exam);
  return {
    exam,
    settings:{examDate:EXAM_DATA[exam].defaultDate,hoursPerDay:2,daysPerWeek:5,priority:'Matemática',weeklyGoal:10,mainGoal:'Aumentar a nota com consistência e corrigir lacunas'},
    topics,
    schedule:seedSchedule(exam),
    cards:seedCards(exam),
    mocks:[],
    sessions:[],
    errors:[],
    watchedVideos:[],
    notes:[],
    lastStudyDate:null,
    streak:0,
    createdAt:new Date().toISOString()
  };
}

function buildTopics(exam){
  return Object.entries(EXAM_DATA[exam].subjects).flatMap(([subject,items])=>items.map((title,i)=>({id:`${exam}-${subject}-${i}`,subject,title,steps:[false,false,false,false,false,false,false],accuracy:0,questions:0,updatedAt:null})));
}

function seedSchedule(exam){
  const subjects = Object.keys(EXAM_DATA[exam].subjects);
  const today = new Date();
  return Array.from({length:10},(_,i)=>{
    const d = new Date(today); d.setDate(d.getDate()+i);
    const subject = subjects[i%subjects.length];
    const topic = EXAM_DATA[exam].subjects[subject][i%EXAM_DATA[exam].subjects[subject].length];
    return {id:uid(),date:isoDate(d),time:i%2===0?'19:00':'20:10',duration:i%3===0?50:40,subject,topic,type:i%4===3?'Revisão':'Estudo',done:false};
  });
}

function seedCards(exam){
  const subjects=Object.keys(EXAM_DATA[exam].subjects).slice(0,5);
  return subjects.map((subject,i)=>({id:uid(),subject,front:`Explique com suas palavras: ${EXAM_DATA[exam].subjects[subject][0]}.`,back:`Defina o conceito, apresente um exemplo e indique um erro comum relacionado a ${EXAM_DATA[exam].subjects[subject][0]}.`,interval:i===0?0:i,efactor:2.5,repetitions:i,nextReview:isoDate(new Date(Date.now()+i*DAY)),lastQuality:null}));
}

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState(); }
  catch { return defaultState(); }
}
let state = loadState();
let activeSubject = null;
let currentCardIndex = 0;
let timerSeconds = 25*60, timerId = null;
let essayFileData = null;
let essayModel = 'ENEM';

function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function mutate(fn){ fn(); saveState(); renderAll(); }

function switchExam(exam, keepProgress=false){
  if(state.exam===exam) return;
  state.exam=exam;
  state.settings={...state.settings,examDate:EXAM_DATA[exam].defaultDate,priority:Object.keys(EXAM_DATA[exam].subjects)[0]};
  if(!keepProgress){state.topics=buildTopics(exam);state.schedule=seedSchedule(exam);state.cards=seedCards(exam);}
  saveState(); renderAll();
}

function navigate(view){
  $$('.view').forEach(v=>v.classList.remove('active'));
  $(`#view-${view}`).classList.add('active');
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  const titles={dashboard:'Dashboard',cronograma:'Cronograma',trilhas:'Trilhas e checklist',revisao:'Revisão espaçada',simulados:'Simulados e provas',aulas:'Videoaulas gratuitas',redacao:'Corretor de redação IA',ferramentas:'Ferramentas de estudo'};
  $('#viewTitle').textContent=titles[view];
  $('#sidebar').classList.remove('open');
  if(view==='revisao') renderReview();
  if(view==='redacao') $('#essayTheme').focus();
  window.scrollTo({top:0,behavior:'smooth'});
}

function calculateStats(){
  const totalSteps=state.topics.length*7;
  const doneSteps=state.topics.reduce((a,t)=>a+t.steps.filter(Boolean).length,0);
  const overall=totalSteps?Math.round(doneSteps/totalSteps*100):0;
  const weekAgo=Date.now()-7*DAY;
  const weekSessions=state.sessions.filter(s=>new Date(s.date).getTime()>=weekAgo);
  const hours=weekSessions.reduce((a,s)=>a+s.minutes/60,0);
  const questions=state.mocks.reduce((a,m)=>a+m.total,0);
  const correct=state.mocks.reduce((a,m)=>a+m.correct,0);
  const accuracy=questions?Math.round(correct/questions*100):0;
  const due=state.cards.filter(c=>c.nextReview<=isoDate()).length;
  const projection=state.exam==='ENEM'?(accuracy?Math.round(380+accuracy*5.1+overall*.9):null):(accuracy?(accuracy/10).toFixed(1):null);
  return{overall,hours,accuracy,due,projection,doneSteps,totalSteps};
}

function renderAll(){
  $('#sidebarExam').textContent=state.exam; $('#heroExam').textContent=state.exam;
  $('#examSelect').value=state.exam; $('#examDate').value=state.settings.examDate;
  $('#hoursPerDay').value=state.settings.hoursPerDay; $('#daysPerWeek').value=state.settings.daysPerWeek;
  $('#mainGoal').value=state.settings.mainGoal || '';
  $('#streakValue').textContent=state.streak||0;
  const now=new Date(); $('#todayLabel').textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase();
  renderSelects(); renderDashboard(); renderSchedule(); renderTopics(); renderReview(); renderMocks(); renderVideos(); renderErrors();
}

function renderSelects(){
  const subjects=Object.keys(EXAM_DATA[state.exam].subjects);
  ['prioritySubject','mockSubject','errorSubject'].forEach(id=>{
    const el=$('#'+id), current=el.value;
    el.innerHTML=subjects.map(s=>`<option>${s}</option>`).join('');
    el.value=subjects.includes(current)?current:(id==='prioritySubject'?state.settings.priority:subjects[0]);
  });
}

function renderDashboard(){
  const st=calculateStats();
  $('#overallPercent').textContent=st.overall+'%'; $('#goalRing').style.setProperty('--p',st.overall);
  $('#weeklyGoalText').textContent=state.settings.weeklyGoal+'h';
  $('#metricHours').textContent=(Math.round(st.hours*10)/10)+'h';
  $('#metricHoursHint').textContent=`meta: ${state.settings.weeklyGoal}h`;
  $('#metricAccuracy').textContent=st.accuracy+'%';
  $('#metricAccuracyHint').textContent=state.mocks.length?`${state.mocks.length} simulado(s)`:'sem simulados';
  $('#metricReviews').textContent=st.due;
  $('#metricProjection').textContent=st.projection?`${st.projection}${state.exam==='ENEM'?' pts':''}`:'—';
  $('#metricProjectionHint').textContent=state.exam==='ENEM'?'estimativa pedagógica':'média aproximada';
  $('#heroMessage').textContent=state.settings.mainGoal || 'Seu painel combina planejamento, prática deliberada, revisão espaçada e análise de desempenho.';
  renderStudyChart(); renderSmartQueue(); renderSubjectPerformance(); renderFunnel();
}

function renderStudyChart(){
  const days=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d);}
  const vals=days.map(d=>state.sessions.filter(s=>isoDate(new Date(s.date))===isoDate(d)).reduce((a,s)=>a+s.minutes/60,0));
  const max=Math.max(...vals,1);
  $('#studyChart').innerHTML=days.map((d,i)=>`<div class="bar-col"><div class="bar-wrap"><div class="bar" data-hours="${vals[i].toFixed(1)}" style="height:${Math.max(4,vals[i]/max*100)}%"></div></div><small>${d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</small></div>`).join('');
  $('#weeklyTotalLabel').textContent=`${vals.reduce((a,b)=>a+b,0).toFixed(1)}h no período`;
}

function renderSmartQueue(){
  const today=isoDate();
  const due=state.cards.filter(c=>c.nextReview<=today).slice(0,2).map(c=>({title:`Revisar: ${c.subject}`,sub:c.front,type:'review'}));
  const tasks=state.schedule.filter(s=>s.date===today&&!s.done).slice(0,2).map(s=>({title:`${s.subject}: ${s.topic}`,sub:`${s.time} • ${s.duration} min`,type:'task'}));
  const queue=[...due,...tasks];
  if(!queue.length) queue.push({title:'Fila concluída',sub:'Use o tempo extra para questões ou descanso.',type:'done'});
  $('#smartQueue').innerHTML=queue.map(q=>`<div class="queue-item"><span class="queue-dot"></span><div><b>${esc(q.title)}</b><small>${esc(q.sub)}</small></div><button data-open-view="${q.type==='review'?'revisao':'cronograma'}">→</button></div>`).join('');
}

function subjectStats(subject){
  const ts=state.topics.filter(t=>t.subject===subject);
  const progress=ts.length?Math.round(ts.reduce((a,t)=>a+t.steps.filter(Boolean).length,0)/(ts.length*7)*100):0;
  const q=ts.reduce((a,t)=>a+t.questions,0), c=ts.reduce((a,t)=>a+Math.round(t.questions*t.accuracy/100),0);
  return{progress,accuracy:q?Math.round(c/q*100):progress};
}
function renderSubjectPerformance(){
  const entries=Object.keys(EXAM_DATA[state.exam].subjects).map(s=>[s,subjectStats(s)]).sort((a,b)=>b[1].accuracy-a[1].accuracy).slice(0,6);
  $('#subjectPerformance').innerHTML=entries.map(([s,v])=>`<div><div class="subject-row-top"><span>${s}</span><b>${v.accuracy}%</b></div><div class="progress"><span style="width:${v.accuracy}%"></span></div></div>`).join('');
}
function renderFunnel(){
  $('#learningFunnel').innerHTML=CHECK_STEPS.map((name,i)=>{const n=state.topics.filter(t=>t.steps[i]).length;const pct=state.topics.length?Math.round(n/state.topics.length*100):0;return`<div class="funnel-step"><b>${pct}%</b><span>${name}</span></div>`}).join('');
}

function renderSchedule(filter='all'){
  const today=isoDate();
  let todays=state.schedule.filter(s=>s.date===today).sort((a,b)=>a.time.localeCompare(b.time));
  if(!todays.length){
    const first=state.topics.find(t=>!t.steps[0])||state.topics[0];
    todays=[{id:'suggested',date:today,time:'19:00',duration:50,subject:first.subject,topic:first.title,type:'Estudo',done:false}];
  }
  $('#todaySchedule').innerHTML=todays.map(s=>`<div class="timeline-item"><div class="timeline-time">${s.time}<br>${s.duration} min</div><div class="timeline-line"></div><div><h4>${esc(s.subject)} — ${esc(s.topic)}</h4><p>${s.type} • método ativo</p></div><button class="status-check ${s.done?'done':''}" data-toggle-schedule="${s.id}">${s.done?'✓':''}</button></div>`).join('');
  const grouped={};
  state.schedule.slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(s=>{if(filter==='pending'&&s.done)return;if(filter==='done'&&!s.done)return;(grouped[s.date]??=[]).push(s)});
  $('#weeklyPlan').innerHTML=Object.entries(grouped).slice(0,12).map(([date,tasks])=>`<div class="week-block"><div class="week-head"><b>${new Date(date+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</b><small>${tasks.reduce((a,t)=>a+t.duration,0)} min</small></div><div class="week-tasks">${tasks.map(t=>`<div class="week-task ${t.done?'done':''}"><div><b>${esc(t.subject)}</b><br><small>${esc(t.topic)}</small></div><button class="status-check ${t.done?'done':''}" data-toggle-schedule="${t.id}">${t.done?'✓':''}</button></div>`).join('')}</div></div>`).join('')||'<div class="empty-state"><h3>Nenhuma tarefa neste filtro.</h3></div>';
}

function generatePlan(){
  const subjects=Object.keys(EXAM_DATA[state.exam].subjects);
  const priority=$('#prioritySubject').value;
  const hours=Number($('#hoursPerDay').value), days=Number($('#daysPerWeek').value);
  const start=new Date(); const plan=[]; let topicCursor={}; subjects.forEach(s=>topicCursor[s]=0);
  for(let week=0;week<8;week++){
    let studyDays=0;
    for(let d=0;d<7;d++){
      if(studyDays>=days)break;
      const date=new Date(start);date.setDate(start.getDate()+week*7+d);
      if(date.getDay()===0&&days<7) continue;
      const blocks=Math.max(1,Math.round(hours*60/50));
      for(let b=0;b<blocks;b++){
        const weighted=[priority,priority,...subjects];
        const subject=weighted[(week*days*blocks+studyDays*blocks+b)%weighted.length];
        const topics=EXAM_DATA[state.exam].subjects[subject]; const topic=topics[topicCursor[subject]%topics.length];topicCursor[subject]++;
        plan.push({id:uid(),date:isoDate(date),time:`${String(18+Math.floor(b/2)).padStart(2,'0')}:${b%2?'00':'10'}`,duration:50,subject,topic,type:b===blocks-1&&d===days-1?'Questões/diagnóstico':'Estudo ativo',done:false});
      }
      studyDays++;
    }
  }
  state.schedule=plan; state.settings.hoursPerDay=hours;state.settings.daysPerWeek=days;state.settings.priority=priority;state.settings.examDate=$('#examDate').value;state.settings.weeklyGoal=Math.round(hours*days*10)/10;state.settings.mainGoal=$('#mainGoal').value.trim();
  saveState(); renderAll(); navigate('cronograma'); toast('Cronograma de 8 semanas criado.');
}

function renderTopics(){
  const subjects=Object.keys(EXAM_DATA[state.exam].subjects);
  if(!activeSubject||!subjects.includes(activeSubject))activeSubject=subjects[0];
  $('#subjectTabs').innerHTML=subjects.map(s=>`<button class="chip ${s===activeSubject?'active':''}" data-subject-tab="${s}">${s} <small>${subjectStats(s).progress}%</small></button>`).join('');
  const term=($('#topicSearch').value||'').toLowerCase();
  const topics=state.topics.filter(t=>t.subject===activeSubject&&t.title.toLowerCase().includes(term));
  $('#topicList').innerHTML=topics.map(t=>{const done=t.steps.filter(Boolean).length,pct=Math.round(done/7*100);return`<article class="topic-card"><div class="topic-main"><div><span class="section-kicker">${t.subject}</span><h3>${t.title}</h3><p>${done}/7 etapas • ${t.questions||0} questões registradas</p></div><div class="topic-progress"><strong>${pct}%</strong><div class="progress"><span style="width:${pct}%"></span></div></div></div><div class="checklist">${CHECK_STEPS.map((s,i)=>`<button class="check-step ${t.steps[i]?'completed':''}" data-topic="${t.id}" data-step="${i}"><span>${t.steps[i]?'✓':i+1}</span>${s}</button>`).join('')}</div></article>`}).join('')||'<div class="empty-state"><h3>Nenhum assunto encontrado.</h3></div>';
}

function toggleTopic(id,index){
  mutate(()=>{const t=state.topics.find(x=>x.id===id);t.steps[index]=!t.steps[index];t.updatedAt=new Date().toISOString();if(index===0&&t.steps[index]&&!state.cards.some(c=>c.front.includes(t.title))){state.cards.push({id:uid(),subject:t.subject,front:`Explique o conceito central de ${t.title}.`,back:`Defina ${t.title}, dê um exemplo e compare com um conceito próximo.`,interval:0,efactor:2.5,repetitions:0,nextReview:isoDate(),lastQuality:null});}});
}

function dueCards(){return state.cards.filter(c=>c.nextReview<=isoDate()).sort((a,b)=>a.nextReview.localeCompare(b.nextReview));}
function renderReview(){
  const due=dueCards();
  $('#dueCards').textContent=due.length; $('#learnedCards').textContent=state.cards.filter(c=>c.repetitions<3).length; $('#matureCards').textContent=state.cards.filter(c=>c.interval>=21).length;
  const rated=state.cards.filter(c=>c.lastQuality); $('#retentionRate').textContent=(rated.length?Math.round(rated.filter(c=>c.lastQuality>=3).length/rated.length*100):0)+'%';
  const card=due[currentCardIndex]||state.cards[currentCardIndex]||null;
  $('#cardBack').classList.add('hidden');$('#answerActions').classList.add('hidden');$('#showAnswerBtn').classList.remove('hidden');$('#cardSideLabel').textContent='PERGUNTA';
  if(card){$('#cardSubject').textContent=card.subject;$('#cardInterval').textContent=card.interval?`intervalo ${card.interval}d`:'novo';$('#cardFront').textContent=card.front;$('#cardBack').textContent=card.back;$('#showAnswerBtn').disabled=false;}
  else{$('#cardSubject').textContent='Sem cartões';$('#cardInterval').textContent='—';$('#cardFront').textContent='Crie seu primeiro cartão de revisão.';$('#cardBack').textContent='';$('#showAnswerBtn').disabled=true;}
  $('#reviewQueue').innerHTML=state.cards.slice().sort((a,b)=>a.nextReview.localeCompare(b.nextReview)).slice(0,8).map(c=>`<div class="table-row"><div><b>${esc(c.subject)}</b><br><small>${esc(c.front)}</small></div><span>${c.nextReview<=isoDate()?'Hoje':localDate(c.nextReview)}</span><span>${c.interval} dias</span><button class="text-btn" data-delete-card="${c.id}">Excluir</button></div>`).join('')||'<p class="muted">Nenhum cartão cadastrado.</p>';
}
function rateCard(quality){
  const list=dueCards().length?dueCards():state.cards;const card=list[currentCardIndex]||list[0];if(!card)return;
  mutate(()=>{
    if(quality===1){card.repetitions=0;card.interval=0;card.nextReview=isoDate(new Date(Date.now()+10*60000));}
    else if(quality===2){card.interval=1;card.repetitions=Math.max(1,card.repetitions);card.efactor=Math.max(1.3,card.efactor-.15);card.nextReview=isoDate(new Date(Date.now()+DAY));}
    else {card.repetitions++; if(card.repetitions===1)card.interval=1;else if(card.repetitions===2)card.interval=3;else card.interval=Math.round(Math.max(4,card.interval*card.efactor*(quality===4?1.25:1)));card.efactor=Math.max(1.3,card.efactor+(quality===4?.12:.03));card.nextReview=isoDate(new Date(Date.now()+card.interval*DAY));}
    card.lastQuality=quality; currentCardIndex=0;
  });
}

function renderMocks(){
  $('#mockHistory').innerHTML=state.mocks.slice().reverse().slice(0,6).map(m=>`<div class="mock-item"><div><h4>${esc(m.subject)} • ${new Date(m.date).toLocaleDateString('pt-BR')}</h4><small class="muted">${m.correct}/${m.total} acertos • ${m.minutes} min</small></div><div class="mock-score">${Math.round(m.correct/m.total*100)}%</div></div>`).join('')||'<p class="muted">Faça seu primeiro simulado para gerar tendências.</p>';
  $('#officialExams').innerHTML=OFFICIAL_RESOURCES[state.exam].map(r=>`<div class="resource-card"><span class="resource-icon">${r.icon}</span><h4>${r.title}</h4><p>${r.desc}</p><a href="${r.url}" target="_blank" rel="noopener">Abrir fonte oficial ↗</a></div>`).join('');
}

function openQuiz(subject,qty,minutes){
  let bank=QUIZ_BANK.filter(q=>q.exam===state.exam&&(subject==='Todas'||q.subject===subject));
  if(!bank.length)bank=QUIZ_BANK.filter(q=>q.exam===state.exam);
  const questions=Array.from({length:Math.min(qty,Math.max(qty,bank.length))},(_,i)=>({...bank[i%bank.length],instance:i}));
  const html=`<span class="section-kicker">Simulado rápido</span><h2>${subject}</h2><p class="muted">${questions.length} questões • tempo sugerido: ${minutes} min</p><form id="quizForm">${questions.map((q,i)=>`<div class="quiz-question"><b>${i+1}. ${q.q}</b>${q.options.map((o,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}" required> ${o}</label>`).join('')}</div>`).join('')}<button class="primary-btn full" type="submit">Finalizar e corrigir</button></form>`;
  openModal(html);
  $('#quizForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);let correct=0;questions.forEach((q,i)=>{if(Number(fd.get('q'+i))===q.answer)correct++});state.mocks.push({id:uid(),date:new Date().toISOString(),subject,total:questions.length,correct,minutes});const topic=state.topics.find(t=>t.subject===subject)||state.topics[0];if(topic){topic.questions+=questions.length;topic.accuracy=Math.round(((topic.accuracy*(topic.questions-questions.length))+correct*100)/topic.questions)}saveState();$('#modalContent').innerHTML=`<div class="empty-state"><span>🎯</span><h2>${correct}/${questions.length} acertos</h2><p>${Math.round(correct/questions.length*100)}% de aproveitamento. Registre os erros e revise os conceitos associados.</p><button class="primary-btn" data-close-modal>Fechar</button></div>`;renderAll();});
}

function renderVideos(filter='Todas'){
  const videos=VIDEOS.filter(v=>v.exam===state.exam);
  const cats=['Todas',...new Set(videos.map(v=>v.subject))];
  $('#videoFilters').innerHTML=cats.map(c=>`<button class="chip ${c===filter?'active':''}" data-video-filter="${c}">${c}</button>`).join('');
  const term=($('#videoSearch').value||'').toLowerCase();
  const shown=videos.filter(v=>(filter==='Todas'||v.subject===filter)&&`${v.title} ${v.channel} ${v.subject}`.toLowerCase().includes(term));
  $('#videoLibrary').innerHTML=shown.map(v=>`<article class="video-card"><div class="video-thumb">${v.id?`<img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="Miniatura da aula ${v.title}" loading="lazy">`:''}<span class="play-icon">▶</span></div><div class="video-info"><div class="tags"><span class="mini-tag">${v.subject}</span>${v.tags.map(t=>`<span class="mini-tag">${t}</span>`).join('')}</div><h3>${v.title}</h3><p>${v.channel}</p><div class="video-actions"><a href="${v.url}" target="_blank" rel="noopener">Assistir gratuitamente ↗</a><button data-watched-video="${v.url}" title="Marcar como assistida">${state.watchedVideos.includes(v.url)?'✓ Assistida':'○ Marcar'}</button></div></div></article>`).join('')||'<div class="empty-state"><h3>Nenhuma aula encontrada.</h3></div>';
}

function renderErrors(){
  $('#errorNotebook').innerHTML=state.errors.slice().reverse().map(e=>`<div class="table-row"><div><b>${esc(e.subject)} — ${esc(e.topic)}</b><br><small>${esc(e.reason)}</small></div><span>${localDate(e.date)}</span><span>revisar</span><button class="text-btn" data-error-to-card="${e.id}">Criar cartão</button></div>`).join('')||'<p class="muted">Registre erros de questões para identificar padrões.</p>';
}

function recordSessionInState(minutes,subject='Foco livre'){
  state.sessions.push({id:uid(),date:new Date().toISOString(),minutes,subject});
  const today=isoDate();
  if(state.lastStudyDate!==today){const yesterday=isoDate(new Date(Date.now()-DAY));state.streak=state.lastStudyDate===yesterday?(state.streak||0)+1:1;state.lastStudyDate=today;}
}
function registerSession(minutes,subject='Foco livre'){ recordSessionInState(minutes,subject);saveState();renderAll(); }

function showAnswer(){ $('#cardBack').classList.remove('hidden');$('#answerActions').classList.remove('hidden');$('#showAnswerBtn').classList.add('hidden');$('#cardSideLabel').textContent='RESPOSTA'; }
function openModal(html){$('#modalContent').innerHTML=html;$('#genericModal').classList.add('open');$('#genericModal').setAttribute('aria-hidden','false');}
function closeModal(){ $('#genericModal').classList.remove('open');$('#genericModal').setAttribute('aria-hidden','true'); }
function toast(msg){const t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',right:'20px',bottom:'20px',zIndex:100,background:'#111a2d',color:'#fff',border:'1px solid #34405b',padding:'12px 16px',borderRadius:'12px',boxShadow:'0 12px 35px rgba(0,0,0,.35)'});document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}

function addCardModal(){
  const subjects=Object.keys(EXAM_DATA[state.exam].subjects);
  openModal(`<span class="section-kicker">Revisão espaçada</span><h2>Novo cartão</h2><form id="cardForm" class="essay-form"><label>Matéria<select name="subject">${subjects.map(s=>`<option>${s}</option>`).join('')}</select></label><label>Pergunta<textarea name="front" rows="4" required placeholder="Use uma pergunta que obrigue você a recuperar a resposta."></textarea></label><label>Resposta<textarea name="back" rows="5" required></textarea></label><button class="primary-btn" type="submit">Adicionar à revisão</button></form>`);
  $('#cardForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);state.cards.push({id:uid(),subject:fd.get('subject'),front:fd.get('front'),back:fd.get('back'),interval:0,efactor:2.5,repetitions:0,nextReview:isoDate(),lastQuality:null});saveState();closeModal();renderReview();toast('Cartão adicionado.');});
}

function addStudyBlockModal(){
  const subjects=Object.keys(EXAM_DATA[state.exam].subjects);
  openModal(`<span class="section-kicker">Planejamento</span><h2>Novo bloco de estudo</h2><form id="blockForm" class="form-grid"><label>Data<input name="date" type="date" value="${isoDate()}" required></label><label>Horário<input name="time" type="time" value="19:00" required></label><label>Matéria<select name="subject">${subjects.map(s=>`<option>${s}</option>`).join('')}</select></label><label>Duração<input name="duration" type="number" value="50" min="10" required></label><label class="full-field">Assunto<input name="topic" required></label><button class="primary-btn full-field">Adicionar</button></form>`);
  $('#blockForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);state.schedule.push({id:uid(),date:fd.get('date'),time:fd.get('time'),duration:Number(fd.get('duration')),subject:fd.get('subject'),topic:fd.get('topic'),type:'Estudo',done:false});saveState();closeModal();renderSchedule();toast('Bloco adicionado.');});
}

async function readEssayFile(file){
  if(!file)return null;if(file.size>8*1024*1024)throw new Error('O arquivo ultrapassa 8 MB.');
  if(file.type==='text/plain')return {type:'text',content:await file.text()};
  if(file.type.startsWith('image/'))return {type:'image',content:await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})};
  throw new Error('Formato não suportado. Use JPG, PNG, WEBP ou TXT.');
}

function renderCorrection(data){
  const criteria=Array.isArray(data.criterios)?data.criterios:[];
  const score=esc(data.nota_aproximada??'—');
  $('#essayResult').innerHTML=`<div class="result-score"><div><p>Nota aproximada — ${esc(data.modelo||essayModel)}</p><strong>${score}${essayModel==='ENEM'?'/1000':'/10'}</strong></div><div><p>Nível geral</p><b>${esc(data.nivel_geral||'Análise concluída')}</b></div></div>${data.diagnostico_geral?`<div class="result-section"><h3>Diagnóstico geral</h3><p>${esc(data.diagnostico_geral)}</p></div>`:''}<div class="result-section"><h3>Critérios avaliados</h3>${criteria.map(c=>`<div class="criterion"><div class="criterion-head"><h4>${esc(c.nome)}</h4><b>${esc(c.nota??'—')}${essayModel==='ENEM'?'/200':'/2'}</b></div><p>${esc(c.analise||'')}</p>${c.como_melhorar?`<small><b>Como melhorar:</b> ${esc(c.como_melhorar)}</small>`:''}</div>`).join('')}</div>${listSection('Pontos fortes',data.pontos_fortes)}${listSection('Prioridades de melhoria',data.prioridades_melhoria)}${listSection('Erros linguísticos e correções',data.erros_linguisticos)}${data.plano_de_reescrita?`<div class="result-section"><h3>Plano de reescrita</h3><div class="rewrite-box">${esc(data.plano_de_reescrita)}</div></div>`:''}${data.exemplo_melhoria?`<div class="result-section"><h3>Exemplo de trecho melhorado</h3><div class="rewrite-box">${esc(data.exemplo_melhoria)}</div></div>`:''}<p class="disclaimer">Estimativa pedagógica gerada por IA. A nota oficial depende dos corretores e das regras da banca na edição da prova.</p>`;
}
function listSection(title,items){return Array.isArray(items)&&items.length?`<div class="result-section"><h3>${esc(title)}</h3><ul>${items.map(i=>`<li>${esc(typeof i==='string'?i:(i.erro?`${i.erro} → ${i.correcao||''}${i.explicacao?` — ${i.explicacao}`:''}`:JSON.stringify(i)))}</li>`).join('')}</ul></div>`:''}

async function submitEssay(e){
  e.preventDefault();
  const text=$('#essayText').value.trim(); if(!text&&!essayFileData){toast('Cole o texto ou anexe uma foto.');return;}
  $('#essayEmpty').classList.add('hidden');$('#essayResult').classList.add('hidden');$('#essayLoading').classList.remove('hidden');$('#correctEssayBtn').disabled=true;
  try{
    const payload={model:essayModel,theme:$('#essayTheme').value.trim(),text};
    if(essayFileData?.type==='image')payload.image=essayFileData.content;
    if(essayFileData?.type==='text')payload.text=[text,essayFileData.content].filter(Boolean).join('\n\n');
    const res=await fetch('/api/corrigir-redacao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json(); if(!res.ok)throw new Error(data.error||'Falha na correção.');
    renderCorrection(data);$('#essayResult').classList.remove('hidden');
  }catch(err){$('#essayEmpty').classList.remove('hidden');$('#essayEmpty').innerHTML=`<span>!</span><h3>Não foi possível corrigir</h3><p>${err.message}</p><p class="muted">Confira a variável OPENAI_API_KEY na Vercel e tente novamente.</p>`;}
  finally{$('#essayLoading').classList.add('hidden');$('#correctEssayBtn').disabled=false;}
}

function startTimer(){
  if(timerId){clearInterval(timerId);timerId=null;$('#timerStart').textContent='Continuar';return;}
  $('#timerStart').textContent='Pausar';timerId=setInterval(()=>{timerSeconds--;renderTimer();if(timerSeconds<=0){clearInterval(timerId);timerId=null;registerSession(Number($('.timer-presets .active').dataset.minutes));toast('Bloco concluído. Faça uma pausa e registre o que aprendeu.');timerSeconds=0;renderTimer();}},1000);
}
function renderTimer(){const m=Math.floor(timerSeconds/60),s=timerSeconds%60;$('#timerDisplay').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`focovest-${state.exam.toLowerCase()}-${isoDate()}.json`;a.click();URL.revokeObjectURL(a.href);}

// Eventos
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
document.addEventListener('click',e=>{
  const open=e.target.closest('[data-open-view]');if(open)navigate(open.dataset.openView);
  if(e.target.matches('[data-close-modal]')||e.target.closest('[data-close-modal]'))closeModal();
  const tab=e.target.closest('[data-subject-tab]');if(tab){activeSubject=tab.dataset.subjectTab;renderTopics();}
  const step=e.target.closest('[data-topic]');if(step)toggleTopic(step.dataset.topic,Number(step.dataset.step));
  const toggle=e.target.closest('[data-toggle-schedule]');if(toggle){const id=toggle.dataset.toggleSchedule;if(id==='suggested'){addStudyBlockModal();return;}mutate(()=>{const s=state.schedule.find(x=>x.id===id);s.done=!s.done;if(s.done)recordSessionInState(s.duration,s.subject)});}
  const vf=e.target.closest('[data-video-filter]');if(vf)renderVideos(vf.dataset.videoFilter);
  const w=e.target.closest('[data-watched-video]');if(w)mutate(()=>{const u=w.dataset.watchedVideo;state.watchedVideos=state.watchedVideos.includes(u)?state.watchedVideos.filter(x=>x!==u):[...state.watchedVideos,u]});
  const q=e.target.closest('[data-quality]');if(q)rateCard(Number(q.dataset.quality));
  const del=e.target.closest('[data-delete-card]');if(del)mutate(()=>state.cards=state.cards.filter(c=>c.id!==del.dataset.deleteCard));
  const err=e.target.closest('[data-error-to-card]');if(err){const x=state.errors.find(a=>a.id===err.dataset.errorToCard);state.cards.push({id:uid(),subject:x.subject,front:`Qual erro devo evitar em ${x.topic}?`,back:x.reason,interval:0,efactor:2.5,repetitions:0,nextReview:isoDate(),lastQuality:null});saveState();toast('Cartão criado a partir do erro.');}
  const ef=e.target.closest('[data-week-filter]');if(ef){$$('[data-week-filter]').forEach(x=>x.classList.remove('active'));ef.classList.add('active');renderSchedule(ef.dataset.weekFilter);}
});
$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#quickSwitchExam').addEventListener('click',()=>{const next=state.exam==='ENEM'?'ITA':'ENEM';if(confirm(`Trocar para ${next}? O plano atual será substituído, mas simulados e registros continuarão salvos.`))switchExam(next)});
$('#examSelect').addEventListener('change',e=>switchExam(e.target.value));
$('#planForm').addEventListener('submit',e=>{e.preventDefault();generatePlan()});
$('#topicSearch').addEventListener('input',renderTopics);
$('#videoSearch').addEventListener('input',()=>renderVideos($('#videoFilters .chip.active')?.dataset.videoFilter||'Todas'));
$('#showAnswerBtn').addEventListener('click',showAnswer);
$('#newCardBtn').addEventListener('click',addCardModal);
$('#addStudyBlock').addEventListener('click',addStudyBlockModal);
$('#startQuickQuiz').addEventListener('click',()=>openQuiz('Todas',5,15));
$('#mockForm').addEventListener('submit',e=>{e.preventDefault();openQuiz($('#mockSubject').value,Number($('#mockQuestions').value),Number($('#mockTime').value))});
$$('#essayModelTabs button').forEach(b=>b.addEventListener('click',()=>{$$('#essayModelTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');essayModel=b.dataset.model;}));
$('#essayFile').addEventListener('change',async e=>{try{const f=e.target.files[0];essayFileData=await readEssayFile(f);$('#fileName').textContent=f?`Selecionado: ${f.name}`:'';}catch(err){toast(err.message);e.target.value='';essayFileData=null;}});
$('#essayForm').addEventListener('submit',submitEssay);
$('#errorForm').addEventListener('submit',e=>{e.preventDefault();state.errors.push({id:uid(),date:isoDate(),subject:$('#errorSubject').value,topic:$('#errorTopic').value,reason:$('#errorReason').value});e.target.reset();saveState();renderErrors();toast('Erro registrado.');});
$('#saveBlankPage').addEventListener('click',()=>{const text=$('#blankPage').value.trim();if(!text)return toast('Escreva sua autoexplicação primeiro.');state.notes.push({id:uid(),date:new Date().toISOString(),text});saveState();toast('Autoexplicação salva.');});
$$('.timer-presets button').forEach(b=>b.addEventListener('click',()=>{$$('.timer-presets button').forEach(x=>x.classList.remove('active'));b.classList.add('active');timerSeconds=Number(b.dataset.minutes)*60;if(timerId){clearInterval(timerId);timerId=null}$('#timerStart').textContent='Iniciar';renderTimer()}));
$('#timerStart').addEventListener('click',startTimer);$('#timerReset').addEventListener('click',()=>{if(timerId)clearInterval(timerId);timerId=null;timerSeconds=Number($('.timer-presets .active').dataset.minutes)*60;$('#timerStart').textContent='Iniciar';renderTimer()});
$('#exportData').addEventListener('click',()=>openModal(`<span class="section-kicker">Seus dados</span><h2>Backup do progresso</h2><p class="muted">Exporte um arquivo JSON para guardar ou transferir seu progresso. Também é possível importar um backup.</p><div class="hero-actions"><button class="primary-btn" id="doExport">Baixar backup</button><button class="secondary-btn" id="doImport">Importar backup</button></div>`));
document.addEventListener('click',e=>{if(e.target.id==='doExport'){exportData();closeModal()}if(e.target.id==='doImport')$('#importFile').click()});
$('#importFile').addEventListener('change',async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!data.exam||!data.topics)throw new Error();state=data;saveState();renderAll();closeModal();toast('Backup importado.');}catch{toast('Arquivo de backup inválido.')}});

renderAll();
