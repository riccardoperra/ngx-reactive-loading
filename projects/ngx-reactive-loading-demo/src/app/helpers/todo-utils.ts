import { Todo } from '../model/todo';

export interface TodoState {
  ids: string[];
  todos: {
    [key: string]: Todo;
  };
}

export class TodoUtils {
  static addTodo(state: TodoState, todo: Todo) {
    return {
      ids: [...state.ids, todo.id],
      todos: {
        ...state.todos,
        [todo.id]: todo,
      },
    };
  }

  static setTodos(todos: Todo[]): TodoState {
    return {
      ids: todos.map(todo => todo.id),
      todos: todos.reduce<Record<string, Todo>>((acc, todo) => {
        acc[todo.id] = todo;
        return acc;
      }, {}),
    };
  }

  static removeTodo(state: TodoState, id: string): TodoState {
    const todo = state.todos[id];
    if (todo) {
      return {
        ids: state.ids.filter(todoId => todoId !== id),
        todos: Object.entries(state.todos).reduce<{ [key: string]: Todo }>(
          (acc, [todoId, todo]) => {
            if (id === todoId) {
              return acc;
            }
            acc[todoId] = todo;
            return acc;
          },
          {}
        ),
      };
    }
    return state;
  }
}
