import { useEffect, useMemo, useState } from 'react'

import { debounce } from 'utils/helpers'

export const useTokenListSearch = () => {
  const [search, setSearch] = useState<string | undefined>(undefined)

  const onSearchTokens = useMemo(
    () =>
      debounce((s: string) => {
        if (s === null) return
        setSearch(s)
      }, 200),
    []
  )

  useEffect(() => {
    if (search !== undefined) {
      onSearchTokens(search)
    }
  }, [search])

  return {
    onSearchChange: onSearchTokens,
    search
  }
}
