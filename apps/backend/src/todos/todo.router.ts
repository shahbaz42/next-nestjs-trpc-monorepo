import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { TodosService } from './todos.service';
import { z } from 'zod';
import { CreateTodo, createTodoSchema, todoSchema } from './todos.schema';

@Router({ alias: 'todo' })
export class TodoRouter {
  constructor(private readonly todosService: TodosService) {}

  @Query({
    input: z.object({
      id: z.string(),
    }),
    output: todoSchema,
  })
  getTodoById(@Input() input: { id: string }) {
    return this.todosService.getTodoById(input.id);
  }

  @Query({
    output: z.array(todoSchema),
  })
  getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @Mutation({
    input: createTodoSchema,
    output: todoSchema,
  })
  createTodo(@Input() todoData: CreateTodo) {
    return this.todosService.createTodo(todoData);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: createTodoSchema.partial(),
    }),
    output: todoSchema,
  })
  updateTodo(
    @Input('id') id: string,
    @Input('data') data: Partial<CreateTodo>,
  ) {
    return this.todosService.updateTodo(id, data);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
    }),
    output: z.boolean(),
  })
  deleteTodo(@Input('id') id: string) {
    return this.todosService.deleteTodo(id);
  }
}
