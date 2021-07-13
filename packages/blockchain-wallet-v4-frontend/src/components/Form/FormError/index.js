import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Error = styled(Text)`
  position: ${props => props.position || 'relative'};
  bottom: ${props => props.position === 'absolute' && '-18px'};
`

const FormError = props => {
  const { children, position } = props
  return (
    <Error
      weight={400}
      size='12px'
      color='error'
      position={position}
      data-e2e={props['data-e2e']}
    >
      {children}
    </Error>
  )
}

export default FormError
