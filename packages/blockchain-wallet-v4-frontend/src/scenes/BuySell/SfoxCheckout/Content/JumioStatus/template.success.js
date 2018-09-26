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
  margin-top: 10px;
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
const ProfileStatus = styled.div`
  margin-top: 10px;
`

export const Success = ({
  jumioStatus,
  jumioToken,
  profile,
  handleOpen,
  handleRefresh
}) => {
  const { status } = jumioStatus
  const { completed } = jumioToken

  const profileStatusHelper = () => {
    return (
      <ProfileStatus>
        <Text weight={300} size={'14px'}>
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.buylimit'
            defaultMessage='Buy Limit: {buyLimit}'
            values={{ buyLimit: '$' + profile.limits.buy }}
          />
        </Text>
        <Text weight={300} size={'14px'}>
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.selllimit'
            defaultMessage='Sell Limit: {sellLimit}'
            values={{ sellLimit: '$' + profile.limits.sell }}
          />
        </Text>
      </ProfileStatus>
    )
  }
  const statusTitleHelper = () => {
    switch (status) {
      case 'DONE':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.title.completed'
            defaultMessage='Success! Identity Verification Complete'
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
      case 'PENDING':
        return completed ? (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.pending.awaitingjumio'
            defaultMessage="You're almost there! The uploaded information is being reviewed. This should just take a few minutes."
          />
        ) : (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.pending'
            defaultMessage='Your identity verification is incomplete. Please continue to follow the steps to complete the process.'
          />
        )
      case 'FAILED':
        return (
          <FormattedMessage
            id='scenes.buysell.sfoxcheckout.content.jumio.body.failed'
            defaultMessage='The system has failed to verify your identity. Contact support@sfox.com for more information.'
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
          <Link onClick={handleRefresh}>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.refresh'
              defaultMessage='Refresh Status'
            />
          </Link>
        ) : (
          <Button onClick={handleOpen} nature='light'>
            <FormattedMessage
              id='scenes.buysell.sfoxcheckout.content.jumio.button.complete_verification'
              defaultMessage='Complete Verification'
            />
          </Button>
        )
      case 'FAILED':
        return (
          <Button onClick={handleOpen} nature='light'>
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
        {profileStatusHelper()}
      </Body>
      <ButtonWrapper>{statusButtonHelper()}</ButtonWrapper>
    </Container>
  )
}
