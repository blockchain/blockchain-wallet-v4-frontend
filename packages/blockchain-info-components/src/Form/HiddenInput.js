import React from 'react'
import styled from 'styled-components'

const Hidden = styled.input.attrs({
  type: 'hidden'
})``

const HiddenInput = props => {
  return <Hidden {...props} />
}

export default HiddenInput
