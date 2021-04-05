import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Label = styled.label`
  > div {
    margin-bottom: 5px;
  }
`

const FormLabel = props => {
  const { children, htmlFor, ...rest } = props

  return (
    <Label {...rest} htmlFor={htmlFor}>
      <Text size={'14px'} color='grey800' weight={600}>
        {children}
      </Text>
    </Label>
  )
}

export default FormLabel
