import { createEffect, createSignal, ErrorBoundary, Show } from 'solid-js';
import AddBook from './AddBook';
import BookList from './BookList';
import SearchBook from './SearchBook';

type Props = {
  name: string;
};

export interface Book {
  name: string;
  author: string;
  deleted: boolean;
}

export default function BookShelf(props: Props) {
  const initialBooks: Book[] = [];

  const [books, setBooks] = createSignal(initialBooks);

  createEffect(() => console.log('books changed: ', books()));

  return (
    <>
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <div class="dropdown">
            <label tabIndex={0} class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Homepage</a>
              </li>
              <li>
                <a>Portfolio</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost normal-case text-xl">My Bookshelf</a>
        </div>
        <div class="navbar-end">
          <ErrorBoundary
            fallback={(err, reset) => {
              return <button onClick={reset}>Error</button>;
            }}
          >
            <SearchBook setBooks={setBooks} />
          </ErrorBoundary>

          <AddBook setBooks={setBooks} />
        </div>
      </div>
      <Show
        when={books().length > 0}
        fallback={
          <div class="alert shadow-lg w-2/4 mx-auto mt-8 justify-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info flex-shrink-0 w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Add Books by Search</span>
            </div>
          </div>
        }
      >
        <BookList books={books()} setBooks={setBooks} />
      </Show>
    </>
  );
}
