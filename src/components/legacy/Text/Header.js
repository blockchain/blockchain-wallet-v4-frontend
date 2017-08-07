import React from 'react'
import Text from './Text'

const Header = ({ ...props, children }) => {
  return(
    <Text {...props} size={24} weight={200}>
      {children}
    </Text>
  )
}

export default Header
