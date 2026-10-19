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
