import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, GitBranch, Layers3, Play } from 'lucide-react';
import './visuals.css';

const flows = {
  compiladores: {
    projeto: { title: 'O caminho do código', nodes: [['Fonte', 'x = a + 2'], ['Front-end', 'tokens → árvore → tipos'], ['RI', 't1 = a + 2'], ['Back-end', 'instruções do alvo']] },
    otimizacao: { title: 'Uma otimização abre caminho para outra', nodes: [['RI original', 'x = 3; y = x * 2'], ['Propagação', 'y = 3 * 2'], ['Dobramento', 'y = 6'], ['Resultado', 'mesmo comportamento']] },
    objeto: { title: 'Da RI ao programa executável', nodes: [['RI', 'operações abstratas'], ['Gerador', 'instruções do alvo'], ['Objeto', 'símbolos + relocação'], ['Ligador', 'executável']] },
    parametros: { title: 'Decisões que orientam o projeto', nodes: [['Linguagem', 'gramática + tipos'], ['RI', 'forma comum'], ['Alvo', 'ISA + ABI'], ['Qualidade', 'testes + diagnósticos']] }
  },
  linguagens: {
    poo: { title: 'Classe e instância', nodes: [['Classe Game', 'molde'], ['Atributos', 'título · preço · estoque'], ['Métodos', 'cadastrar · editar'], ['Objeto', 'um jogo concreto']] },
    mvc: { title: 'Fluxo de uma requisição MVC', nodes: [['View', 'envia formulário'], ['Controller', 'recebe e coordena'], ['Model', 'valida e persiste'], ['View', 'mostra resultado']] },
    pdo: { title: 'Valores separados do SQL', nodes: [['Formulário', 'título e preço'], ['prepare()', 'SQL com placeholders'], ['bindValue()', 'valores como dados'], ['execute()', 'consulta ao banco']] },
    cadastro: { title: 'A correção em três movimentos', nodes: [['1 · preparar', '$sth = $pdo->prepare(...)'], ['2 · vincular', ':titulo e :preco'], ['3 · executar', '$sth->execute()']] }
  },
  embarcados: {
    arquitetura: { title: 'Entrada, decisão e saída', nodes: [['Entradas', 'joystick / botões'], ['ESP32', 'lê e decide'], ['Driver / GPIO', 'comanda sinais'], ['Saídas', 'motor / LED / buzzer']] },
    gpio: { title: 'Botão com pull-up externo', nodes: [['Solto', 'resistor → 3,3 V'], ['Entrada', 'HIGH estável'], ['Pressionado', 'botão → GND'], ['Entrada', 'LOW']] },
    adc: { title: 'Como o eixo vira comando', nodes: [['Tensão', 'posição do joystick'], ['ADC 12 bits', '0 a 4095'], ['Limiar', '<1500 · centro · >2500'], ['Ação', 'ré · parar · frente']] },
    motor: { title: 'Comando de cada motor', nodes: [['ESP32', 'IN1/IN2 + ENA'], ['L298N', 'ponte H'], ['Motor A', 'sentido + velocidade']] },
    pwm: { title: 'O que muda no sinal PWM', nodes: [['Frequência', 'ciclos por segundo'], ['Duty', 'tempo em HIGH'], ['8 bits', '0 · 128 · 255'], ['Carga', 'motor ou buzzer']] },
    tempo: { title: 'Janela de resposta', nodes: [['Início', 'startTime = millis()'], ['Espera', 'ler botão'], ['Comparação', 'decorrido > 2000 ms'], ['Estado', 'acerto ou perda']] },
    simon: { title: 'Prefixo cresce a cada rodada', nodes: [['Rodada 1', 'vermelho'], ['Rodada 2', 'vermelho → azul'], ['Rodada 3', 'vermelho → azul → verde']] },
    projeto: { title: 'Ordem de verificação do circuito', nodes: [['Placa', 'modelo e GPIO'], ['Energia', 'tensão + corrente'], ['Sinais', 'níveis + GND'], ['Teste', 'partes → integração']] }
  }
};

const parserSteps = [
  { stack: '$', input: 'num + num $', action: 'Início', note: 'A pilha contém apenas o marcador de base. O primeiro lookahead é num.' },
  { stack: '$ num', input: '+ num $', action: 'Shift num', note: 'Shift consome num da entrada e o empilha.' },
  { stack: '$ T', input: '+ num $', action: 'Reduce T → num', note: 'Reduce substitui num por T na pilha sem consumir o próximo token.' },
  { stack: '$ E', input: '+ num $', action: 'Reduce E → T', note: 'O termo T passa a representar uma expressão E.' },
  { stack: '$ E +', input: 'num $', action: 'Shift +', note: 'O operador + é consumido e empilhado; agora o lookahead é num.' },
  { stack: '$ E + num', input: '$', action: 'Shift num', note: 'O segundo número entra na pilha. A entrada agora está no marcador final.' },
  { stack: '$ E + T', input: '$', action: 'Reduce T → num', note: 'O segundo num é reduzido a T.' },
  { stack: '$ E', input: '$', action: 'Reduce E → E + T', note: 'A soma completa é reconhecida como uma expressão E.' },
  { stack: '$ E', input: '$', action: 'Accept', note: 'A entrada foi consumida e resta a expressão inicial E: análise aceita.' }
];

function ShiftReduceDemo() {
  const [step, setStep] = useState(0);
  const current = parserSteps[step];
  return <section className="visual-guide parser-guide" aria-label="Simulação de análise shift-reduce">
    <div className="visual-heading"><span className="visual-icon"><Layers3 size={20}/></span><div><span className="kicker">REFERÊNCIA VISUAL INTERATIVA</span><h2>Shift-reduce, passo a passo</h2><p>Gramática: <code>E → E + T | T</code> e <code>T → num</code>. Entrada: <code>num + num $</code>.</p></div></div>
    <div className="parser-state" aria-live="polite"><div><small>PILHA</small><strong>{current.stack}</strong></div><div><small>ENTRADA RESTANTE</small><strong>{current.input}</strong></div><div className="parser-action"><small>AÇÃO</small><strong>{current.action}</strong></div></div>
    <p className="parser-note">{current.note}</p>
    <div className="parser-controls"><button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}><ChevronLeft size={17}/> Anterior</button><span>Etapa {step + 1} de {parserSteps.length}</span><button onClick={() => setStep(s => Math.min(parserSteps.length - 1, s + 1))} disabled={step === parserSteps.length - 1}>{step === 0 ? 'Começar' : 'Próxima'} <ChevronRight size={17}/></button></div>
    <div className="parser-timeline" aria-label="Etapas do parser">{parserSteps.map((item, i) => <button key={i} className={i === step ? 'active' : i < step ? 'visited' : ''} onClick={() => setStep(i)} aria-label={`Ir para a etapa ${i + 1}: ${item.action}`} title={item.action}>{i + 1}</button>)}</div>
    <div className="parser-legend"><span><b>Shift</b> consome e empilha</span><span><b>Reduce</b> substitui uma produção</span><span><b>Accept</b> reconhece a entrada</span></div>
  </section>;
}

function CFGDemo() {
  return <section className="visual-guide graph-guide"><div className="visual-heading"><span className="visual-icon"><GitBranch size={20}/></span><div><span className="kicker">REFERÊNCIA VISUAL</span><h2>Junção de caminhos no CFG</h2><p>As informações de B2 e B3 chegam juntas à entrada de B4.</p></div></div><svg viewBox="0 0 560 270" role="img" aria-label="Grafo: B1 se divide em B2 e B3; ambos seguem para B4"><defs><marker id="cfgArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8094b2"/></marker></defs><path d="M280 60 L145 105 M280 60 L415 105 M145 155 L280 210 M415 155 L280 210" stroke="#8094b2" strokeWidth="2" fill="none" markerEnd="url(#cfgArrow)"/><g><rect x="230" y="14" width="100" height="46" rx="10"/><rect x="95" y="105" width="100" height="50" rx="10"/><rect x="365" y="105" width="100" height="50" rx="10"/><rect x="230" y="210" width="100" height="46" rx="10"/></g><text x="280" y="43">B1</text><text x="145" y="136">B2</text><text x="415" y="136">B3</text><text x="280" y="240">B4</text></svg><div className="graph-caption"><span><strong>Definições alcançáveis:</strong> IN[B4] = OUT[B2] ∪ OUT[B3]</span><span><strong>Expressões disponíveis:</strong> IN[B4] = OUT[B2] ∩ OUT[B3]</span></div></section>;
}

function InterferenceDemo() {
  return <section className="visual-guide graph-guide"><div className="visual-heading"><span className="visual-icon"><GitBranch size={20}/></span><div><span className="kicker">REFERÊNCIA VISUAL</span><h2>Grafo de interferência</h2><p>Cada aresta liga dois valores vivos ao mesmo tempo.</p></div></div><svg viewBox="0 0 560 240" role="img" aria-label="Triângulo de interferência: a, b e c se conectam entre si; são necessárias três cores ou um spill"><path d="M280 45 L130 185 L430 185 Z" stroke="#9fb0c8" strokeWidth="3" fill="none"/><circle cx="280" cy="45" r="24" className="register-a"/><circle cx="130" cy="185" r="24" className="register-b"/><circle cx="430" cy="185" r="24" className="register-c"/><text x="280" y="51">a</text><text x="130" y="191">b</text><text x="430" y="191">c</text></svg><div className="graph-caption"><span><strong>3 valores em conflito:</strong> precisam de 3 registradores distintos.</span><span><strong>Se houver só 2:</strong> escolha um valor para spill e reanalise.</span></div></section>;
}

function FlowDemo({ data }) {
  return <section className="visual-guide"><div className="visual-heading"><span className="visual-icon"><Play size={19}/></span><div><span className="kicker">MAPA VISUAL</span><h2>{data.title}</h2></div></div><div className="visual-flow">{data.nodes.map(([label, detail], i) => <React.Fragment key={`${label}-${i}`}><div className="flow-node"><span>{String(i + 1).padStart(2, '0')}</span><strong>{label}</strong><small>{detail}</small></div>{i < data.nodes.length - 1 && <ChevronRight className="flow-arrow" size={20} aria-hidden="true"/>}</React.Fragment>)}</div></section>;
}

export function VisualGuide({ course, topic }) {
  if (course === 'compiladores' && topic === 'yacc') return <ShiftReduceDemo key={topic}/>;
  if (course === 'compiladores' && topic === 'fluxo') return <CFGDemo/>;
  if (course === 'compiladores' && topic === 'registradores') return <InterferenceDemo/>;
  const data = flows[course]?.[topic];
  return data ? <FlowDemo data={data}/> : null;
}
