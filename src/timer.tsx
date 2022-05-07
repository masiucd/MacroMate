import {useRef, useState} from "react"

const useTimer = () => {
  const [startTime, setStartTime] = useState<null | number>(null)
  const [now, setNow] = useState<null | number>(null)
  const intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | undefined> = useRef()
  // ReturnType<typeof setInterval>
  const start = () => {
    setStartTime(Date.now())
    setNow(Date.now())

    // @ts-ignore
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  const stop = () => {
    // @ts-ignore
    clearInterval(intervalRef.current)
  }

  let secondsPassed = 0
  if (startTime !== null && now !== null) {
    secondsPassed = Math.floor((now - startTime) / 1000)
  }
  return [secondsPassed, start, stop]
}

export {useTimer}
