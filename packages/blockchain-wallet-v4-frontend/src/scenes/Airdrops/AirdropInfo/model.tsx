import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import {
  ErrorCartridge,
  GreyCartridge,
  SuccessCartridge
} from 'components/Cartridge'
import { model } from 'data'

const { KYC_STATES } = model.profile

const Copy = styled(Text)`
  margin-top: 8px;
  line-height: 1.5;
`

export const AirdropInfoHeader = () => {
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
            id='scenes.airdrops.success.noactive'
            defaultMessage="There are no active Airdrops at the moment. We'll notify you if a new one starts."
          />
        </Copy>
      )
  }
}

export const AirdropInfoButton = ({ kycState }) => {
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
      return <></>
  }
}
