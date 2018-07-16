import React from 'react'

import { Text } from 'blockchain-info-components'

const Hint = (props) => {
  const { currentHint } = props
  return (
    <Text>{currentHint || ''}</Text>
  )
}

export default Hint
