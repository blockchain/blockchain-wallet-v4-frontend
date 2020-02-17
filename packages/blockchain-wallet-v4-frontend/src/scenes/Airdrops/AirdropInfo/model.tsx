import { Button, Text } from 'blockchain-info-components'
import {
  ErrorCartridge,
  GreyCartridge,
  SuccessCartridge
} from 'components/Cartridge'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import React from 'react'
import styled from 'styled-components'

const { KYC_STATES } = model.profile

const Copy = styled(Text)`
  margin-top: 8px;
  line-height: 1.5;
`

export const AirdropInfoHeader = ({ kycState }) => {
  switch (kycState) {
    case KYC_STATES.VERIFIED:
      return (
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.airdrops.success.airdropprogram'
            defaultMessage='Airdrop Program'
          />
        </Text>
      )
    default:
      return (
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.airdrops.success.getfreecrypto'
            defaultMessage='Get Free Crypto'
          />
        </Text>
      )
  }
}

export const AirdropInfoCopy = ({ kycState }) => {
  switch (kycState) {
    case KYC_STATES.REJECTED:
    case KYC_STATES.EXPIRED:
      return (
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.goldfailed'
            defaultMessage='You are not enrolled in the Blockchain Airdrop program. There was an issue with your identity verification.'
          />
        </Copy>
      )
    case KYC_STATES.VERIFIED:
      return (
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.goldverified'
            defaultMessage='You are enrolled in the Blockchain Airdrop program. The easiest way to try and discover new cryptos.'
          />
        </Copy>
      )
    default:
      return (
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.goldlevel1'
            defaultMessage='Upgrade to Gold Level to enroll in the Blockchain Airdrop program. You will then be eligible for future Blockchain Airdrops.'
          />
        </Copy>
      )
  }
}

export const AirdropInfoButton = ({
  kycState,
  identityVerificationActions
}) => {
  switch (kycState) {
    case KYC_STATES.PENDING:
    case KYC_STATES.UNDER_REVIEW:
      return (
        <GreyCartridge style={{ marginTop: '16px' }}>
          <FormattedMessage
            id='scenes.airdrop.enrollmentpending'
            defaultMessage='Enrollment Pending'
          />
        </GreyCartridge>
      )
    case KYC_STATES.REJECTED:
    case KYC_STATES.EXPIRED:
      return (
        <ErrorCartridge style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='scenes.airdrop.ineligible'
            defaultMessage='Ineligible KYC State: {kycState}'
            values={{ kycState }}
          />
        </ErrorCartridge>
      )
    case KYC_STATES.VERIFIED:
      return (
        <>
          <Text
            size='14px'
            style={{ marginBottom: '16px' }}
            color='grey600'
            weight={500}
          >
            <FormattedMessage
              id='scenes.airdrop.notify'
              defaultMessage='We will notify you for future airdrops.'
            />
          </Text>
          <SuccessCartridge>
            <FormattedMessage
              id='scenes.airdrop.enrolled'
              defaultMessage='Enrolled'
            />
          </SuccessCartridge>
        </>
      )
    default:
      return (
        <Button
          nature='green'
          fullwidth
          onClick={() => identityVerificationActions.verifyIdentity(2)}
          style={{ marginTop: '32px' }}
          data-e2e='upgradeNow'
        >
          <FormattedMessage
            id='scenes.airdrops.success.upgradenow'
            defaultMessage='Upgrade Now'
          />
        </Button>
      )
  }
}
