import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "../src/components/TaskForm";

describe("TaskForm", () => {
  it("associa o rótulo ao campo de nova tarefa", () => {
    render(<TaskForm onAddTask={vi.fn()} />);

    expect(screen.getByLabelText("Nova tarefa")).toBeInTheDocument();
  });

  it("envia o título sem espaços nas extremidades e limpa o campo", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Nova tarefa"), "  Comprar leite  ");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAddTask).toHaveBeenCalledWith("Comprar leite");
    expect(screen.getByLabelText("Nova tarefa")).toHaveValue("");
  });

  it("ignora um título vazio", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Nova tarefa"), "   ");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAddTask).not.toHaveBeenCalled();
  });
});
