import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
  flex: 1;
  padding-left: 4px;
`
const Footer = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme['gray-2']};
  z-index: 1;
  box-shadow: 0 -5px 8px -5px rgba(0, 0, 0, 0.15),
    0 -2px 7px -7px rgba(0, 0, 0, 0.5);
`

const FooterShadowWrapper = ({ fields, footer, ...rest }) => (
  <Container {...rest}>
    <Fields>{fields}</Fields>
    <Footer>{footer}</Footer>
  </Container>
)

export default FooterShadowWrapper
