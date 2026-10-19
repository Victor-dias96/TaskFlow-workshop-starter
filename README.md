# TaskFlow

Base de uma aplicação de tarefas para a oficina universitária de Cursor IDE e inteligência artificial aplicada ao desenvolvimento.

O TaskFlow roda só no navegador. As tarefas ficam no `localStorage`. Cada estudante pode fazer um fork e implementar uma funcionalidade nova durante a oficina.

## Requisitos de ambiente

- Node.js 20 ou superior
- npm 10 ou superior

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

O Vite mostra o endereço local no terminal. Para gerar e conferir o build:

```bash
npm run build
npm run preview
```

## Testes

```bash
npm test
```

## Estrutura

```text
src/components/TaskForm.tsx    formulário de nova tarefa
src/components/TaskItem.tsx    uma tarefa, com concluir e excluir
src/components/TaskList.tsx    lista de tarefas
src/hooks/useTasks.ts          criação, conclusão, exclusão e localStorage
src/types/task.ts              modelo da tarefa
src/App.tsx                    composição da tela
src/main.tsx                   entrada da aplicação
src/styles.css                 layout
tests/TaskForm.test.tsx        testes do formulário
tests/TaskList.test.tsx        testes da lista e da persistência
```

Uma tarefa tem `id`, `title`, `completed` e `createdAt`.

## Funcionalidades iniciais

- Criar uma tarefa
- Listar tarefas
- Marcar e desmarcar uma tarefa como concluída
- Excluir uma tarefa
- Salvar tarefas no `localStorage`
- Carregar as tarefas salvas ao iniciar
- Exibir três tarefas de exemplo quando ainda não existe nada armazenado
- Layout responsivo, com HTML semântico e navegação por teclado

## Funcionalidades reservadas para a oficina

Estas partes ficam para os estudantes implementarem:

- Filtros
- Contadores por status
- Edição de tarefa
- Modo escuro
- Botão para limpar tarefas concluídas
- Ordenação
- Validação completa
- Limite de caracteres
