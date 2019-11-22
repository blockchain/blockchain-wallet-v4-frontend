import { Button, Text } from 'blockchain-info-components'
import { Cartridge } from '@blockchain-com/components'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import React from 'react'
import styled from 'styled-components'

const { KYC_STATES } = model.profile

const Copy = styled(Text)`
  margin-top: 8px;
  line-height: 1.5;
`
export const CustomCartridge = styled(Cartridge)`
  text-transform: none;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 14px;
  margin-left: 0px;
`
export const GreyCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['grey000']};
  color: ${props => props.theme['grey600']};
`
export const ErrorCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['red000']};
  color: ${props => props.theme['red600']};
`
export const SuccessCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['green000']};
  color: ${props => props.theme['green600']};
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
            defaultMessage='You are not eligible for the Blockchain Airdrop program. There was an issue with your identity verification.'
          />
        </Copy>
      )
    case KYC_STATES.VERIFIED:
      return (
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.goldverified'
            defaultMessage='You are eligible for the Blockchain Airdrop program. The easiest way to try and discover new cryptos.'
          />
        </Copy>
      )
    default:
      return (
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.goldlevel'
            defaultMessage='Upgrade to Gold Level to be eligible for the Blockchain Airdrop program. You will be automatically eligible for future Blockchain Airdrops.'
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
            id='scenes.airdrop.pending'
            defaultMessage='Eligibility Pending'
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
              id='scenes.airdrop.eligible'
              defaultMessage='Eligible'
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
        >
          <FormattedMessage
            id='scenes.airdrops.success.completeprofile'
            defaultMessage='Complete My Profile'
          />
        </Button>
      )
  }
}
