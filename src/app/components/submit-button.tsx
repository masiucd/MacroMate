"use client";

import {useFormStatus} from "react-dom";

export function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <button type="submit">{pending ? "Loading..." : "Submit"}</button>
  );
}
