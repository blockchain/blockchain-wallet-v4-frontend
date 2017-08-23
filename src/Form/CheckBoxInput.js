import React from 'react'
import styled from 'styled-components'

const BaseCheckBoxInput = styled.input.attrs({
  type: 'checkbox'
})`
  display: block;
  width: 20px;
  height: 20px;
`

const CheckBoxInput = props => {
  const { errorState, ...rest } = props

  return <BaseCheckBoxInput {...rest} />
}

export default CheckBoxInput
