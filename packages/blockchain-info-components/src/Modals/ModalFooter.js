import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme['gray-1']};
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const ModalFooter = props => {
  const { children } = props

  return (
    <Wrapper>
      <Footer>
        {children}
      </Footer>
    </Wrapper>
  )
}

export default ModalFooter
