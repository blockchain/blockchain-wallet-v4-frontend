import React from 'react'
import Text from './Text'

const DropdownHeader = ({ ...props, children }) => {
  return(
    <Text {...props} size={14} weight={300}>
      {children}
    </Text>
  )
}

export default DropdownHeader
