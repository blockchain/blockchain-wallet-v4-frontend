import React from 'react'
import Text from './Text'

const DidYouKnow = ({ ...props, children }) => {
  return(
    <Text {...props} size={18} weight={300}>
      {children}
    </Text>
  )
}

export default DidYouKnow
