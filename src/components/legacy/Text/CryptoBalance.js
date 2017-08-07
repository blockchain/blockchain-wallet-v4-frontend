import React from 'react'
import Text from './Text'

const CryptoBalance = ({ ...props, children }) => {
  return(
    <Text {...props} size={24} weight={300}>
      {children}
    </Text>
  )
}

export default CryptoBalance
