import { useCallback, useEffect, useState } from 'react'

export const useHash = () => {
  const [hashId, setHashId] = useState('')
  const [hashNewUrl, setHashNewUrl] = useState<string | undefined>()

  const handler = useCallback(() => {
    const h = window.location.hash.substring(1).split('=')
    setHashId(h[0])
    setHashNewUrl(h.slice(1).join('=')) // in case the url contains a colon i need to join the rest of the array
  }, [])

  useEffect(() => {
    handler() // run the handler on mount to set the initial state

    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return { hashId, hashNewUrl }
}
