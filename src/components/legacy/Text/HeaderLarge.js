import React from 'react'
import Text from './Text'

const HeaderLarge = ({ ...props, children }) => {
  return(
    <Text {...props} size={28} weight={200}>
      {children}
    </Text>
  )
}

export default HeaderLarge
