import { createSignal, Setter } from 'solid-js';
import { JSX } from 'solid-js/types/jsx';
import type { Book } from './BookShelf';

type AddBookProps = {
  setBooks: Setter<Book[]>;
};

const emptyBook: Book = {
  name: '',
  author: '',
  deleted: false
};

export default function AddBook(props: AddBookProps) {
  const [newBook, setNewbook] = createSignal(emptyBook);
  const [show, setShow] = createSignal(false);

  const addBook: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    e.preventDefault();
    props.setBooks((books) => [...books, newBook()]);
    setNewbook(emptyBook);
  };
  return (
    // <form>
    //   <div class="my-2">
    //     <input
    //       class="block w-full border mb-2 rounded-sm"
    //       type="text"
    //       placeholder="Name"
    //       value={newBook().name}
    //       onChange={(e) =>
    //         setNewbook((book) => ({
    //           name: e.currentTarget.value,
    //           author: book.author,
    //         }))
    //       }
    //     />
    //     <input
    //       class="block w-full border rounded-sm"
    //       type="text"
    //       placeholder="Author"
    //       value={newBook().author}
    //       onChange={(e) =>
    //         setNewbook((book) => ({
    //           name: book.name,
    //           author: e.currentTarget.value,
    //         }))
    //       }
    //     />
    //     <div class="flex justify-center gap-x-2">
    //       <button
    //         class="mt-2 bg-blue-500 rounded-md px-4 text-white py-1 text-sm"
    //         type="submit"
    //         onClick={addBook}
    //       >
    //         Add
    //       </button>
    //       <button
    //         class="btn btn-primary"
    //         onClick={() => props.setShowForm((v) => false)}
    //       >
    //         Done Add
    //       </button>
    //     </div>
    //   </div>
    // </form>
    <>
      <button
        class="btn btn-ghost btn-circle"
        onClick={(_) => setShow((v) => true)}
      >
        <div class="indicator">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
      <input
        type="checkbox"
        checked={show()}
        id="add-modal-5"
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
          <h3 class="font-bold text-lg">Add Book</h3>
          <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div
            class="modal-action"
            onClick={(e) => {
              e.preventDefault();
              setShow((v) => false);
            }}
          >
            <label for="add-modal-5" class="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
