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
        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th class="w-2/4">Title</th>
              <th>Author</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <For each={props.books}>
              {(book, i) => (
                <tr>
                  <th>{i() + 1}</th>
                  <td
                    classList={{
                      'line-through': book.deleted,
                      'text-red-400': book.deleted,
                      italic: book.deleted,
                      'whitespace-normal': true,
                    }}
                  >
                    {book.name}
                  </td>
                  <td class="whitespace-normal">{book.author}</td>
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
                              class="btn"
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
        </table>
      </div>
      <ul class="mt-2"></ul>
    </>
  );
};

export default BookList;
