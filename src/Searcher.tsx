import {
  createResource,
  createSignal,
  For,
  Setter,
  Show,
  Suspense,
  createEffect,
  onMount,
} from 'solid-js';

import { Book } from './BookShelf';

type BookItem = {
  title: string;
  author_name: string[];
};

type Props = {
  setBooks: Setter<Book[]>;
  show: boolean;
  error?: string;
};

const url = 'https://openlibrary.org/search.json?q=';

export default function Searcher(props: Props) {
  const [input, setInput] = createSignal('');
  const [query, setQuery] = createSignal<string>();
  const [data, { mutate, refetch }] = createResource<Book[], string>(
    query,
    async (query: string) => {
      console.log('query for: ', query);
      if (query === 'err') throw 'Error Occurred';
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

  createEffect(() => {
    if (props.show) {
      queryInput.focus();
    } else {
      mutate(() => []);
      setQuery();
      setInput('');
    }
  });

  let queryInput: HTMLInputElement;
  let queryChanged: boolean = false;

  return (
    <>
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
              Search
            </button>
          }
        >
          <button
            class="btn"
            disabled={input().length == 0}
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
        <Show
          when={!(data.state === 'errored')}
          fallback={'Error! Please retry'}
        >
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
                        <td class="max-w-xs whitespace-normal">{book.name}</td>
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
        </Show>
      </Suspense>
    </>
  );
}
