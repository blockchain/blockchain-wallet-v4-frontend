import React from 'react'
import Text from './Text'

const DropdownHeader = ({ ...props, children }) => {
  return(
    <Text {...props} size={16} weight={600}>
      {children}
    </Text>
  )
}

export default DropdownHeader
