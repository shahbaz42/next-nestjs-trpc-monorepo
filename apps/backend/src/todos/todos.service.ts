import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodo, Todo } from './todos.schema';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  getTodoById(id: string): Todo | undefined {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(createTodo: CreateTodo) {
    const todo: Todo = {
      ...createTodo,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
    };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: string, data: Partial<CreateTodo>): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    const updatedTodo = { ...this.todos[todoIndex], ...data };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  deleteTodo(id: string): boolean {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);
    return true;
  }
}
