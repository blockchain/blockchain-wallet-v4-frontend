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
  flex: 1;
`
const WhiteSpace = styled.div`
  background: ${props => props.theme['white']};
  z-index: 2;
  flex: 1;
  min-height: 8px;
`
const Footer = styled.div`
  padding: 32px 0 32px 0;
  border-top: 1px solid ${props => props.theme['gray-2']};
  z-index: 1;
  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 -7px 8px -5px rgba(0, 0, 0, 0.15),
    0 -2px 4px -4px rgba(0, 0, 0, 0.5);
`

const FooterShadowWrapper = ({ fields, footer, ...rest }) => (
  <Container {...rest}>
    <Fields>
      {fields}
      <WhiteSpace />
    </Fields>
    <Footer>{footer}</Footer>
  </Container>
)

export default FooterShadowWrapper
