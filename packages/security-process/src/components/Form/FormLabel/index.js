import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const Label = styled.label`
  > div {
    margin-bottom: 5px;
  }
`

const FormLabel = props => {
  const { children, ...rest } = props

  return (
    <Label {...rest} htmlFor={props.for}>
      <Text size={'14px'} color='gray-6' weight={600}>
        {children}
      </Text>
    </Label>
  )
}

export default FormLabel
