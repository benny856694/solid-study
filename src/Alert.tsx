import { Setter } from "solid-js";

type Props = {
  show: boolean;
  setShow: Setter<boolean>;
}

export default function Alert() {
  return (
    <>
      <div class="alert shadow-lg">
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
          <span>we use cookies for no reason.</span>
        </div>
        <div class="flex-none">
          <button class="btn btn-sm btn-ghost">Deny</button>
          <button class="btn btn-sm btn-primary">Accept</button>
        </div>
      </div>
    </>
  );
}
