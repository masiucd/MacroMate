import {useMemo, useState} from "react"

const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState)
  const handlers = useMemo(() => {
    return {
      toggle: () => {
        setState((prev) => !prev)
      },
      toTrue: () => {
        setState(true)
      },
      toFalse: () => {
        setState(false)
      },
      reset: () => {
        setState(initialState)
      },
    }
  }, [initialState])

  return [state, handlers]
}

export {useToggle}
