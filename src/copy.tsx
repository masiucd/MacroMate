import {useState} from "react"

const useCopy = (): [string | null, (text: string) => Promise<boolean>] => {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported")
      return false
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.error("Failed to copy text", error)
      setCopiedText(null)
      return false
    }
  }
  return [copiedText, copy]
}

export {useCopy}
