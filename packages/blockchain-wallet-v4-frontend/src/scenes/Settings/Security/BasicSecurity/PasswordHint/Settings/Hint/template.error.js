import React from 'react'

import { Text } from 'blockchain-info-components'

const Hint = (props) => {
  const { message } = props
  return (
    <Text>{message}</Text>
  )
}

export default Hint
