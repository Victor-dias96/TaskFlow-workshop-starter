import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { TaskList } from "../src/components/TaskList";
import { TASKS_STORAGE_KEY } from "../src/hooks/useTasks";
import type { Task } from "../src/types/task";

const tasks: Task[] = [
  {
    id: "tarefa-1",
    title: "Ler o README",
    completed: false,
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    id: "tarefa-2",
    title: "Revisar o hook",
    completed: true,
    createdAt: "2026-10-19T12:05:00.000Z",
  },
];

describe("TaskList", () => {
  it("lista as tarefas e marca a concluída", () => {
    render(<TaskList tasks={tasks} onToggleTask={vi.fn()} onDeleteTask={vi.fn()} />);

    expect(screen.getByText("Ler o README")).toBeInTheDocument();
    expect(screen.getByText("Revisar o hook")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Ler o README" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Revisar o hook" })).toBeChecked();
  });

  it("informa quando não há tarefas", () => {
    render(<TaskList tasks={[]} onToggleTask={vi.fn()} onDeleteTask={vi.fn()} />);

    expect(screen.getByText("Nenhuma tarefa por aqui.")).toBeInTheDocument();
  });

  it("marca e desmarca uma tarefa", async () => {
    const user = userEvent.setup();
    const onToggleTask = vi.fn();

    render(<TaskList tasks={tasks} onToggleTask={onToggleTask} onDeleteTask={vi.fn()} />);

    await user.click(screen.getByRole("checkbox", { name: "Ler o README" }));
    await user.click(screen.getByRole("checkbox", { name: "Revisar o hook" }));

    expect(onToggleTask).toHaveBeenNthCalledWith(1, "tarefa-1");
    expect(onToggleTask).toHaveBeenNthCalledWith(2, "tarefa-2");
  });

  it("exclui uma tarefa", async () => {
    const user = userEvent.setup();
    const onDeleteTask = vi.fn();

    render(<TaskList tasks={tasks} onToggleTask={vi.fn()} onDeleteTask={onDeleteTask} />);

    await user.click(screen.getByRole("button", { name: "Excluir tarefa Ler o README" }));

    expect(onDeleteTask).toHaveBeenCalledWith("tarefa-1");
  });
});

describe("filtros e resumo", () => {
  it("mostra o total, as pendentes e as concluídas", () => {
    render(<App />);

    expect(screen.getByText("Total: 3")).toBeInTheDocument();
    expect(screen.getByText("Pendentes: 2")).toBeInTheDocument();
    expect(screen.getByText("Concluídas: 1")).toBeInTheDocument();
  });

  it("filtra as pendentes e destaca o filtro ativo", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Pendentes" }));

    expect(screen.getByRole("button", { name: "Pendentes" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Pendentes" })).toHaveClass("task-filters__button--active");
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Explorar o código do TaskFlow")).toBeInTheDocument();
    expect(screen.getByText("Adicionar uma tarefa nova")).toBeInTheDocument();
    expect(screen.queryByText("Marcar uma tarefa como concluída")).not.toBeInTheDocument();
    expect(screen.getByText("Total: 3")).toBeInTheDocument();
    expect(screen.getByText("Pendentes: 2")).toBeInTheDocument();
    expect(screen.getByText("Concluídas: 1")).toBeInTheDocument();
  });

  it("filtra as concluídas e volta a mostrar todas", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Concluídas" }));

    expect(screen.getByRole("button", { name: "Concluídas" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Marcar uma tarefa como concluída")).toBeInTheDocument();
    expect(screen.queryByText("Explorar o código do TaskFlow")).not.toBeInTheDocument();
    expect(screen.queryByText("Adicionar uma tarefa nova")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Todas" }));

    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Explorar o código do TaskFlow")).toBeInTheDocument();
    expect(screen.getByText("Adicionar uma tarefa nova")).toBeInTheDocument();
    expect(screen.getByText("Marcar uma tarefa como concluída")).toBeInTheDocument();
  });

  it("atualiza os contadores ao criar, concluir e excluir", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText("Nova tarefa"), "Revisar filtros");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Total: 4")).toBeInTheDocument();
    expect(screen.getByText("Pendentes: 3")).toBeInTheDocument();
    expect(screen.getByText("Concluídas: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Revisar filtros" }));

    expect(screen.getByText("Pendentes: 2")).toBeInTheDocument();
    expect(screen.getByText("Concluídas: 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Excluir tarefa Revisar filtros" }));

    expect(screen.getByText("Total: 3")).toBeInTheDocument();
    expect(screen.getByText("Pendentes: 2")).toBeInTheDocument();
    expect(screen.getByText("Concluídas: 1")).toBeInTheDocument();
  });
});

describe("persistência", () => {
  it("mostra as tarefas iniciais e as recupera depois de criar, concluir e excluir", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    expect(screen.getByText("Explorar o código do TaskFlow")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Marcar uma tarefa como concluída" })).toBeChecked();

    await user.type(screen.getByLabelText("Nova tarefa"), "Revisar o hook de tarefas");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("checkbox", { name: "Revisar o hook de tarefas" }));
    await user.click(
      screen.getByRole("button", { name: "Excluir tarefa Explorar o código do TaskFlow" }),
    );

    unmount();
    render(<App />);

    expect(screen.queryByText("Explorar o código do TaskFlow")).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Revisar o hook de tarefas" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Marcar uma tarefa como concluída" })).toBeChecked();
  });

  it("carrega as tarefas já salvas sem repor os exemplos", () => {
    const storedTasks: Task[] = [
      {
        id: "salva-1",
        title: "Tarefa salva",
        completed: false,
        createdAt: "2026-10-19T13:00:00.000Z",
      },
    ];

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(storedTasks));

    render(<App />);

    expect(screen.getByText("Tarefa salva")).toBeInTheDocument();
    expect(screen.queryByText("Explorar o código do TaskFlow")).not.toBeInTheDocument();
  });

  it("mantém a lista vazia quando o armazenamento não tem tarefas", () => {
    localStorage.setItem(TASKS_STORAGE_KEY, "[]");

    render(<App />);

    expect(screen.getByText("Nenhuma tarefa por aqui.")).toBeInTheDocument();
  });
});
