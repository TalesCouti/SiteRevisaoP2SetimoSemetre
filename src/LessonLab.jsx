import React, { useState } from 'react';
import { Activity, Code2, Table2 } from 'lucide-react';
import { lessonExamples } from './lessonExamples';
import './lessonLab.css';

function PWMChart() {
  const [duty, setDuty] = useState(50);
  const [frequency, setFrequency] = useState(3);
  const x0 = 44, width = 520, period = width / frequency, high = period * duty / 100;
  const path = duty === 0 ? 'M 44 146 H 564' : duty === 100 ? 'M 44 146 L 44 54 H 564' : Array.from({length:frequency}, (_, i) => {
    const start = x0 + i * period, end = start + period;
    return (i === 0 ? 'M ' : ' L ') + start + ' 146 L ' + start + ' 54 L ' + (start + high) + ' 54' + (duty < 100 ? ' L ' + (start + high) + ' 146 L ' + end + ' 146' : ' L ' + end + ' 54');
  }).join(' ');
  const periodMs = Math.round(1000 / frequency);
  const highMs = Math.round(1000 / frequency * duty / 100);
  const pwmValue = Math.round(255 * duty / 100);
  return <div className="lab-chart">
    <div className="lab-chart-heading"><Activity size={18}/><div><strong>Veja o sinal PWM mudar</strong><span>Janela didática de 1 segundo. Frequências baixas deixam cada pulso visível.</span></div></div>
    <div className="chart-controls">
      <label>Duty cycle <strong>{duty}%</strong><input type="range" min="0" max="100" step="5" value={duty} onChange={e => setDuty(Number(e.target.value))} aria-label="Duty cycle"/></label>
      <label>Frequência <strong>{frequency} Hz</strong><input type="range" min="1" max="6" step="1" value={frequency} onChange={e => setFrequency(Number(e.target.value))} aria-label="Frequência"/></label>
    </div>
    <div className="chart-frame"><svg viewBox="0 0 610 205" role="img" aria-label={'Forma de onda PWM com ' + frequency + ' ciclos por segundo e duty de ' + duty + ' por cento'}>
      <line x1="44" y1="54" x2="564" y2="54" className="chart-grid"/>
      <line x1="44" y1="146" x2="564" y2="146" className="chart-grid"/>
      {Array.from({length:frequency+1}, (_,i)=><line key={i} x1={x0+i*period} y1="42" x2={x0+i*period} y2="159" className="chart-tick"/>)}
      {duty > 0 && Array.from({length:frequency}, (_,i)=><rect key={i} x={x0+i*period} y="54" width={high} height="92" className="chart-high"/>)}
      <path d={path} className="chart-wave"/>
      <text x="14" y="59">1</text><text x="14" y="150">0</text><text x="43" y="187">0 s</text><text x="552" y="187">1 s</text>
    </svg></div>
    <div className="chart-metrics"><span><small>PERÍODO T = 1/f</small><strong>{periodMs} ms</strong></span><span><small>TEMPO EM HIGH</small><strong>{highMs} ms</strong></span><span><small>COMANDO EM 8 BITS</small><strong>{pwmValue} / 255</strong></span></div>
    <p className="chart-explain">A <b>frequência</b> define quantos pulsos cabem em 1 segundo. O <b>duty</b> altera a largura da parte HIGH de cada pulso. No projeto do carro, os motores foram configurados para <b>5 kHz</b>; aqui usamos até 6 Hz apenas para enxergar a onda.</p>
  </div>;
}

function ADCChart() {
  const [value, setValue] = useState(2050);
  const action = value < 1500 ? 'Ré' : value > 2500 ? 'Frente' : 'Zona central: avaliar HORZ';
  const marker = 44 + 520 * value / 4095;
  return <div className="lab-chart">
    <div className="lab-chart-heading"><Activity size={18}/><div><strong>Explore os limiares do joystick</strong><span>Mova a leitura vertical e veja qual ramo do código será executado.</span></div></div>
    <label className="adc-control">Leitura VERT <strong>{value}</strong><input type="range" min="0" max="4095" step="25" value={value} onChange={e=>setValue(Number(e.target.value))} aria-label="Valor ADC do eixo vertical"/></label>
    <div className="chart-frame"><svg viewBox="0 0 610 145" role="img" aria-label={'Leitura ADC ' + value + ' em escala de zero a 4095. Ação: ' + action}>
      <rect x="44" y="35" width={520*1500/4095} height="48" className="adc-back"/>
      <rect x={44+520*1500/4095} y="35" width={520*1000/4095} height="48" className="adc-neutral"/>
      <rect x={44+520*2500/4095} y="35" width={520*1595/4095} height="48" className="adc-forward"/>
      <path d={'M ' + marker + ' 21 L ' + (marker-8) + ' 9 L ' + (marker+8) + ' 9 Z'} className="adc-pointer"/>
      <line x1={marker} y1="22" x2={marker} y2="91" className="adc-pointer-line"/>
      <text x="44" y="108">0</text><text x={44+520*1500/4095} y="108" textAnchor="middle">1500</text><text x={44+520*2500/4095} y="108" textAnchor="middle">2500</text><text x="564" y="108" textAnchor="end">4095</text>
      <text x="110" y="66" className="adc-zone">RÉ</text><text x="305" y="66" className="adc-zone">CENTRO</text><text x="480" y="66" className="adc-zone">FRENTE</text>
    </svg></div>
    <div className="adc-result">Com VERT = <strong>{value}</strong>, o programa escolhe: <strong>{action}</strong>.</div>
    <p className="chart-explain">A faixa <b>1500–2500</b> é uma zona morta. Quando VERT fica nela, o código passa aos testes de HORZ; isso não significa necessariamente parar.</p>
  </div>;
}

export function LessonLab({ course, topic }) {
  const example = lessonExamples[course]?.[topic];
  if (!example) return null;
  return <section className="lesson-lab" aria-label={'Exemplo resolvido: ' + example.title}>
    <div className="lesson-lab-heading"><span className="lab-icon"><Table2 size={20}/></span><div><span className="kicker">EXEMPLO RESOLVIDO</span><h2>{example.title}</h2><p>{example.intro}</p></div></div>
    {course === 'embarcados' && topic === 'pwm' && <PWMChart/>}
    {course === 'embarcados' && topic === 'adc' && <ADCChart/>}
    <div className="lesson-table-scroll"><table><thead><tr>{example.headers.map((head,i)=><th key={i} scope="col">{head}</th>)}</tr></thead><tbody>{example.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
    {example.code && <div className="lab-code"><div><Code2 size={17}/> CÓDIGO RELACIONADO</div><pre><code>{example.code}</code></pre></div>}
    <p className="lab-note"><strong>Leia assim:</strong> {example.note}</p>
  </section>;
}
