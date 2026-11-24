import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Code2, Cpu, Database, FileCode2, GraduationCap, Layers3, Lightbulb, ListChecks, Menu, Play, RotateCcw, Search, Sparkles, Target, X, XCircle } from 'lucide-react';
import { courses, getQuestions } from './data';
import { deepDives } from './deepDive';
import { VisualGuide } from './VisualGuide';
import { LessonLab } from './LessonLab';
import './style.css';

const courseFromHash = () => location.hash.includes('tempo_real') ? 'tempo_real' : location.hash.includes('embarcados') ? 'embarcados' : location.hash.includes('linguagens') ? 'linguagens' : 'compiladores';

function App() {
  const [courseKey, setCourseKey] = useState(courseFromHash);
  const [tab, setTab] = useState('visao');
  const [topicId, setTopicId] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('todos');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compilalab-answers') || '{}'); } catch { return {}; }
  });
  const course = courses[courseKey];
  const questions = useMemo(() => getQuestions(courseKey), [courseKey]);
  const filteredQuestions = useMemo(() => questions.filter(q => filter === 'todos' || q.topic === filter), [questions, filter]);
  const current = filteredQuestions[Math.min(questionIndex, filteredQuestions.length - 1)];
  const currentAnswer = current ? answers[current.id] : undefined;
  const totalAnswered = questions.filter(q => answers[q.id] !== undefined).length;
  const totalCorrect = questions.filter(q => answers[q.id] === q.correct).length;
  const progress = Math.round((totalAnswered / questions.length) * 100);
  const visibleTopics = course.topics.filter(t => `${t.title} ${t.short} ${t.summary}`.toLowerCase().includes(query.toLowerCase()));
  const selectedTopic = course.topics.find(t => t.id === topicId);

  useEffect(() => {
    const onHash = () => { setCourseKey(courseFromHash()); setTopicId(null); setFilter('todos'); setQuestionIndex(0); setTab('visao'); };
    window.addEventListener('hashchange', onHash);
    if (!location.hash) history.replaceState(null, '', '#/compiladores');
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { localStorage.setItem('compilalab-answers', JSON.stringify(answers)); }, [answers]);
  useEffect(() => { document.title = `${course.title} — CompilaLab`; }, [course.title]);

  function switchCourse(key) {
    if (key === courseKey) { setMobileMenu(false); return; }
    location.hash = `/${key}`;
    setMobileMenu(false);
  }
  function openTopic(id) { setTopicId(id); setTab('conteudo'); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function startQuiz(id = 'todos') { setTopicId(null); setFilter(id); setQuestionIndex(0); setTab('questoes'); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function choose(index) { if (currentAnswer !== undefined) return; setAnswers(prev => ({ ...prev, [current.id]: index })); }
  function reveal() { if (currentAnswer !== undefined) return; setAnswers(prev => ({ ...prev, [current.id]: -1 })); }
  function resetCourse() { setAnswers(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => !id.startsWith(`${courseKey}-`)))); setQuestionIndex(0); }
  function selectFilter(id) { setFilter(id); setQuestionIndex(0); }
  const topicName = id => course.topics.find(t => t.id === id)?.title || '';

  return <div className={`app ${course.accent}`}>
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand"><span className="brand-icon"><Code2 size={24} strokeWidth={2.5}/></span><span>compila<span className="brand-accent">lab</span><small>SEU ESPAÇO DE REVISÃO</small></span><button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={20}/></button></div>
      <div className="sidebar-label">SUAS MATÉRIAS</div>
      <nav className="course-nav" aria-label="Matérias">
        <button className={courseKey === 'compiladores' ? 'active' : ''} onClick={() => switchCourse('compiladores')}><span className="nav-icon"><Layers3 size={19}/></span><span>Compiladores<small>7 tópicos de revisão</small></span></button>
        <button className={courseKey === 'linguagens' ? 'active' : ''} onClick={() => switchCourse('linguagens')}><span className="nav-icon"><FileCode2 size={19}/></span><span>Linguagens de<br/>Programação<small>Baseado na sua prova</small></span></button>
        <button className={courseKey === 'embarcados' ? 'active' : ''} onClick={() => switchCourse('embarcados')}><span className="nav-icon"><Cpu size={19}/></span><span>Sistemas Embarcados<small>Carro e Simon Says</small></span></button>
        <button className={courseKey === 'tempo_real' ? 'active' : ''} onClick={() => switchCourse('tempo_real')}><span className="nav-icon"><Target size={19}/></span><span>Programação em<br/>Tempo Real<small>12 experimentos ESP32-S3</small></span></button>
      </nav>
      <div className="sidebar-divider"/>
      <div className="sidebar-label">NESTA MATÉRIA</div>
      <nav className="section-nav" aria-label="Seções da matéria">
        <button className={tab === 'visao' ? 'selected' : ''} onClick={() => { setTab('visao'); setTopicId(null); setMobileMenu(false); }}><BookOpen size={18}/> Visão geral</button>
        <button className={tab === 'conteudo' ? 'selected' : ''} onClick={() => { setTab('conteudo'); setTopicId(course.topics[0].id); setMobileMenu(false); }}><Layers3 size={18}/> Conteúdo</button>
        <button className={tab === 'questoes' ? 'selected' : ''} onClick={() => startQuiz()}><ListChecks size={18}/> Questões</button>
      </nav>
      <div className="sidebar-bottom"><div className="mini-icon"><GraduationCap size={21}/></div><strong>Estude no seu ritmo</strong><p>Seu progresso nas questões fica salvo neste navegador.</p></div>
    </aside>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"/>}
    <main className="main">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={22}/></button><div className="crumb">Área de estudo <ChevronRight size={15}/> <strong>{course.title}</strong></div><div className="topbar-right"><span className="course-tag"><span/> {courseKey === 'compiladores' ? 'COMPILADORES' : courseKey === 'linguagens' ? 'LINGUAGENS' : courseKey === 'embarcados' ? 'EMBARCADOS' : 'TEMPO REAL'}</span><span className="avatar">CL</span></div></header>
      <div className="content">
        {tab === 'visao' && <>
          <section className="hero"><div className="hero-content"><div className="eyebrow"><Sparkles size={15}/> {course.eyebrow}</div><h1>Domine <em>{course.title}.</em><br/><span>Uma questão de cada vez.</span></h1><p>{course.description}</p><div className="hero-actions"><button className="primary-button" onClick={() => openTopic(course.topics[0].id)}><BookOpen size={18}/> Começar revisão</button><button className="ghost-button" onClick={() => startQuiz()}><Play size={17} fill="currentColor"/> Praticar questões</button></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="code-card"><div className="code-dots"><i/><i/><i/></div><div><span>function</span> estudar() {'{'}</div><div className="code-indent"><span>const</span> foco = <b>true</b>;</div><div className="code-indent">return <strong>"aprovado"</strong>;</div><div>{'}'}</div></div><div className="art-chip"><Check size={16}/> aprendizado.exe</div></div></section>
          <section className="stats" aria-label="Resumo da matéria"><div><span className="stat-icon peach"><BookOpen size={20}/></span><span><strong>{course.topics.length}</strong><small>Tópicos de estudo</small></span></div><div><span className="stat-icon violet"><CircleHelp size={20}/></span><span><strong>{questions.length}</strong><small>Questões comentadas</small></span></div><div><span className="stat-icon green"><Target size={20}/></span><span><strong>{totalAnswered}/{questions.length}</strong><small>Questões respondidas</small></span></div><div><span className="stat-icon blue"><CheckCircle2 size={20}/></span><span><strong>{totalCorrect}</strong><small>Acertos</small></span></div></section>
          <div className="section-heading"><div><span className="kicker">SEU ROTEIRO</span><h2>O que vamos estudar</h2><p>Escolha um tema para ver teoria, exemplos e pontos importantes para a prova.</p></div><div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar tópico..." aria-label="Buscar tópico"/></div></div>
          <div className="topic-grid">{visibleTopics.map((t, i) => <button className="topic-card" key={t.id} onClick={() => openTopic(t.id)}><div className="card-top"><span className={`topic-icon tone-${i % 4}`}><TopicIcon i={i}/></span><span className="topic-number">{t.icon}</span></div><h3>{t.title}</h3><p>{t.short}</p><div className="card-bottom"><span><BookOpen size={15}/> {t.points.length} conceitos</span><span>{t.time} <ChevronRight size={17}/></span></div></button>)}</div>
          {visibleTopics.length === 0 && <p className="empty">Nenhum tópico encontrado. Tente outro termo.</p>}
          <section className="study-banner"><div className="banner-symbol"><Lightbulb size={26}/></div><div><strong>{courseKey === 'linguagens' ? 'Estudo guiado pela devolutiva' : courseKey === 'embarcados' ? 'Do circuito ao código' : courseKey === 'tempo_real' ? 'Do requisito à medição' : 'Prática que fixa o conteúdo'}</strong><p>{courseKey === 'linguagens' ? 'As questões discursivas da prova viraram revisão objetiva e exercícios de múltipla escolha.' : courseKey === 'embarcados' ? 'Compare os dois projetos enviados, entenda os componentes e pratique a lógica que controla cada circuito.' : courseKey === 'tempo_real' ? 'Revise os 12 experimentos do guia: defina prazos, provoque carga, meça resultados e explique falhas.' : 'Depois da teoria, teste seu entendimento e veja por que cada resposta está certa.'}</p></div><button onClick={() => startQuiz()}>Ir para questões <ChevronRight size={18}/></button></section>
        </>}
        {tab === 'conteudo' && selectedTopic && <>
          <button className="back-link" onClick={() => { setTab('visao'); setTopicId(null); }}><ChevronLeft size={18}/> Voltar aos tópicos</button>
          <div className="article-layout"><article className="article"><div className="article-header"><span className="article-badge">TÓPICO {selectedTopic.icon} / {course.topics.length}</span><h1>{selectedTopic.title}</h1><p>{selectedTopic.summary}</p><div className="article-meta"><span><BookOpen size={16}/> {selectedTopic.points.length} conceitos</span><span>•</span><span>{selectedTopic.time} de leitura</span></div></div>
            <div className="article-body"><h2>Entenda o essencial</h2>{selectedTopic.points.map(([heading, body], i) => <section className="concept" key={heading}><span className="concept-index">{String(i+1).padStart(2,'0')}</span><div><h3>{heading}</h3><p>{body}</p></div></section>)}<VisualGuide key={`${courseKey}-${selectedTopic.id}`} course={courseKey} topic={selectedTopic.id}/><LessonLab key={`lab-${courseKey}-${selectedTopic.id}`} course={courseKey} topic={selectedTopic.id}/>{deepDives[courseKey]?.[selectedTopic.id] && <section className="deep-dive"><span className="kicker">APROFUNDE O RACIOCÍNIO</span><h2>{deepDives[courseKey][selectedTopic.id].title}</h2><p>{deepDives[courseKey][selectedTopic.id].detail}</p><div className="deep-steps"><h3>Como resolver na prova</h3><ol>{deepDives[courseKey][selectedTopic.id].steps.map((step, i) => <li key={i}>{step}</li>)}</ol></div><p className="deep-watch"><strong>Atenção:</strong> {deepDives[courseKey][selectedTopic.id].watch}</p></section>}<div className="example"><div><Code2 size={18}/> EXEMPLO PRÁTICO</div><pre>{selectedTopic.example}</pre></div><div className="takeaway"><Lightbulb size={22}/><div><strong>Para lembrar na prova</strong><p>{selectedTopic.takeaway}</p></div></div></div>
            <div className="article-footer"><button className="primary-button" onClick={() => startQuiz(selectedTopic.id)}>Praticar este tópico <ChevronRight size={18}/></button><button className="outline-button" onClick={() => { const i = course.topics.findIndex(t => t.id === selectedTopic.id); openTopic(course.topics[(i+1)%course.topics.length].id); }}>Próximo tópico <ChevronRight size={18}/></button></div></article>
            <aside className="article-toc"><span className="kicker">NESTA MATÉRIA</span><h3>Tópicos</h3>{course.topics.map(t => <button key={t.id} className={t.id === topicId ? 'active' : ''} onClick={() => openTopic(t.id)}><span>{t.icon}</span>{t.title}</button>)}</aside></div>
        </>}
        {tab === 'questoes' && <>
          <div className="quiz-heading"><div><span className="kicker">HORA DE PRATICAR</span><h1>Questões comentadas<span className="title-dot">.</span></h1><p>Escolha uma alternativa. Você verá na hora se acertou, a resposta correta e o motivo.</p></div><button className="reset-button" onClick={resetCourse}><RotateCcw size={17}/> Reiniciar respostas</button></div>
          <div className="quiz-layout"><div className="quiz-main"><div className="filter-row"><label htmlFor="topic-filter">Filtrar por tema</label><div className="select-wrap"><select id="topic-filter" value={filter} onChange={e => selectFilter(e.target.value)}><option value="todos">Todos os temas ({questions.length})</option>{course.topics.map(t => <option key={t.id} value={t.id}>{t.title} ({questions.filter(q => q.topic === t.id).length})</option>)}</select><ChevronDown size={17}/></div></div>
            <div className="question-card" key={current.id}><div className="question-top"><span className="question-label">QUESTÃO {questionIndex + 1} DE {filteredQuestions.length}</span><span className="question-topic">{topicName(current.topic)}</span></div><div className="question-progress"><span style={{width: `${((questionIndex+1)/filteredQuestions.length)*100}%`}}/></div><h2>{current.prompt}</h2><p className="choose-label">Selecione uma alternativa:</p><div className="options">{current.options.map((option, index) => { const answered = currentAnswer !== undefined; const isCorrect = index === current.correct; const isChosen = index === currentAnswer; const state = answered && isCorrect ? 'correct' : answered && isChosen ? 'incorrect' : ''; return <button key={index} className={`option ${state}`} onClick={() => choose(index)} disabled={answered} aria-label={`Alternativa ${String.fromCharCode(65+index)}: ${option}`}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answered && isCorrect && <CheckCircle2 size={21}/ >}{answered && isChosen && !isCorrect && <XCircle size={21}/>}</button>; })}</div>
              {currentAnswer === undefined ? <button className="reveal-button" onClick={reveal}><CircleHelp size={17}/> Ver resposta certa e explicação</button> : <div className={`feedback ${currentAnswer === current.correct ? 'success' : 'error'}`} role="status"><div className="feedback-title">{currentAnswer === current.correct ? <><CheckCircle2 size={22}/> Resposta correta!</> : currentAnswer === -1 ? <><Lightbulb size={22}/> Resposta revelada</> : <><XCircle size={22}/> Ainda não. Veja a resposta certa.</>}</div><p><strong>Alternativa correta: {String.fromCharCode(65 + current.correct)}.</strong> {current.options[current.correct]}</p><p>{current.explanation}</p></div>}
              <div className="question-actions"><button className="outline-button" onClick={() => setQuestionIndex(i => Math.max(0, i-1))} disabled={questionIndex === 0}><ChevronLeft size={18}/> Anterior</button><button className="primary-button" onClick={() => setQuestionIndex(i => Math.min(filteredQuestions.length-1, i+1))} disabled={questionIndex === filteredQuestions.length-1}>Próxima questão <ChevronRight size={18}/></button></div></div>
          </div><aside className="quiz-side"><div className="progress-card"><div className="progress-icon"><Target size={22}/></div><span className="kicker">SEU PROGRESSO</span><div className="progress-value">{progress}<small>%</small></div><div className="progress-track"><span style={{width:`${progress}%`}}/></div><p>{totalAnswered} de {questions.length} questões respondidas</p><div className="progress-score"><CheckCircle2 size={17}/> {totalCorrect} acertos</div></div><div className="navigator"><h3>Navegar pelas questões</h3><p>Selecione uma questão para revisar.</p><div>{filteredQuestions.map((q,i) => <button key={q.id} onClick={() => setQuestionIndex(i)} className={`${i === questionIndex ? 'current' : ''} ${answers[q.id] !== undefined ? (answers[q.id] === q.correct ? 'done-correct' : 'done-wrong') : ''}`} aria-label={`Questão ${i+1}`}>{i+1}</button>)}</div><div className="nav-legend"><span><i className="legend-correct"/> Certa</span><span><i className="legend-wrong"/> Errada/revelada</span></div></div></aside></div>
        </>}
      </div>
      <footer className="footer"><span>compila<strong>lab</strong> · Seu espaço de revisão</span><span>Feito para estudar com clareza.</span></footer>
    </main>
  </div>;
}
function TopicIcon({i}) { return [<Layers3 size={24}/>,<Database size={24}/>,<Sparkles size={24}/>,<Code2 size={24}/>][i % 4]; }
createRoot(document.getElementById('root')).render(<><App/><Analytics/></>);
