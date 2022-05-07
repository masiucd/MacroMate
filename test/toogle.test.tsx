import React from "react"
import {renderHook} from "@testing-library/react-hooks"
import {useToggle} from "../src"
// import userEvent from "@testing-library/user-event"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

const TestComponent = () => {
  const [state, handlers] = useToggle(false)
  return (
    <div>
      <h1>{state ? "on" : "off"}</h1>
      <button type="button" onClick={() => handlers.toggle()}>
        click
      </button>
    </div>
  )
}

describe("useToggle hook", () => {
  it("hook can be true or false", () => {
    const {result} = renderHook(() => useToggle())
    expect(result.current[0]).toBeFalsy()
    result.current[1].toggle()
    // Toggle the state
    expect(result.current[0]).toBeTruthy()
    // We now set the state to be falsy
    result.current[1].toFalse()
    expect(result.current[0]).toBeFalsy()
    // Toggle it back to true
    result.current[1].toTrue()
    expect(result.current[0]).toBeTruthy()

    // Reset the state
    result.current[1].reset(false)
    expect(result.current[0]).toBeFalsy()
  })

  it.only("Testing with a component", () => {
    const screen = render(<TestComponent />)

    expect(screen.getByText("off")).toBeInTheDocument()
    expect(screen.queryByText("on")).not.toBeInTheDocument()
    screen.getByRole("button", {name: /click/i}).click()

    screen.rerender(<TestComponent />)
    expect(screen.queryByText("off")).not.toBeInTheDocument()
    expect(screen.getByText("on")).toBeInTheDocument()
    screen.debug()
  })
})
