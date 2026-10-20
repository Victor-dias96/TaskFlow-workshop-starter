---
name: taskflow-review
description: Revisa implementações do TaskFlow verificando acessibilidade, regressões, organização e testes.
disable-model-invocation: true
---

# TaskFlow Review

## Objetivo

Revisar alterações feitas no TaskFlow antes de aceitar um merge.

## Quando usar

Utilize esta Skill quando:

- uma funcionalidade foi implementada;
- um bug foi corrigido;
- um teste foi criado;
- um pull request estiver pronto para revisão.

## Processo de revisão

### 1. Entender a mudança

Explique:

- qual era o problema;
- qual solução foi implementada;
- quais arquivos foram modificados.

### 2. Procurar regressões

Verifique:

- criação de tarefas;
- conclusão de tarefas;
- exclusão de tarefas;
- persistência no localStorage;
- filtros;
- contadores;
- validação do formulário.

### 3. Verificar acessibilidade

Confirme:

- labels associadas;
- navegação por teclado;
- foco visível;
- aria-invalid;
- aria-describedby;
- role="alert" quando necessário.

### 4. Verificar qualidade

Analise:

- duplicação de código;
- responsabilidade dos componentes;
- nomes de variáveis;
- tipagem TypeScript;
- complexidade excessiva.

### 5. Verificar testes

Identifique:

- testes existentes;
- cenários não cobertos;
- possíveis testes adicionais.

## Resposta esperada

Apresente:

1. Resumo da implementação.
2. Problemas encontrados.
3. Melhorias recomendadas.
4. Riscos identificados.
5. Testes sugeridos.

Não modifique arquivos automaticamente.