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

  it("impede um título vazio e mostra uma mensagem acessível", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Nova tarefa"), "   ");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAddTask).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Informe um título para a tarefa.");
    expect(screen.getByLabelText("Nova tarefa")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Nova tarefa")).toHaveAttribute("aria-describedby", "task-title-error");
  });

  it("remove a mensagem quando o título volta a ser válido", async () => {
    const user = userEvent.setup();

    render(<TaskForm onAddTask={vi.fn()} />);

    const titleInput = screen.getByLabelText("Nova tarefa");

    await user.type(titleInput, "   ");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(titleInput, "Comprar leite");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(titleInput).toHaveAttribute("aria-invalid", "false");
  });

  it("impede um título acima de 80 caracteres", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Nova tarefa"), "a".repeat(81));
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAddTask).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "O título deve ter no máximo 80 caracteres.",
    );
  });

  it("aceita um título com exatamente 80 caracteres", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();
    const title = "a".repeat(80);

    render(<TaskForm onAddTask={onAddTask} />);

    await user.type(screen.getByLabelText("Nova tarefa"), title);
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAddTask).toHaveBeenCalledWith(title);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
