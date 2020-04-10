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
  scroll-behavior: smooth;
  flex-direction: column;
  overflow: auto;
  position: relative;
  flex: 1;
`
const Footer = styled.div`
  padding: 22px 0;
  border-top: 1px solid ${props => props.theme.grey000};
  z-index: 1;
`

const FooterShadowWrapper = ({ fields, footer, ...rest }) => (
  <Container {...rest}>
    <Fields id={rest.scrollRefId}>{fields}</Fields>
    <Footer>{footer}</Footer>
  </Container>
)

export default FooterShadowWrapper
