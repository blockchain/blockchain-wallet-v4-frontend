import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const Container = styled.div`
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  padding: 20px;
  max-width: 300px;
`
const Title = styled(Text)`
  line-height: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
`
const Message = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 300;
`
const Bulb = styled(Text)`
  color: ${props => props.theme['brand-primary']};
  font-size: 24px;
  border: 3px solid ${props => props.theme['brand-primary']};
  border-radius: 3px;
  display: flex;
  width: 24px;
  justify-content: center;
  height: 24px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`

const FaqMessage = ({ title, text, ...rest }) => (
  <Container {...rest}>
    <Bulb>?</Bulb>
    <Title>{title}</Title>
    <Message>{text}</Message>
  </Container>
)

export default FaqMessage
