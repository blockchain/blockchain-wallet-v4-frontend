import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
`

const Faq = (props) => (
  <Wrapper {...props}>
    {props.children}
  </Wrapper>
)

export default Faq
