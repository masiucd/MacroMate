import {waitFor} from "@testing-library/react"
import {renderHook} from "@testing-library/react-hooks"
import {useCopy} from "../src"

const originalClipboard = {...global.navigator.clipboard}

beforeEach(() => {
  const mockClipboard = {
    writeText: jest.fn(),
  }
  // @ts-ignore
  global.navigator.clipboard = mockClipboard
})

afterEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  global.navigator.clipboard = originalClipboard
})

describe("useCoppy hook", () => {
  test("Copy should work as expected", async () => {
    const {
      result: {
        current: [copiedText, copy],
      },
    } = renderHook(() => useCopy())
    expect(copiedText).toBe(null)
    // Copy the text
    const success = await copy("test")
    expect(success).toBeTruthy()
  })
})
