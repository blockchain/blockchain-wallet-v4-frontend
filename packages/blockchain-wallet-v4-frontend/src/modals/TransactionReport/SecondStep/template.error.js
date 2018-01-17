import React from 'react'

import { Text } from 'blockchain-info-components'

const TransactionReport = (props) => {
  const { message } = props

  return (
    <Text>{message}</Text>
  )
}

export default TransactionReport
