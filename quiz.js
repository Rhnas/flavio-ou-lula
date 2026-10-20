/* FLÁVIO OU LULA? — 111🌽 SÉRIE GOLD
 * Configuração das perguntas + lógica de cálculo.
 * Toda associação resposta -> candidato fica em QUESTIONS (campo simPara).
 * simPara = lado que recebe o ponto quando a resposta é SIM; o NÃO vai para o outro.
 * O enquadramento é EDITORIAL e deve ser revisado antes da publicação (ver MAPEAMENTO.md).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.QuizCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FLAVIO = 'flavio';
  var LULA = 'lula';

  // URL pública só entra na mensagem depois da publicação. Preencha aqui.
  var PUBLIC_URL = 'https://rhnas.github.io/flavio-ou-lula/';

  var QUESTIONS = [
    { id: 1,  text: 'Você defende o impeachment de ministros do STF quando houver fundamento jurídico?', simPara: FLAVIO },
    { id: 2,  text: 'Você apoiaria aumentar o número de ministros do STF?', simPara: LULA },
    { id: 3,  text: 'Você é a favor de acabar com as saídas temporárias de presos?', simPara: FLAVIO },
    { id: 4,  text: 'Você apoia reduzir a maioridade penal para crimes graves?', simPara: FLAVIO },
    { id: 5,  text: 'Você quer pagar mais impostos?', simPara: LULA },
    { id: 6,  text: 'Você é a favor de ampliar o poder do governo para limitar conteúdos nas redes sociais?', simPara: LULA },
    { id: 7,  text: 'Você considera legítima a invasão de propriedade privada como forma de reivindicação?', simPara: LULA },
    { id: 8,  text: 'Você apoiaria reduzir o número de ministérios para cortar despesas?', simPara: FLAVIO },
    { id: 9,  text: 'Você prefere ampliar os gastos públicos mesmo que isso exija mais recursos?', simPara: LULA },
    { id: 10, text: 'Você defende penas mais rigorosas para integrantes de facções criminosas?', simPara: FLAVIO },
    { id: 11, text: 'Você prefere menos impostos e menos intervenção estatal na economia?', simPara: FLAVIO },
    { id: 12, text: 'Você defende ampliar programas sociais mesmo que aumentem as despesas públicas?', simPara: LULA },
    { id: 13, text: 'Você acha que decisões individuais de ministros do STF deveriam ter limites mais rígidos?', simPara: FLAVIO },
    { id: 14, text: 'Você apoiaria ampliar parcerias com a rede privada para reduzir filas no SUS?', simPara: FLAVIO },
    { id: 15, text: 'Você acha que o governo atual combate bem a corrupção?', simPara: LULA },
    { id: 16, text: 'A tão sonhada picanha chegou?', simPara: LULA },
    { id: 17, text: 'Você se orgulha do que o Brasil se tornou nos últimos 24 anos?', simPara: LULA },
    { id: 18, text: 'Você quer mudar e dar uma chance para a mudança?', simPara: FLAVIO }
  ];

  /** Lado associado a uma resposta ('sim' | 'nao') de uma pergunta. */
  function sideFor(question, answer) {
    if (answer !== 'sim' && answer !== 'nao') return null;
    var other = question.simPara === FLAVIO ? LULA : FLAVIO;
    return answer === 'sim' ? question.simPara : other;
  }

  /**
   * answers: array de 'sim'|'nao'|null (um por pergunta).
   * Retorna contagens e percentuais inteiros que somam exatamente 100
   * (método do maior resto; empate no resto vai para quem tem mais respostas).
   */
  function calculate(answers, questions) {
    questions = questions || QUESTIONS;
    var counts = {}; counts[FLAVIO] = 0; counts[LULA] = 0;
    questions.forEach(function (q, i) {
      var side = sideFor(q, answers[i]);
      if (side) counts[side]++;
    });
    var total = counts[FLAVIO] + counts[LULA];
    if (total === 0) {
      var z = { counts: counts, total: 0, percent: {} };
      z.percent[FLAVIO] = 0; z.percent[LULA] = 0;
      return z;
    }
    var rawF = counts[FLAVIO] * 100 / total;
    var floorF = Math.floor(rawF);
    var floorL = Math.floor(counts[LULA] * 100 / total);
    var left = 100 - floorF - floorL; // 0 ou 1 com dois grupos
    var remF = rawF - floorF;
    var remL = (counts[LULA] * 100 / total) - floorL;
    if (left > 0) {
      var giveF = remF > remL || (remF === remL && counts[FLAVIO] >= counts[LULA]);
      if (giveF) floorF += left; else floorL += left;
    }
    var pct = {}; pct[FLAVIO] = floorF; pct[LULA] = floorL;
    return { counts: counts, total: total, percent: pct };
  }

  /** Mensagem do WhatsApp; a linha do link só aparece com URL pública definida. */
  function buildShareMessage(result, url) {
    var lines = [
      '🇧🇷 FLÁVIO OU LULA? — 111🌽 SÉRIE GOLD',
      'Respondi às ' + QUESTIONS.length + ' perguntas!',
      'Meu resultado de afinidade:',
      '🟢 Flávio: ' + result.percent[FLAVIO] + '%',
      '🔴 Lula: ' + result.percent[LULA] + '%',
      'Informação. Consciência. Um Brasil melhor começa com sua escolha.'
    ];
    var link = url === undefined ? PUBLIC_URL : url;
    if (link) lines.push('Faça o teste também: ' + link);
    return lines.join('\n');
  }

  function buildShareUrl(result, url) {
    return 'https://wa.me/?text=' + encodeURIComponent(buildShareMessage(result, url));
  }

  return {
    FLAVIO: FLAVIO, LULA: LULA, PUBLIC_URL: PUBLIC_URL, QUESTIONS: QUESTIONS,
    sideFor: sideFor, calculate: calculate,
    buildShareMessage: buildShareMessage, buildShareUrl: buildShareUrl
  };
});
