import React from 'react'
import styled from 'styled-components'

const Hidden = styled.input.attrs({
  type: 'hidden'
})``

const HiddenInput = (field) => {
  return <Hidden {...field.input} />
}

export default HiddenInput
