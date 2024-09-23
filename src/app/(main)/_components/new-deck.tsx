"use client";
import {PlusIcon} from "lucide-react";
import {useMemo, useRef, useState} from "react";
import {useFormState} from "react-dom";

import {createDeck} from "@/actions";

function useToggle(initialState: boolean): [
  boolean,
  {
    toTrue: () => void;
    toFalse: () => void;
    toggle: () => void;
    reset: () => void;
  },
] {
  let [isOpen, setIsOpen] = useState(initialState);

  return [
    isOpen,
    useMemo(
      () => ({
        toTrue: () => setIsOpen(true),
        toFalse: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
        reset: () => setIsOpen(initialState),
      }),
      [initialState],
    ),
  ];
}

export function NewDeck() {
  let [isOpen, {toggle, toFalse}] = useToggle(false);
  let [state, formAction] = useFormState(createDeck, null);
  let ref = useRef<HTMLFormElement | null>(null);

  return (
    <div>
      <button onClick={toggle} className="flex items-center gap-2">
        <PlusIcon size={16} /> New Deck
      </button>
      {isOpen && (
        <form
          className="flex gap-2 px-2"
          action={(data: FormData) => {
            formAction(data);
            toFalse();
          }}
          ref={ref}
        >
          <input
            required
            type="text"
            name="name"
            className="w-28 border border-gray-300"
          />
          <input type="hidden" name="userid" value="1" />
          <button type="submit">Create</button>
        </form>
      )}
      {state && <p>{state.message}</p>}
    </div>
  );
}
