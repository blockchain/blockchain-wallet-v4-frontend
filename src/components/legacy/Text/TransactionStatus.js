import React from 'react'
import Text from './Text'

const TransactionStatus = ({ ...props, children }) => {
  return(
    <Text {...props} size={16} weight={400}>
      {children}
    </Text>
  )
}

export default TransactionStatus
