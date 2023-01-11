import { useEffect, useMemo, useState } from 'react'

import { debounce } from 'utils/helpers'

export const useTokensListSearch = ({ onSearch }: { onSearch: (s: string) => void }) => {
  const [search, setSearch] = useState<string | undefined>(undefined)

  const onSearchTokens = useMemo(
    () =>
      debounce((s: string) => {
        if (s === null) return
        onSearch(s)
      }, 200),
    []
  )

  useEffect(() => {
    if (search !== undefined) {
      onSearchTokens(search)
    }
  }, [search])

  return {
    onSearchChange: (s: string) => setSearch(s),
    search
  }
}
