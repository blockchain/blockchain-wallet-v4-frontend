import React from 'react'
import Text from './Text'

const BalanceTableFiat = ({ ...props, children }) => {
  return(
    <Text {...props} size={12} weight={300}>
      {children}
    </Text>
  )
}

export default BalanceTableFiat
