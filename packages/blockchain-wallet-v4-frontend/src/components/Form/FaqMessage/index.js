import React from 'react'
import styled from 'styled-components'
import { Text, Icon } from 'blockchain-info-components'

const Container = styled.div`
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  padding: 20px;
  max-width: 300px;
`
const Title = styled(Text)`
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 10px;
`
const Message = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 200;
`
const FaqIcon = styled(Icon)`
  color: ${props => props.theme['brand-primary']};
  font-size: 24px;
  display: flex;
  width: 24px;
  justify-content: center;
  height: 24px;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 16px;
`

const FaqMessage = ({ title, text, icon, ...rest }) => (
  <Container {...rest}>
    <FaqIcon name={icon} />
    <Title>{title}</Title>
    <Message>{text}</Message>
  </Container>
)

export default FaqMessage
