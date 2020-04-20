import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: ${props => (props.inline ? 'row' : 'column')};
  margin-bottom: ${props => (props.margin ? props.margin : '16px')};
  > div {
    margin-right: ${props => (props.inline ? '15px' : '0px')};
    &:last-child {
      margin-right: 0px;
    }
  }
  &:last-child {
    margin-bottom: 0px;
  }
`

const FormGroup = props => {
  const { children, ...rest } = props

  return <Wrapper {...rest}>{children}</Wrapper>
}

export default FormGroup
