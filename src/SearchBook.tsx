import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Setter,
  Show,
  Suspense,
  Switch,
} from 'solid-js';
import { Book } from './BookShelf';

const url = 'https://openlibrary.org/search.json?q=';

type Props = {
  setBooks: Setter<Book[]>;
  error?: string;
};

type BookItem = {
  title: string;
  author_name: string[];
};

export default function SearchBook(props: Props) {
  console.log('create search component');
  const [input, setInput] = createSignal('');
  const [query, setQuery] = createSignal<string>();
  const [show, setShow] = createSignal(false);
  const [data, { mutate, refetch }] = createResource<Book[], string>(
    query,
    async (query: string) => {
      console.log('query for: ', query);
      const response = await fetch(`${url}${encodeURI(query)}`);
      const result = await response.json();
      const items = result.docs as BookItem[];
      const ret = items.slice(0, 10).map((item) => ({
        name: item.title,
        author: item.author_name?.slice(0, 2).join(', '),
        deleted: false,
      }));
      console.log('query returns', ret);
      return ret;
    }
  );
  const disableSearch = () => {
    const disabled = !input() || data.loading;
    console.log(`in disable calc ${disabled}`);
    return disabled;
  };

  const showRefresh = () => {};

  createEffect(() => {
    console.log('show changed', show());
    // if (show()) {
    //   setTimeout(() => queryInput.select(), 200);
    // }
    if (show()) {
      queryInput?.select();
    }
  });

  createEffect((prevValue) => {
    console.log('prev query', prevValue, 'new query', query());
    queryChanged = true;
  }, query());

  let queryInput: HTMLInputElement;
  let queryChanged: boolean = false;

  return (
    <>
      <button
        class="btn btn-ghost btn-circle"
        onClick={() => setShow((v) => true)}
      >
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
              mutate([]);
              setInput('');
              setQuery('');
              setShow(false);
              e.preventDefault();
            }}
          >
            ✕
          </label>
          <div class="py-4 flex justify-between gap-x-2">
            <input
              type="text"
              ref={queryInput!}
              placeholder="Keywords to search"
              value={input()}
              onInput={(e) => setInput((v) => e.currentTarget.value)}
              class="input input-bordered w-full"
            />

            <Suspense
              fallback={
                <button class="btn loading" disabled>
                  Search...
                </button>
              }
            >
              <button
                class="btn"
                onClick={(e) => {
                  console.log('start query' + data());
                  if (input().trim()) {
                    e.preventDefault;
                    setQuery();
                    setQuery(input());
                  }
                }}
              >
                Search {data() && null}
              </button>
            </Suspense>
          </div>

          <Suspense fallback={'Searching....'}>
            <Show when={data() && data()!.length > 0} fallback={'No Matches'}>
              <div>
                <table class="table table-compact w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th class="w-2/3">Title</th>
                      <th>Author</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={data()}>
                      {(book, i) => (
                        <tr>
                          <th>{i() + 1}</th>
                          <td class="max-w-xs whitespace-normal">
                            {book.name}
                          </td>
                          <td class="whitespace-normal">{book.author}</td>
                          <td>
                            <label
                              class="btn btn-xs btn-primary modal-button"
                              onClick={(_) => {
                                props.setBooks((bks) => [...bks, book]);
                                mutate((books) =>
                                  books?.filter((b) => b !== book)
                                );
                              }}
                            >
                              Add
                            </label>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </Suspense>
        </div>
      </div>
    </>
  );
}
