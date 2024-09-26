"use client";

import {useFormState} from "react-dom";

import {login} from "@/actions";
import {SubmitButton} from "@/app/components/submit-button";

// TODO: Add single sign-on (OAuth) as an option
export function LoginForm() {
  let [state, action] = useFormState(login, null);
  return (
    <div className="rounded-md border border-gray-200 p-5 ">
      <form action={action}>
        <fieldset className="flex flex-col gap-2">
          <legend>Login</legend>
          <input
            required
            type="email"
            name="email"
            className="border border-gray-400"
          />
          <input
            type="password"
            name="password"
            className="border border-gray-400"
            required
          />
          <SubmitButton />
        </fieldset>
      </form>
      {state && <p>{state.message}</p>}
    </div>
  );
}
