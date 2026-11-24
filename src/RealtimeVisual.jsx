import React, { useState } from 'react';
import { Activity, ChevronRight, Clock3, Cpu } from 'lucide-react';
import './realtimeVisual.css';

const flows = {
  dualcore: { title:'Separe e compare os núcleos', nodes:[['Controle','núcleo 1 · 10 ms'],['Comunicação','núcleo 0 · fila'],['IA','núcleo 0 · 100 ms'],['Comparação','jitter e perdas']] },
  sincronizacao: { title:'Quando o produtor é mais rápido', nodes:[['Produtor','uma amostra / 20 ms'],['Fila','5 posições'],['Consumidor','orientado a dados'],['Backpressure','esperar ou descartar']] },
  interrupcoes: { title:'Evento crítico até a saída', nodes:[['Botão','borda elétrica'],['ISR curta','notificação FromISR'],['Tarefa','verifica e atua'],['Estado seguro','medir latência']] },
  classificacao: { title:'Da amostra à decisão de IA', nodes:[['MPU6050','20 ms por amostra'],['Janela','32 amostras'],['Atributos','RMS + pico'],['Inferência','D=100 ms']] },
  anomalias: { title:'Como nasce o alarme', nodes:[['Sinais','vibração + temperatura'],['Normalizar','mesma escala'],['Diagnóstico','escore + limiar'],['Alarme','medir atraso']] },
  robo: { title:'Do obstáculo à frenagem', nodes:[['Percepção','distância · 50 ms'],['Decisão','estado · 20 ms'],['Atuação','motor · 10 ms'],['Resposta','latência total']] },
  pid: { title:'O ciclo de controle', nodes:[['Referência','setpoint'],['Erro','referência − medida'],['PID','P + I + D'],['Planta','saída e realimentação']] },
  fusao: { title:'Dois sensores, um ângulo', nodes:[['Giroscópio','rápido, com deriva'],['Acelerômetro','referência ruidosa'],['Filtro','α e Δt real'],['Mailbox','ângulo recente']] },
  mqtt: { title:'Controle protegido da rede', nodes:[['Sensor','temperatura'],['Controle local','alarme sem broker'],['Fila','telemetria limitada'],['MQTT','publica se disponível']] },
  automacao: { title:'Precedência dos estados', nodes:[['Sensores','valor + timestamp'],['Validade','idade do dado'],['Decisão','SEGURO > ALARME'],['Saídas','relé · luz · buzzer']] }
};

function PeriodicTimeline() {
  const [execution, setExecution] = useState(80);
  const scale = 490 / 3000;
  const x = time => 76 + time * scale;
  const rows = [
    { label:'Atraso relativo', y:75, color:'#ee9a79', starts:Array.from({length:4},(_,i)=>i*(500+execution)) },
    { label:'Liberação absoluta', y:150, color:'#3bb4a5', starts:Array.from({length:4},(_,i)=>i*500) }
  ];
  return <section className="rt-visual" aria-label="Simulador de periodicidade">
    <div className="rt-visual-head"><Clock3 size={21}/><div><span>SIMULAÇÃO INTERATIVA</span><h2>De onde vem a deriva?</h2><p>T = 500 ms · D = 250 ms. Ajuste o tempo de execução C de cada ciclo.</p></div></div>
    <label className="rt-slider">Execução C <strong>{execution} ms</strong><input type="range" min="40" max="320" step="20" value={execution} onChange={e=>setExecution(Number(e.target.value))} aria-label="Tempo de execução de cada tarefa em milissegundos"/></label>
    <div className="rt-chart"><svg viewBox="0 0 610 220" role="img" aria-label={`Linha do tempo com execução de ${execution} milissegundos. Atraso relativo deriva ${execution} milissegundos por ciclo. ${execution > 250 ? 'Deadline de 250 milissegundos perdido.' : 'Deadline de 250 milissegundos cumprido no exemplo.'}`}>
      {[0,500,1000,1500,2000,2500,3000].map(t=><g key={t}><line x1={x(t)} y1="43" x2={x(t)} y2="180" className="rt-grid"/><text x={x(t)} y="204" textAnchor="middle">{t}</text></g>)}
      {rows.map(row=><g key={row.label}><text x="10" y={row.y-21} className="rt-row-label">{row.label}</text>{row.starts.map((start,i)=><g key={i}><rect x={x(start)} y={row.y-9} width={Math.max(5,execution*scale)} height="26" rx="4" fill={row.color}/><text x={x(start)+4} y={row.y+8} className="rt-bar-text">{i+1}</text></g>)}</g>)}
      <text x="579" y="204" textAnchor="end">ms</text>
    </svg></div>
    <div className="rt-metrics"><span><small>DERIVA NO 4º INÍCIO</small><strong>{3*execution} ms</strong></span><span><small>DEADLINE D = 250 MS</small><strong className={execution > 250 ? 'rt-alert' : 'rt-safe'}>{execution > 250 ? 'Perdido' : 'Cumprido'}</strong></span></div>
    <p className="rt-foot">Cada barra é uma execução. Com <b>vTaskDelay(500)</b>, a próxima espera começa após C, acumulando deriva. Com <b>vTaskDelayUntil</b>, os inícios planejados permanecem na grade de 500 ms. O desenho abstrai preempção e jitter do escalonador.</p>
  </section>;
}

function UtilizationCalculator() {
  const [costs, setCosts] = useState([4,10,20]);
  const tasks = [{name:'Rápida',period:20},{name:'Média',period:50},{name:'Lenta',period:100}];
  const shares = tasks.map((task,i)=>costs[i]/task.period);
  const total = shares.reduce((a,b)=>a+b,0);
  return <section className="rt-visual" aria-label="Calculadora de utilização">
    <div className="rt-visual-head"><Cpu size={21}/><div><span>CALCULADORA INTERATIVA</span><h2>Quanto do núcleo as tarefas pedem?</h2><p>U = Σ(C/T), considerando as três tarefas periódicas no núcleo 1.</p></div></div>
    <div className="rt-costs">{tasks.map((task,i)=><label key={task.name}>{task.name} <small>T={task.period} ms</small><strong>C={costs[i]} ms</strong><input type="range" min="1" max={task.period} step="1" value={costs[i]} onChange={e=>setCosts(old=>old.map((value,j)=>j===i?Number(e.target.value):value))} aria-label={`Execução da tarefa ${task.name} em milissegundos`}/><span>Parcela: {(shares[i]*100).toFixed(0)}%</span></label>)}</div>
    <div className="rt-util-bar" role="img" aria-label={`Utilização total nominal de ${(total*100).toFixed(0)} por cento`}>{shares.map((share,i)=><span key={i} style={{width:`${Math.min(100,share*100)}%`}}/>)}</div>
    <div className="rt-util-result"><strong>{(total*100).toFixed(0)}% do núcleo</strong><span>{total > 1 ? 'Demanda média maior que a capacidade.' : 'A carga média cabe; ainda é preciso verificar cada deadline e os bloqueios.'}</span></div>
    <p className="rt-foot">A fórmula é uma primeira aproximação para <b>um núcleo</b>. Ela não inclui espera em mutex, interrupções e interferência. A simulação não executa o escalonador FreeRTOS.</p>
  </section>;
}

function Flow({data}) {
  return <section className="rt-visual" aria-label={data.title}><div className="rt-visual-head"><Activity size={21}/><div><span>MAPA VISUAL</span><h2>{data.title}</h2></div></div><div className="rt-flow">{data.nodes.map(([label,detail],i)=><React.Fragment key={i}><div className="rt-node"><small>{String(i+1).padStart(2,'0')}</small><strong>{label}</strong><span>{detail}</span></div>{i<data.nodes.length-1&&<ChevronRight size={18} aria-hidden="true"/>}</React.Fragment>)}</div></section>;
}

export function RealtimeVisualGuide({topic}) {
  if(topic==='periodicidade') return <PeriodicTimeline/>;
  if(topic==='escalonamento') return <UtilizationCalculator/>;
  const data=flows[topic];
  return data ? <Flow data={data}/> : null;
}
