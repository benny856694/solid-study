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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('start query' + data());
          if (input().trim()) {
            setQuery();
            setQuery(input());
          }
        }}
        class="py-4 flex justify-between gap-x-2"
      >
        <input
          type="text"
          ref={queryInput!}
          placeholder="Keywords to search"
          value={input()}
          onInput={(e) => setInput((v) => e.currentTarget.value)}
          class="input input-bordered w-full"
        />

        <button
          classList={{ btn: true, loading: data.loading }}
          disabled={data.loading}
          type="submit"
        >
          Search {data() && null}
        </button>
      </form>

      <Suspense fallback={'Searching....'}>
        <Show
          when={!(data.state === 'errored')}
          fallback={'Error! Please retry'}
        >
          <Show when={data() && data()!.length > 0} fallback={'No Matches'}>
            <table class="table table-fixed table-compact w-full">
              <thead>
                <tr>
                  <th class="w-10"></th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                <For each={data()}>
                  {(book, i) => (
                    <tr class="group">
                      <th>{i() + 1}</th>
                      <td class="whitespace-normal">{book.name}</td>
                      <td class="whitespace-normal">{book.author}</td>
                      <td>
                        <label
                          class="btn btn-xs btn-primary modal-button invisible group-hover:visible"
                          onClick={(_) => {
                            props.setBooks((bks) => [...bks, book]);
                            mutate((books) => books?.filter((b) => b !== book));
                          }}
                        >
                          Add
                        </label>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <button
                      class="btn btn-xs btn-primary"
                      onClick={() =>
                        props.setBooks((bks) => {
                          var ret = [...bks, ...data()!];
                          mutate([]);
                          return ret;
                        })
                      }
                    >
                      Add All
                    </button>
                  </th>
                </tr>
              </tfoot>
            </table>
          </Show>
        </Show>
      </Suspense>
    </>
  );
}
