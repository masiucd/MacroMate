import {useMemo, useState} from "react"

const useToggle = (
  initialState = false
): [
  boolean,
  {
    toggle: () => void
    toTrue: () => void
    toFalse: () => void
    reset: (initialState: boolean) => void
  }
] => {
  const [state, setState] = useState(initialState)
  const handlers = useMemo(
    () => ({
      toggle: () => {
        setState((prev) => !prev)
      },

      toTrue: () => {
        setState(true)
      },

      toFalse: () => {
        setState(false)
      },

      reset: (initialState: boolean) => {
        setState(initialState)
      },
    }),
    [initialState]
  )

  return [state, handlers]
}

export {useToggle}
