import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']}; 
`

const Faq = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default Faq
