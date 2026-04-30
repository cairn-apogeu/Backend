# Checklist Executável - Good Case do `primaryClient`

## Objetivo
Garantir que **apenas 1 projeto finalizado do `primaryClient`** demonstre melhora gradual de maturidade operacional, com **+30% da última sprint em relação à primeira** em todos os atributos de maturidade.

## Escopo
- Alterar somente a geração de indicadores do projeto finalizado do `primaryClient`.
- Manter comportamento atual (aleatório) para:
  - projeto incompleto do `primaryClient`;
  - projeto finalizado do `secondaryClient`.

## Atributos de maturidade operacional (18)
- `capacidadeCognitivaAplicada`: `reformulacao_problema`, `separacao_sintoma_causa`, `autocritica_tecnica`, `escolha_abordagens_tecnicas`
- `comunicacaoOperacional`: `validacao_entendimento_pre_execucao`, `clareza_exposicao_tecnica`, `participacao_discussoes_tecnicas`, `sinalizacao_desalinhamento_ruido`
- `execucaoConfiavel`: `delta_time_predict`, `reestimativa_ativa`, `estabilidade_throughput`, `sinalizacao_bloqueios`, `qualidade_cards_dor`, `aderencia_entregas_dod`
- `contribuicaoSistemica`: `ajudas_prestadas`, `sinalizacao_risco_tecnico_integracao`, `compartilhamento_solucoes`, `participacao_feedbacks`

## Implementação
- [x] Criar tipo/modo para controlar geração de maturidade no projeto (ex.: `maturityTrendMode: "default" | "good_case_30pct"`).
- [x] Passar o modo do `main` -> `createProject` -> `createIndicatorsForDaily`.
- [x] No `main`, identificar explicitamente o projeto finalizado do `primaryClient` e marcar esse projeto com `good_case_30pct`.
- [x] Extrair/organizar catálogo dos 18 atributos em estrutura única para evitar duplicação.
- [x] Criar função para baseline por `user_id` + `atributo` na sprint 1 (com leve variação entre devs).
- [x] Criar função para progressão por sprint com crescimento monotônico:
  - [x] `target = base * 1.3`
  - [x] `value = base + (target - base) * progress` (onde `progress` varia de `0` a `1` da primeira à última sprint)
  - [x] aplicar arredondamento consistente.
- [x] Garantir que somente o projeto marcado use essa progressão; demais continuam no fluxo atual.

## Validação automática (obrigatória)
- [x] Criar função de validação que rode no seed para o projeto `good_case_30pct`.
- [x] Validar para cada atributo (considerando média por sprint dos devs do projeto):
  - [x] monotonicidade não decrescente entre sprints;
  - [x] última sprint = `+30%` da primeira (com tolerância numérica explícita).
- [x] Em caso de violação, lançar erro com mensagem contendo: projeto, atributo, sprint inicial/final e valores.

## Execução e checagem
- [x] Rodar seed: `npm run seed` (executado, mas bloqueado por conflito de identidade no Clerk).
- [ ] Confirmar log de sucesso do seed e da validação do good case.
- [ ] Amostrar dados por sprint (query/manual) para confirmar tendência no projeto alvo.

## Critério de pronto
- [ ] Apenas 1 projeto finalizado do `primaryClient` com tendência de +30% (implementado; pendente validação runtime).
- [ ] Todos os 18 atributos validados automaticamente (implementado; pendente validação runtime).
- [ ] Nenhuma regressão no comportamento dos outros projetos (pendente validação runtime completa).
