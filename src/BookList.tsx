import { createSignal, For, Setter, Show } from 'solid-js';
import { Book } from './BookShelf';
import _ from 'lodash';

type Props = {
  books: Book[];
  setBooks: Setter<Book[]>;
};

const BookList = (props: Props) => {
  const markForDelete = (book: Book) => {
    book.deleted = true;
    props.setBooks((bks) =>
      bks.map((b) => {
        return b !== book ? b : { ...book };
      })
    );
  };

  const purge = (book: Book) => {
    book.deleted = true;
    props.setBooks((bks) => bks.filter((b) => b !== book));
  };

  const [currentAction, setCurrentAction] = createSignal<'purge' | 'delete'>(
    'delete'
  );

  return (
    <>
      <div class="overflow-x-auto">
        <table class="table table-fixed table-compact w-full">
          <thead>
            <tr>
              <th class="w-10"></th>
              <th
                classList={{
                  'whitespace-nowrap': true,
                  'overflow-hidden': true,
                  'text-ellipsis': true,
                  block: true,
                  'w-2/6': false,
                }}
              >
                Title
              </th>
              <th class="text-ellipsis">Author</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.books}>
              {(book, i) => (
                <tr>
                  <th>{i() + 1}</th>
                  <td
                    classList={{
                      'whitespace-nowrap': true,
                      'overflow-hidden': true,
                      'text-ellipsis': true,
                      block: true,
                      'w-2/6': false,
                      'line-through': book.deleted,
                      'text-red-400': book.deleted,
                      italic: book.deleted,
                    }}
                  >
                    {book.name}
                  </td>
                  <td class="whitespace-nowrap text-ellipsis overflow-hidden">
                    {book.author}
                  </td>
                  <td>
                    <Show
                      when={!book.deleted}
                      fallback={
                        <label
                          for={'my-modal-' + i()}
                          onClick={() => setCurrentAction('purge')}
                          class="btn btn-xs btn-error modal-button"
                        >
                          Purge
                        </label>
                      }
                    >
                      <label
                        for={'my-modal-' + i()}
                        onClick={() => setCurrentAction('delete')}
                        class="btn btn-xs btn-warning modal-button"
                      >
                        Remove
                      </label>
                    </Show>

                    <input
                      type="checkbox"
                      id={'my-modal-' + i()}
                      class="modal-toggle"
                    />
                    <div class="modal">
                      <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirm</h3>
                        <p class="py-4 whitespace-normal">
                          Are you sure to remove the book: {book.name}?
                        </p>
                        <div class="modal-action">
                          <Show when={currentAction() === 'delete'}>
                            <label
                              for={'my-modal-' + i()}
                              class="btn btn-error"
                              onClick={() => purge(book)}
                            >
                              Purge
                            </label>
                          </Show>
                          <label
                            for={'my-modal-' + i()}
                            class="btn"
                            onClick={() =>
                              currentAction() === 'delete'
                                ? markForDelete(book)
                                : purge(book)
                            }
                          >
                            Ok
                          </label>
                          <label for={'my-modal-' + i()} class="btn">
                            Cancel
                          </label>
                        </div>
                      </div>
                    </div>
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
                  class="btn btn-xs btn-error"
                  onClick={() => props.setBooks([])}
                >
                  Clear All
                </button>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <ul class="mt-2"></ul>
    </>
  );
};

export default BookList;
