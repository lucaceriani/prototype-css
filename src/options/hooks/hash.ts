import { useCallback, useEffect, useState } from 'react'

export const useHash = () => {
  const [locationHash, setLocationHash] = useState(window.location.hash.substring(1))
  const handler = useCallback(() => setLocationHash(window.location.hash.substring(1)), [])

  useEffect(() => {
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return locationHash
}
