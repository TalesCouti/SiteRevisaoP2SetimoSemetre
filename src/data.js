import { embeddedCourse } from './embedded.js';

export const courses = {
  compiladores: {
    title: 'Compiladores', eyebrow: 'PROVA DE COMPILADORES', description: 'Da análise do programa-fonte ao código de máquina: revise cada etapa, entenda os algoritmos e treine com questões comentadas.', accent: 'coral',
    topics: [
      { id: 'projeto', title: 'Construção de um compilador', short: 'Fases e arquitetura', icon: '01', time: '12 min', summary: 'Um compilador transforma código-fonte em uma representação executável preservando o significado do programa. O front-end compreende o programa; o meio otimiza; o back-end gera código para a máquina-alvo.',
        points: [
          ['Pipeline clássico', 'Análise léxica → sintática → semântica → representação intermediária (RI) → otimização → geração de código. A tabela de símbolos e o tratamento de erros apoiam várias fases.'],
          ['Léxico, sintaxe e semântica', 'O analisador léxico agrupa caracteres em tokens. O sintático verifica a gramática e constrói uma árvore. O semântico verifica tipos, declarações, escopos e regras que a gramática sozinha não captura.'],
          ['Representação intermediária', 'A RI desacopla linguagem-fonte e arquitetura-alvo. Em código de três endereços, t1 = a + b; t2 = t1 * c. Uma mesma RI pode alimentar vários back-ends.'],
          ['Front-end e back-end', 'Front-end depende principalmente da linguagem-fonte. Back-end depende da máquina-alvo: conjunto de instruções, registradores, convenção de chamada e formato do objeto.']
        ], example: 'x = (a + b) * c  →  t1 = a + b; t2 = t1 * c; x = t2', takeaway: 'Erros léxicos: token inválido. Sintáticos: estrutura inválida. Semânticos: estrutura válida com significado incorreto, como tipos incompatíveis.' },
      { id: 'fluxo', title: 'Análise de fluxo de dados', short: 'CFG, IN e OUT', icon: '02', time: '15 min', summary: 'A análise de fluxo de dados propaga fatos pelo grafo de fluxo de controle (CFG) para descobrir propriedades válidas em cada ponto do programa.',
        points: [
          ['Blocos básicos e CFG', 'Bloco básico é uma sequência sem desvio interno, com uma entrada e uma saída. Arestas do CFG representam possíveis transferências de controle.'],
          ['Equações IN/OUT', 'Cada bloco tem conjuntos IN e OUT. Para análise progressiva: IN[B] = meet dos OUT dos predecessores; OUT[B] = GEN[B] ∪ (IN[B] − KILL[B]). Itera-se até ponto fixo.'],
          ['Definições alcançáveis', 'Pergunta quais atribuições podem chegar a um ponto sem outra atribuição à mesma variável no caminho. É uma análise progressiva do tipo “pode” (união).'],
          ['Variáveis vivas', 'Uma variável está viva se seu valor atual poderá ser usado antes de ser redefinido. É análise regressiva: OUT[B] = união dos IN dos sucessores; IN[B] = USE[B] ∪ (OUT[B] − DEF[B]).'],
          ['Disponibilidade e ponto fixo', 'Expressões disponíveis usam interseção: devem ter sido calculadas em todos os caminhos sem invalidação. Loops exigem repetição até os conjuntos deixarem de mudar.']
        ], example: 'B1: a = 1; if (...) goto B2 else B3  →  uma definição alcança a junção se existir ao menos um caminho válido.', takeaway: '“Pode” normalmente combina caminhos por união; “deve” exige interseção. Direção depende da pergunta (passado ou futuro).' },
      { id: 'otimizacao', title: 'Otimização independente de máquina', short: 'Transformações na RI', icon: '03', time: '13 min', summary: 'Essas transformações operam sobre a RI sem depender de instruções específicas de uma arquitetura. Devem preservar o comportamento observável do programa.',
        points: [
          ['Propagação e dobramento de constantes', 'Se x = 4 e x não muda, substitua uso de x por 4. Depois, 4 * 3 pode virar 12 em tempo de compilação.'],
          ['Eliminação de código morto', 'Remove atribuições cujo resultado nunca é usado, desde que não tenham efeito colateral. Uma chamada de função com efeitos não pode ser removida apenas porque seu retorno é ignorado.'],
          ['Subexpressão comum', 'Se a + b já foi calculada e a/b não mudaram, reutilize o resultado. Verifique todos os caminhos e efeitos sobre memória.'],
          ['Invariantes de laço', 'Mova para fora do laço cálculos que produzem o mesmo resultado em todas as iterações, quando a movimentação for segura. Redução de força pode trocar operações caras por equivalentes mais baratas.'],
          ['Correção e limites', 'Overflow, ponto flutuante, exceções, aliasing e efeitos colaterais podem impedir transformações aparentemente óbvias. Otimização não é simplesmente reduzir o número de linhas.']
        ], example: 'x = 3; y = x * 2; print(y)  →  print(6), se não houver efeitos observáveis nas atribuições.', takeaway: 'Independente de máquina = aplicada à RI; não significa que toda transformação seja sempre válida.' },
      { id: 'objeto', title: 'Geração de código objeto', short: 'Instruções e ligação', icon: '04', time: '12 min', summary: 'O back-end seleciona instruções, escolhe onde manter valores e emite código objeto com informações necessárias para montagem e ligação.',
        points: [
          ['Seleção de instruções', 'Mapeia operações da RI para instruções da arquitetura-alvo respeitando operandos, modos de endereçamento e custo.'],
          ['Escalonamento e registradores', 'Ordenar instruções ajuda a lidar com dependências e latência. Alocação de registradores reduz acessos à memória.'],
          ['Código objeto relocável', 'Normalmente contém seções de código/dados, tabela de símbolos e entradas de relocação. Endereços finais podem ser definidos na ligação.'],
          ['Montador e ligador', 'Montador converte assembly em objeto. Ligador resolve símbolos externos, combina módulos e aplica relocações para produzir executável ou biblioteca.'],
          ['Convenção de chamada', 'Define passagem de parâmetros, valor de retorno, registradores preservados e organização da pilha. O código gerado precisa obedecê-la.']
        ], example: 't1 = a + b  →  LOAD R1, a; ADD R1, b; STORE t1, R1 (ilustração simplificada).', takeaway: 'Objeto relocável não é necessariamente executável. O ligador ainda pode precisar resolver referências e endereços.' },
      { id: 'registradores', title: 'Alocação de registradores', short: 'Liveness e spill', icon: '05', time: '14 min', summary: 'Decide quais valores ficam nos poucos registradores físicos. Quando não há registradores suficientes, alguns valores são temporariamente armazenados na memória (spill).',
        points: [
          ['Intervalos de vida', 'Um valor precisa permanecer disponível desde sua definição até o último uso relevante. Liveness informa quais valores coexistem em cada ponto.'],
          ['Grafo de interferência', 'Dois valores vivos ao mesmo tempo não podem ocupar o mesmo registrador. Eles são ligados por uma aresta no grafo de interferência.'],
          ['Coloração', 'Com k registradores, tenta-se colorir o grafo com k cores. Cada cor representa um registrador. Se a coloração falhar, o compilador escolhe valores para spill e tenta novamente.'],
          ['Linear scan', 'Percorre intervalos de vida em ordem e atribui registradores disponíveis. É rápido e comum em compilação JIT, com possível perda de qualidade frente a métodos mais caros.'],
          ['Coalescing e custos', 'Unir valores de uma cópia pode eliminar MOV, desde que não crie conflito. Spill implica LOAD/STORE extras; valores usados com frequência em laços tendem a ser caros para spill.']
        ], example: 'Se a e b são usados após a mesma instrução, seus intervalos se sobrepõem: a e b interferem e precisam de registradores distintos.', takeaway: 'Interferência é simultaneidade de valores vivos, não mera presença de duas variáveis no programa.' },
      { id: 'parametros', title: 'Parâmetros e recomendações', short: 'Decisões de projeto', icon: '06', time: '11 min', summary: 'Projetar um compilador exige definir requisitos da linguagem e do alvo antes de escolher técnicas de análise, RI e otimização.',
        points: [
          ['Defina entrada e saída', 'Especifique gramática, tipos, escopo, recursos da linguagem, arquitetura-alvo, sistema operacional e formato de saída. Isso evita ambiguidades na implementação.'],
          ['Critérios de qualidade', 'Equilibre correção, clareza dos erros, tempo de compilação, desempenho do código gerado, memória e portabilidade. Uma otimização mais agressiva aumenta custo de compilação.'],
          ['Escolha da RI', 'Uma RI estável facilita testes, análises de fluxo e retargeting. Código de três endereços e SSA são opções comuns conforme o projeto.'],
          ['Estratégia incremental', 'Implemente uma linguagem mínima funcional, teste cada fase isoladamente e acrescente recursos gradualmente. Use casos válidos, inválidos e de borda.'],
          ['Compatibilidade e diagnósticos', 'Defina ABI, convenção de chamada e bibliotecas desde cedo. Inclua linha/coluna e causa provável nas mensagens de erro.']
        ], example: 'Meta: compilar uma linguagem pequena para x86-64 → gramática + tipos + RI + ABI + testes de execução formam requisitos verificáveis.', takeaway: 'Parâmetros não são “flags mágicas”: são escolhas de linguagem, máquina, qualidade e implementação que orientam o compilador.' },
      { id: 'yacc', title: 'Shift-reduce e Yacc', short: 'Parsing bottom-up', icon: '07', time: '16 min', summary: 'Analisadores shift-reduce constroem a derivação de baixo para cima. Yacc gera um parser LALR(1) a partir de regras gramaticais e ações semânticas.',
        points: [
          ['Shift e reduce', 'Shift empilha o próximo token. Reduce substitui no topo da pilha um lado direito de produção por seu não terminal. Accept indica entrada reconhecida.'],
          ['Handle e análise LR', 'A redução deve escolher o handle correto. O parser LR usa estado e lookahead para decidir entre deslocar, reduzir, aceitar ou apontar erro.'],
          ['Conflitos', 'Shift/reduce ocorre quando ambas as ações parecem válidas; reduce/reduce, quando duas reduções competem. Ambiguidade e regras insuficientes de precedência são causas frequentes.'],
          ['Precedência e associatividade', 'Em Yacc, %left, %right e %nonassoc estabelecem associatividade e precedência; %prec altera a precedência de uma regra específica, como menos unário.'],
          ['Estrutura do Yacc', 'O arquivo tem declarações, regras e código auxiliar separados por %%. Ações em { } produzem valores com $$ (resultado) e $1, $2... (componentes). O analisador léxico fornece tokens via yylex().']
        ], example: 'E → E + T | T; T → num. Para “num + num”: shift num, reduce T, reduce E, shift +, shift num, reduce T, reduce E.', takeaway: 'Yacc usa parsing ascendente LALR(1); a precedência resolve certos conflitos, mas não corrige qualquer gramática.' }
    ],
    questions: [
      ['projeto','Qual fase normalmente verifica se uma variável foi declarada antes de seu uso?',['Análise léxica','Análise semântica','Montagem','Ligação'],1,'A análise semântica consulta escopos e tabela de símbolos. A sintaxe pode estar correta mesmo com identificador não declarado.'],
      ['projeto','O papel principal da representação intermediária é:',['Substituir o código objeto','Separar front-end e back-end','Eliminar a necessidade de análise sintática','Executar o programa'],1,'A RI permite reaproveitar o front-end para vários alvos e o back-end para várias linguagens-fonte.'],
      ['projeto','Na expressão x = (a + b) * c, qual é uma RI de três endereços válida?',['t1 = a + b; t2 = t1 * c; x = t2','x = a + b * c','t1 = a * c; x = t1 + b','x = c + a + b'],0,'A temporária t1 preserva os parênteses, e t2 multiplica a soma por c.'],
      ['projeto','Qual componente agrupa caracteres em tokens como identificadores e números?',['Ligador','Analisador semântico','Analisador léxico','Alocador de registradores'],2,'O léxico reconhece padrões de caracteres e entrega tokens ao parser.'],
      ['fluxo','Em definições alcançáveis, a combinação de caminhos no encontro usa normalmente:',['Interseção','União','Subtração','Produto cartesiano'],1,'É uma análise “pode”: basta existir um caminho em que a definição alcance o ponto.'],
      ['fluxo','A análise de variáveis vivas percorre o CFG em qual direção?',['Da entrada para a saída','Da saída para a entrada','Somente no primeiro bloco','Apenas em laços'],1,'Liveness depende de usos futuros; portanto, propaga informação dos sucessores para os predecessores.'],
      ['fluxo','Quando as equações IN/OUT são iteradas até os conjuntos pararem de mudar, atingiu-se:',['Um token','Um ponto fixo','Um conflito shift/reduce','Uma relocação'],1,'O ponto fixo representa uma solução estável das equações de fluxo, necessária especialmente com ciclos no CFG.'],
      ['fluxo','Uma expressão está disponível na entrada de B quando:',['Foi calculada em pelo menos um caminho','Foi calculada em todos os caminhos e não invalidada','Aparece no texto de B','Seu resultado é uma constante'],1,'Disponibilidade é uma propriedade “deve”: todos os caminhos de entrada precisam preservar o valor calculado.'],
      ['otimizacao','Se x = 5 e não há redefinição, substituir y = x + 2 por y = 5 + 2 é:',['Spill','Propagação de constantes','Relocação','Redução shift'],1,'A constante 5 substitui o uso de x; o passo seguinte poderia dobrar 5 + 2 para 7.'],
      ['otimizacao','Qual transformação pode ser perigosa se a operação tiver efeito colateral?',['Remover uma chamada cujo retorno não é usado','Dobrar 2 + 3 para 5','Renomear uma temporária','Reordenar comentários'],0,'O retorno não ser usado não garante que a chamada não altere estado, faça I/O ou lance exceção.'],
      ['otimizacao','Mover para fora do laço um cálculo cujo resultado não varia durante as iterações chama-se:',['Relocação','Movimentação de código invariante de laço','Parsing LR','Ligação dinâmica'],1,'A movimentação evita recomputar o mesmo valor a cada iteração, respeitando efeitos e segurança da transformação.'],
      ['otimizacao','O que caracteriza otimização independente de máquina?',['Usar instruções específicas do processador','Atuar sobre a RI sem depender de um alvo específico','Ignorar semântica','Ser sempre global'],1,'Ela modifica a representação intermediária de forma portável; ainda deve preservar o comportamento.'],
      ['objeto','Um arquivo objeto relocável geralmente ainda precisa de:',['Análise léxica','Ligação e resolução de símbolos','Reescrita da gramática','Coleta de lixo'],1,'O ligador resolve símbolos externos e aplica relocações para compor a saída final.'],
      ['objeto','Quem converte assembly em código objeto?',['Montador','Parser','Interpretador','Coletor de lixo'],0,'O montador traduz mnemônicos e diretivas de assembly para representação objeto.'],
      ['objeto','A convenção de chamada determina:',['A gramática da linguagem','Como parâmetros, retorno, pilha e registradores são usados','O conjunto FIRST','A associatividade de +'],1,'Código gerado de módulos diferentes precisa seguir a mesma ABI para interoperar.'],
      ['objeto','Uma entrada de relocação serve para:',['Marcar um token inválido','Ajustar referência cujo endereço final será conhecido depois','Escolher a regra gramatical','Eliminar um spill'],1,'Endereços podem mudar ao combinar módulos; a relocação registra onde e como corrigir referências.'],
      ['registradores','No grafo de interferência, uma aresta entre a e b significa que:',['Ambos são constantes','Seus valores estão vivos simultaneamente','Estão no mesmo bloco','Foram declarados juntos'],1,'Valores vivos ao mesmo tempo não podem compartilhar o mesmo registrador físico.'],
      ['registradores','Se faltam registradores, o compilador pode:',['Ignorar uma variável','Realizar spill para memória','Apagar instruções','Trocar a linguagem-fonte'],1,'Spill guarda valores temporariamente em memória e insere operações de carga e armazenamento.'],
      ['registradores','Colorir um grafo com k cores corresponde a:',['Usar k fases do compilador','Atribuir até k registradores sem conflitos','Gerar k arquivos objeto','Executar k laços'],1,'Cada cor representa um registrador. Vértices adjacentes exigem cores diferentes.'],
      ['registradores','Qual algoritmo costuma favorecer rapidez na alocação, inclusive em JIT?',['Linear scan','Yacc','Análise léxica','Relocação'],0,'Linear scan percorre intervalos de vida e distribui registradores com baixo custo de compilação.'],
      ['parametros','Qual definição deve vir cedo no projeto de um compilador?',['Somente a cor do editor','Gramática, tipos, arquitetura-alvo e formato de saída','A ordem dos comentários','O número de usuários do site'],1,'Esses requisitos moldam as fases, a RI, a ABI e os testes do compilador.'],
      ['parametros','Qual compromisso é comum ao aumentar o nível de otimização?',['Menos tempo de compilação sempre','Mais tempo de compilação para buscar código melhor','Fim da necessidade de testes','Independência de arquitetura garantida'],1,'Análises e transformações mais intensas podem melhorar o código gerado, mas custam tempo e memória para compilar.'],
      ['parametros','Uma boa mensagem de erro do compilador deve indicar:',['Apenas “falhou”','Localização e causa provável','Somente o nome do processador','O código objeto completo'],1,'Linha, coluna e contexto ajudam o programador a corrigir a origem do problema.'],
      ['parametros','Qual estratégia reduz risco ao implementar um compilador didático?',['Implementar tudo antes de testar','Começar com subconjunto funcional e testar fase a fase','Omitir a RI sempre','Remover verificação semântica'],1,'Uma implementação incremental permite validar cada etapa antes de adicionar complexidade.'],
      ['yacc','Em um parser shift-reduce, a ação shift:',['Substitui uma produção','Empilha o próximo token','Gera código objeto','Remove código morto'],1,'Shift consome um token da entrada e o coloca na pilha do parser.'],
      ['yacc','Em um parser shift-reduce, a ação reduce:',['Consome um token sem empilhar','Substitui um lado direito por seu não terminal','Resolve símbolos externos','Faz spill'],1,'Reduce reconhece um handle e aplica a produção correspondente de baixo para cima.'],
      ['yacc','Em Yacc, o símbolo $$ numa ação semântica representa:',['O primeiro token','O valor do lado esquerdo da regra','O lookahead','O último estado'],1,'$$ recebe o valor produzido pela regra; $1, $2 etc. acessam os componentes do lado direito.'],
      ['yacc','Qual diretiva de Yacc declara associatividade à esquerda?',['%token','%left','%start','%union'],1,'%left define associatividade à esquerda para os tokens listados e participa da resolução de conflitos.'],
      ['yacc','Um conflito shift/reduce indica que:',['O objeto não foi ligado','Há escolha concorrente entre deslocar e reduzir','Faltam registradores','O token foi apagado'],1,'O parser encontra duas ações possíveis no mesmo estado e lookahead; precedência ou revisão da gramática pode resolver.']
    ]
  },
  linguagens: {
    title: 'Linguagens de Programação', eyebrow: 'P1 • REVISÃO DA DEVOLUTIVA', description: 'Revisão direcionada à prova: POO em PHP, arquitetura MVC, acesso a dados com PDO e implementação correta do cadastro de jogos.', accent: 'mint',
    topics: [
      { id: 'poo', title: 'POO e classe Game', short: 'Atributos e métodos', icon: '01', time: '10 min', summary: 'Na prova, a classe Game representa um produto da loja e concentra dados e comportamentos relacionados a ele. Isso é encapsulamento: oferecer operações claras sem espalhar a lógica pelo sistema.',
        points: [
          ['Atributos', 'São dados do objeto. Exemplos coerentes: id, titulo, descricao, preco e estoque. Tipos e visibilidade devem refletir as regras do domínio.'],
          ['Métodos', 'São operações do objeto ou serviço: cadastrar, editar, listar e deletar. Uma implementação real também valida dados e trata falhas.'],
          ['Encapsulamento', 'Propriedades privadas e métodos públicos controlam o acesso. Evite permitir preço negativo ou estoque inconsistente por alteração direta.'],
          ['Instância e construtor', 'A classe é o molde; cada Game é uma instância. O construtor pode receber dependências como PDO e dados necessários.']
        ], example: 'class Game { private int $id; private string $titulo; private float $preco; public function cadastrar(): bool { /* ... */ } }', takeaway: 'A questão 1 pedia cinco atributos e quatro métodos. Relacione cada escolha à finalidade do sistema.' },
      { id: 'mvc', title: 'Arquitetura MVC', short: 'Model, View, Controller', icon: '02', time: '11 min', summary: 'MVC separa responsabilidades: dados e regras, interface e coordenação das requisições. Isso facilita manutenção, testes e trabalho em equipe.',
        points: [
          ['Model', 'Representa dados e regras de negócio e, no exemplo da prova, acessa o banco com PDO. A classe Game pode ser parte do Model.'],
          ['View', 'Mostra informações e formulários ao usuário. Em PHP, pode ser uma página HTML/PHP que apresenta a lista ou o formulário de cadastro.'],
          ['Controller', 'Recebe a requisição, valida/coordena a ação, chama o Model e escolhe a resposta ou View. É a ponte do fluxo da aplicação.'],
          ['Fluxo típico', 'Usuário envia formulário → Controller lê dados → Model persiste → Controller decide redirecionamento → View mostra resultado.'],
          ['Benefício e cuidado', 'A separação evita SQL na View e HTML no Model. MVC não elimina a necessidade de regras claras, validação e tratamento de erros.']
        ], example: 'POST /games → GameController::store() → Game::cadastrar() → banco → redirecionamento para lista.', takeaway: 'Na questão 2, explicar o papel das três camadas era tão importante quanto citar os benefícios.' },
      { id: 'pdo', title: 'PDO e segurança', short: 'Conexão e prepared statements', icon: '03', time: '12 min', summary: 'PDO fornece uma interface orientada a objetos para acesso a diferentes bancos. Prepared statements com parâmetros separam dados fornecidos pelo usuário da instrução SQL.',
        points: [
          ['Segurança', 'prepare() com placeholders e bindValue()/execute() impede que valores sejam interpretados como parte da sintaxe SQL. Nunca concatene entrada do formulário diretamente na query.'],
          ['Portabilidade', 'PDO tem drivers para MySQL, PostgreSQL, SQLite e outros. A interface é semelhante, embora diferenças de SQL entre bancos ainda possam exigir adaptações.'],
          ['Organização', 'Centralize conexão e acesso aos dados. Trate erros com exceções e separe responsabilidades no MVC.'],
          ['Parâmetros nomeados', 'Em INSERT INTO games (titulo, preco) VALUES (:titulo, :preco), cada placeholder recebe seu valor. O nome é usado no SQL; a variável do objeto é passada no bind.'],
          ['Tipos e validação', 'PDO::PARAM_STR é apropriado para texto. Para preços, prefira representação decimal adequada à aplicação; valide formato e valor antes de salvar.']
        ], example: "$stmt = $pdo->prepare('SELECT * FROM games WHERE id = :id'); $stmt->bindValue(':id', $id, PDO::PARAM_INT); $stmt->execute();", takeaway: 'A questão 4 pedia três vantagens: proteção contra SQL Injection, organização/manutenção e flexibilidade entre SGBDs.' },
      { id: 'cadastro', title: 'Cadastro com PDO', short: 'Corrigir e escrever o método', icon: '04', time: '16 min', summary: 'As questões 3 e 5 cobram o mesmo núcleo: preparar o INSERT, vincular os dois valores e executar a instrução preparada.',
        points: [
          ['Erro da questão 3', 'O trecho da prova chama prepare(), mas não guarda o objeto PDOStatement; em seguida apenas acessa titulo e preco, sem vinculá-los. $sth fica indefinido quando execute() é chamado.'],
          ['Correção', 'Guarde o retorno de prepare() em $sth. Use bindValue() para :titulo e :preco (ou execute() com array de parâmetros), depois retorne execute().'],
          ['Correspondência', 'Os placeholders :titulo e :preco devem coincidir com os nomes usados no bind. A query lista as colunas titulo e preco na mesma ordem dos valores.'],
          ['Tratamento', 'Valide campos, use exceções para falhas de banco e mantenha a conexão PDO disponível à classe, por exemplo via construtor.'],
          ['Prática segura', 'Uma solução equivalente é $sth->execute([\':titulo\' => $this->titulo, \':preco\' => $this->preco]);. Os valores continuam separados da sintaxe SQL.']
        ], example: "public function cadastrarGame(): bool {\n  $sth = $this->pdo->prepare('INSERT INTO games (titulo, preco) VALUES (:titulo, :preco)');\n  $sth->bindValue(':titulo', $this->titulo, PDO::PARAM_STR);\n  $sth->bindValue(':preco', $this->preco);\n  return $sth->execute();\n}", takeaway: 'A devolutiva apresenta a correção com bindValue() nos dois parâmetros. O ponto decisivo é preparar, vincular e executar o mesmo statement.' }
    ],
    questions: [
      ['poo','Qual conjunto contém cinco atributos adequados para uma classe Game?',['id, titulo, descricao, preco, estoque','cadastrar, editar, listar, deletar, salvar','Model, View, Controller, PDO, SQL','prepare, execute, bindValue, fetch, commit'],0,'Atributos descrevem o estado de um jogo. Os demais conjuntos misturam métodos e componentes de arquitetura.'],
      ['poo','Qual item é um método, e não um atributo, da classe Game?',['preco','estoque','cadastrar()','titulo'],2,'cadastrar() é uma operação. Preço, estoque e título são dados do objeto.'],
      ['poo','O encapsulamento ajuda a:',['Permitir alterações diretas sem regra','Controlar o acesso ao estado e preservar invariantes','Eliminar a necessidade de objetos','Executar SQL automaticamente'],1,'A classe pode validar mudanças no estado e expor operações adequadas, como atualizarEstoque().'],
      ['poo','Em POO, a classe Game é:',['Um objeto específico já cadastrado','Um molde para criar objetos Game','Uma tabela SQL obrigatoriamente','Uma View HTML'],1,'A classe define estrutura e comportamento; cada instância representa um objeto concreto.'],
      ['mvc','No MVC, quem recebe a requisição e coordena a chamada ao Model?',['View','Controller','Tabela','Driver'],1,'O Controller coordena a ação solicitada e determina a resposta.'],
      ['mvc','Qual responsabilidade pertence à View?',['Executar INSERT diretamente','Apresentar dados e formulários ao usuário','Definir o driver PDO','Alocar registradores'],1,'A View cuida da apresentação da interface.'],
      ['mvc','Na arquitetura usada na prova, a classe Game que acessa dados se encaixa principalmente em:',['Model','View','Controller','Roteador'],0,'O Model representa dados e lógica de acesso/persistência no exemplo descrito.'],
      ['mvc','Qual sequência resume um cadastro em MVC?',['View → banco diretamente','Requisição → Controller → Model → resposta/View','Model → usuário → SQL → View','PDO → HTML → objeto'],1,'O Controller recebe e coordena; o Model executa a lógica de dados; a View apresenta o resultado.'],
      ['pdo','O que protege contra SQL Injection ao usar PDO corretamente?',['Concatenar texto do usuário na query','Prepared statement com valores vinculados','Trocar aspas simples por duplas','Ocultar o formulário'],1,'Os parâmetros são enviados como dados, separados da estrutura SQL.'],
      ['pdo','Qual vantagem real de portabilidade do PDO?',['A mesma SQL funciona sem adaptação em qualquer SGBD','Uma API semelhante para drivers diferentes','Dispensa driver de banco','Transforma SQL em PHP'],1,'A interface de acesso é uniforme, mas dialetos SQL e recursos específicos podem variar.'],
      ['pdo','O placeholder :titulo em uma query preparada deve receber:',['O nome da tabela','O valor de título via bindValue ou execute com parâmetros','A senha do banco','Um comando SQL concatenado'],1,'O placeholder representa um valor, que é vinculado separadamente da consulta.'],
      ['pdo','Qual é uma prática ruim no cadastro de jogos?',['Validar preço','Tratar exceções','Concatenar $_POST[\'titulo\'] diretamente no INSERT','Usar placeholders'],2,'Concatenar entrada do usuário na SQL abre espaço para injeção e erros de escaping.'],
      ['cadastro','Na questão 3, qual erro impede $sth->execute() de funcionar?',['Falta de View','O retorno de prepare() não foi atribuído a $sth','O método usa PHP','A tabela tem duas colunas'],1,'prepare() produz o PDOStatement; sem atribuí-lo, $sth não existe quando execute() é chamado.'],
      ['cadastro','Depois de preparar INSERT com :titulo e :preco, o próximo passo é:',['Executar antes de passar valores','Vincular os dois valores e então executar','Concatenar valores na string SQL','Criar uma View'],1,'Ambos os placeholders precisam receber os valores correspondentes antes de execute().'],
      ['cadastro','Qual linha associa corretamente o título da instância ao placeholder?',["$sth->bindValue(':titulo', $this->titulo, PDO::PARAM_STR);","$this->titulo = ':titulo';","$sth->execute(':titulo');","$pdo->prepare($this->titulo);"],0,'bindValue() recebe o nome do placeholder, o valor e, opcionalmente, o tipo do parâmetro.'],
      ['cadastro','Qual alternativa representa o retorno esperado de um método simples de cadastro com PDO?',['return $sth->execute();','return $this->preco;','return $pdo->prepare;','return $_POST;'],0,'execute() informa se a instrução foi executada com sucesso; o método pode retornar esse booleano.'],
      ['cadastro','A ordem correta do fluxo PDO é:',['execute → prepare → bind','bind → execute → prepare','prepare → bind/parametrizar → execute','query → concatenar → execute'],2,'Primeiro se prepara a instrução, depois os valores são vinculados e só então ela é executada.']
    ]
  },
  embarcados: embeddedCourse
};

export const getQuestions = (course) => courses[course].questions.map((q, i) => ({ id: `${course}-${i}`, topic: q[0], prompt: q[1], options: q[2], correct: q[3], explanation: q[4] }));
