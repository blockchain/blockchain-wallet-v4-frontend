import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'

const Container = styled.div`
  padding: 15px;
  border: 1px solid ${props => props.theme['gray-1']};
`
const Title = styled(Text)`
  color: ${props => props.theme['brand-primary']};
  margin-bottom: 10px;
`
const Body = styled(Text)`
  font-size: 14px;
  font-weight: 300;
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`

export const Success = ({ value, onClick }) => {
  const { status } = value
  const statusTitleHelper = status => {
    switch (status) {
      case 'PENDING':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.title.pending'
            defaultMessage='Identity Verification Pending'
          />
        )
      case 'FAILED':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.title.failed'
            defaultMessage='Identity Verification Failed'
          />
        )
    }
  }
  const statusBodyHelper = status => {
    switch (status) {
      case 'PENDING':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.pending'
            defaultMessage='It looks like you tried to verify your identity but never finished.'
          />
        )
      case 'FAILED':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.failed'
            defaultMessage='There was a problem with your identity verification documents. Please try again.'
          />
        )
    }
  }

  return (
    status !== 'DONE' && (
      <Container>
        <Title>{statusTitleHelper(status)}</Title>
        <Body>{statusBodyHelper(status)}</Body>
        <ButtonWrapper>
          <Button onClick={onClick} nature='light' uppercase>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.tryagain'
              defaultMessage='Try Again'
            />
          </Button>
        </ButtonWrapper>
      </Container>
    )
  )
}
