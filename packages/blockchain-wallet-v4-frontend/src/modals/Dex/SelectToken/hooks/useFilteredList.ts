import { useEffect, useState } from 'react'

import { UseFilteredListType } from './types'

export const useFilteredList = ({ items, search = '' }: UseFilteredListType) => {
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => {
    // filter through filteredItems and set filtered items
    if (search.length === 0) {
      setFilteredItems(items)
      return
    }

    const newFilteredItems = items.filter(
      ({ name, symbol }) =>
        name.toLowerCase().includes(search.toLowerCase()) ||
        symbol.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredItems(newFilteredItems)
  }, [items, search])

  return filteredItems
}

export default useFilteredList
