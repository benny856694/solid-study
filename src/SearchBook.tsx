import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  Setter,
  Show,
  Suspense,
  Switch,
} from 'solid-js';
import { Book } from './BookShelf';
import Searcher from './Searcher';

const url = 'https://openlibrary.org/search.json?q=';

type Props = {
  setBooks: Setter<Book[]>;
};

export default function SearchBook(props: Props) {
  console.log('create search component');

  const [show, setShow] = createSignal(false);

  return (
    <>
      <button class="btn btn-ghost btn-circle" onClick={() => setShow(true)}>
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <input
        type="checkbox"
        checked={show()}
        id="search-modal-5"
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
          <h3 class="font-bold text-lg">Search Book</h3>
          <label
            for="search-modal-5"
            class="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={(e) => {
              setShow(false);
              e.preventDefault();
            }}
          >
            ✕
          </label>

          <ErrorBoundary
            fallback={(err, reset) => (
              <>
                <div class="alert alert-error shadow-lg mt-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Error: {err.toString()}</span>
                  </div>
                  <div class="flex-none">
                    <button class="btn btn-sm btn-primary" onClick={reset}>
                      Retry
                    </button>
                  </div>
                </div>
              </>
            )}
          >
            <Searcher setBooks={props.setBooks} show={show()} />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
