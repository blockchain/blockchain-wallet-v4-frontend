import React from 'react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

interface ITransactionDetailsItemProps {
  label: React.ReactNode
  subValue?: React.ReactNode
  value: React.ReactNode
}

const TransactionDetailsItem: React.FC<ITransactionDetailsItemProps> = ({
  label,
  subValue,
  value
}) => (
  <Flex justifyContent='space-between' alignItems='flex-start'>
    <Text size='12px' lineHeight='18px' color='grey400' weight={500}>
      {label}
    </Text>

    <Flex flexDirection='column' alignItems='flex-end'>
      {value}
      {subValue}
    </Flex>
  </Flex>
)

export default TransactionDetailsItem
