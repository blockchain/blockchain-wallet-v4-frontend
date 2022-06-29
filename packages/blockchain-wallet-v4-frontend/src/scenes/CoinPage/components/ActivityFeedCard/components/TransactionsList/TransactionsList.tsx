import React, { FC } from 'react'

import { Divider } from 'components/Divider'
import { Flex } from 'components/Flex'
import { SeparatedList } from 'components/SeparatedList'

const TransactionsList: FC = ({ children }) => {
  return (
    <Flex flexDirection='column'>
      <Divider />
      <SeparatedList>{children}</SeparatedList>
      <Divider />
    </Flex>
  )
}

export default TransactionsList
