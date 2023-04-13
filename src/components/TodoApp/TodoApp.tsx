import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';

import { Header } from '../Header';
import { Footer } from '../Footer';
import { UserWarning } from '../UserWarning';
import { TodoList } from '../TodoList';
import { Error } from '../Error';

import { Todo } from '../../types/Todo';
import { getTodos, toogleTodo, deleteTodo } from '../../api/todos';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { User } from '../../types/User';
import { warningTimer } from '../../utils/warningTimer';

export const TodoApp: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [user, setUser] = useLocalStorage<User>('user', {
    id: 0,
    name: '',
    username: '',
    email: '',
    phone: '',
  });
  const { id } = user;

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  const allCompleted = useMemo(() => {
    return todos.filter(({ completed }) => completed);
  }, [todos]);

  const isAllCompleted = useMemo(() => {
    return allCompleted.length === todos.length;
  }, [todos]);

  const clearCompleted = useCallback(() => {
    try {
      Promise.all(allCompleted.map(async todo => {
        return deleteTodo(id, todo.id);
      }));

      setTodos(prevTodos => prevTodos.filter(({ completed }) => !completed));
    } catch {
      setIsError(true);
      warningTimer(setIsError, false, 3000);
    }
  }, [todos]);

  const onToogleAllTodos = useCallback(() => {
    try {
      Promise.all(todos.map(async todo => {
        return toogleTodo(id, todo.id, !isAllCompleted);
      }));

      setTodos(prevTodos => prevTodos.map((todo) => ({
        ...todo,
        completed: !isAllCompleted,
      })));
    } catch {
      setIsError(true);
      warningTimer(setIsError, false, 3000);
    }
  }, [todos]);

  useEffect(() => {
    (async () => {
      try {
        const todosData = await getTodos(id);

        setTodos(todosData);
      } catch {
        setIsError(true);
        warningTimer(setIsError, false, 3000);
      }
    })();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  if (isError) {
    return <Error />;
  }

  if (!id) {
    return (
      <UserWarning
        user={user}
        setUser={setUser}
        setIsError={setIsError}
      />
    );
  }

  return (
    <div className="container">
      <div className="todoapp">
        <Header
          user={user}
          onAddTodo={setTodos}
          setIsError={setIsError}
        />

        <section className="main">
          <input
            type="checkbox"
            id="toggle-all"
            className="toggle-all"
            data-cy="toggleAll"
            checked={isAllCompleted}
            onChange={onToogleAllTodos}
          />
          <label
            htmlFor="toggle-all"
            className={classNames(
              { 'toggle-all-label': isAllCompleted },
            )}

          >
            Mark all as complete
          </label>

          <TodoList
            user={user}
            todos={todos}
            setTodos={setTodos}
            setIsError={setIsError}
          />
        </section>

        {todos.length ? (
          <Footer
            onClearCompleted={clearCompleted}
            activeTodos={activeTodos}
            allCompleted={allCompleted}
          />
        ) : null}
      </div>
    </div>
  );
};
