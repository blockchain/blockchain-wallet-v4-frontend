import React from 'react'
import Text from './Text'

const FiatBalance = ({ ...props, children }) => {
  return(
    <Text {...props} size={20} weight={200}>
      {children}
    </Text>
  )
}

export default FiatBalance
