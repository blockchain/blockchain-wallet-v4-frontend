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
const Link = styled(Text)`
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  text-decoration: underline;
  color: ${props => props.theme['brand-secondary']};
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  > button {
    margin-top: 10px;
  }
`

export const Success = ({ jumioStatus, profile, onClick }) => {
  const { status, completed } = jumioStatus

  const profileStatusHelper = () => {
    let minutesInADay = 1440
    return (
      <Text weight={300} size={'14px'}>
        <FormattedMessage
          id='scenes.buysell.sfoxcheckout.content.jumio.profile'
          defaultMessage='Buy Limit: {buyLimit}. Sell Limit: {sellLimit}. Buy trades will take {buyProcessingTime} days to process and sell trades {sellProcessingTime} days.'
          values={{
            buyLimit: '$' + profile.limits.buy,
            sellLimit: '$' + profile.limits.sell,
            buyProcessingTime: profile.processingTimes.usd.buy / minutesInADay,
            sellProcessingTime: profile.processingTimes.usd.sell / minutesInADay
          }}
        />
      </Text>
    )
  }
  const statusTitleHelper = () => {
    switch (status) {
      case 'DONE':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.title.completed'
            defaultMessage='Identity Verification Completed'
          />
        )
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
  const statusBodyHelper = () => {
    switch (status) {
      case 'DONE':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.completed'
            defaultMessage='Thank you for verifying your identity.'
          />
        )
      case 'PENDING':
        return completed ? (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.pending.awaitingjumio'
            defaultMessage='Thank you for completing your identity verification. It may take our partner a few minutes to finish the verification.'
          />
        ) : (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.pending'
            defaultMessage='It looks like you tried to verify your identity but never finished.'
          />
        )
      case 'FAILED':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.failed'
            defaultMessage='There was a problem verifying your identity. Please try again.'
          />
        )
    }
  }

  const statusButtonHelper = () => {
    switch (status) {
      case 'DONE':
        return null
      case 'PENDING':
        return completed ? (
          <Link>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.refresh'
              defaultMessage='Refresh Status'
            />
          </Link>
        ) : (
          <Button onClick={onClick} nature='light' uppercase>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.tryagain'
              defaultMessage='Try Again'
            />
          </Button>
        )
      case 'FAILED':
        return (
          <Button onClick={onClick} nature='light' uppercase>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.tryagain'
              defaultMessage='Try Again'
            />
          </Button>
        )
    }
  }

  return (
    <Container>
      <Title>{statusTitleHelper()}</Title>
      <Body>
        {statusBodyHelper()}
        <br />
        {profileStatusHelper()}
      </Body>
      <ButtonWrapper>{statusButtonHelper()}</ButtonWrapper>
    </Container>
  )
}
