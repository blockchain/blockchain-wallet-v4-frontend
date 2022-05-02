import React, { Children, useMemo } from 'react'

import { Divider } from 'components/Divider'
import { Flex } from 'components/Flex'

import { SeparatedListComponent } from './types'

export const SeparatedList: SeparatedListComponent = ({ children, separator = <Divider /> }) => {
  const isMultipleChildren = useMemo(() => Children.count(children), [children])

  if (isMultipleChildren) {
    return (
      <Flex flexDirection='column'>
        {Children.map(children, (child, index) => {
          if (index === 0) return child

          return (
            <>
              {separator}
              {child}
            </>
          )
        })}
      </Flex>
    )
  }

  return <Flex flexDirection='column'>{children}</Flex>
}
