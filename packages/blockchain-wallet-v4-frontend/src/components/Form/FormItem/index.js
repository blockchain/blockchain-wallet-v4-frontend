import React from 'react'
import styled from 'styled-components'

// Z-INDEX because otherwise the dropdown menu will be behind other inputs when present
const Wrapper = styled.div`
  position: relative;
  width: ${(props) => props.width || '100%'};

  div.bc__menu {
    z-index: 900;
  }
`

const FormGroup = ({ children, ...rest }) => <Wrapper {...rest}>{children}</Wrapper>

export default FormGroup
