# Checklist Executável - Good Case (Throughput e DeltaTime)

## Objetivo
Garantir que o projeto `good case` do `primaryClient` demonstre evolução operacional realista com:
- throughput crescente a cada sprint;
- sprint 5 com soma de `tempo` igual a `4032`;
- sprint 5 aproximadamente `+30%` em relação à sprint 1;
- diferença entre `tempo_estimado` e `tempo` caindo gradualmente até quase zero na sprint 5.

## Escopo
- Alterar apenas o projeto `good case`.
- Manter comportamento atual para os demais projetos.

## Pré-condições
- [x] Confirmar que o `good case` é um projeto finalizado com 5 sprints.
- [x] Confirmar que o `good case` pertence ao `primaryClient`.
- [x] Definir tolerâncias numéricas de validação (ex.: `THROUGHPUT_TOLERANCE`, `DELTA_TOLERANCE`).

## Implementação
- [x] Adicionar modo específico para geração de card timing no `good case` (ex.: `good_case_30pct_throughput`).
- [x] Criar plano determinístico de `throughput` por sprint para 5 sprints, com último alvo `4032`.
- [x] Garantir progressão monotônica do throughput por sprint.
- [x] Distribuir o `throughput` alvo da sprint entre os 8 cards preservando variação leve entre cards.
- [x] Garantir que a soma de `tempo` dos 8 cards feche exatamente no alvo da sprint.
- [x] Criar plano de redução gradual de erro (`abs(tempo - tempo_estimado)`) por sprint.
- [x] Gerar `tempo_estimado` por card seguindo o plano de redução de erro.
- [x] Garantir que na sprint 5 a diferença média `abs(tempo - tempo_estimado)` seja próxima de zero.
- [x] Garantir que os cards do `good case` entrem no fluxo de estatística computada.
- [x] Preservar regras atuais para status/timing dos outros projetos.

## Validação automática no seed
- [x] Implementar validador do `good case` para throughput por sprint (`sum(tempo)`).
- [x] Validar `sum(tempo)` estritamente crescente entre sprint 1 e 5.
- [x] Validar `sum(tempo)` da sprint 5 igual a `4032`.
- [x] Validar relação sprint 5 vs sprint 1 como `+30%` dentro da tolerância.
- [x] Implementar validador de erro de estimativa por sprint (`avg(abs(tempo - tempo_estimado))`).
- [x] Validar que o erro médio cai sprint a sprint.
- [x] Validar que erro médio da sprint 5 fica próximo de zero.
- [x] Em caso de falha, lançar erro com detalhes por sprint (throughput e delta médio).

## Logs e observabilidade
- [x] Adicionar log final resumido do `good case` com throughput por sprint.
- [x] Adicionar log final resumido do `good case` com delta médio por sprint.
- [x] Exibir no log o resultado PASS/FAIL de cada regra validada.

## Execução
- [x] Rodar `npm run build`.
- [x] Rodar seed (`npm run seed` ou endpoint `POST /seed/run`).
- [ ] Confirmar no output os logs de validação do `good case` (pendente: seed não concluiu).
- [x] Se falhar por conflito externo (ex.: Clerk), registrar bloqueio e repetir após ajuste.

## Critério de pronto
- [ ] O `good case` finalizado de 5 sprints foi gerado com throughput crescente (implementado; pendente validação runtime).
- [ ] A sprint 5 fechou com `sum(tempo) = 4032` (implementado; pendente validação runtime).
- [ ] A sprint 5 ficou ~`30%` acima da sprint 1 dentro da tolerância definida (implementado; pendente validação runtime).
- [ ] O delta entre `tempo_estimado` e `tempo` reduziu gradualmente até quase zero na sprint 5 (implementado; pendente validação runtime).
- [ ] As validações automáticas passaram sem erro (pendente seed completar sem erro Clerk).
