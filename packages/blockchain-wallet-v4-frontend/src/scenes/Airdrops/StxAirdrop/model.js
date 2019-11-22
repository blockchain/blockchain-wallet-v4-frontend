import {
  CustomCartridge,
  ErrorCartridge,
  GreyCartridge,
  SuccessCartridge
} from '../AirdropInfo/model'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import React from 'react'
import styled from 'styled-components'

const { KYC_STATES } = model.profile

const BlueCartridge = styled(CustomCartridge)`
  cursor: pointer;
  background-color: ${props => props.theme['blue600']};
`

export const StxStatus = ({ tags, kycState, identityVerificationActions }) => {
  switch (kycState) {
    case KYC_STATES.REJECTED:
    case KYC_STATES.EXPIRED:
      return (
        <ErrorCartridge>
          <FormattedMessage
            id='scenes.airdrop.stx.ineligible'
            defaultMessage='Ineligible'
          />
        </ErrorCartridge>
      )
    case KYC_STATES.PENDING:
    case KYC_STATES.UNDER_REVIEW:
      return (
        <GreyCartridge>
          <FormattedMessage
            id='scenes.airdrop.stx.pending'
            defaultMessage='Enrollment Pending'
          />
        </GreyCartridge>
      )
    case KYC_STATES.VERIFIED:
      return tags['BLOCKSTACK'] ? (
        <SuccessCartridge>
          <FormattedMessage
            id='scenes.airdrop.stx.enrolled'
            defaultMessage='Enrolled'
          />
        </SuccessCartridge>
      ) : (
        <BlueCartridge
          onClick={() =>
            identityVerificationActions.claimCampaignClicked('BLOCKSTACK')
          }
        >
          <FormattedMessage
            id='scenes.airdrop.stx.enroll'
            defaultMessage='Enroll'
          />
        </BlueCartridge>
      )
    case KYC_STATES.NONE:
      return (
        <BlueCartridge
          onClick={() => identityVerificationActions.verifyIdentity(2)}
        >
          <FormattedMessage
            id='scenes.airdrop.stx.upgrade'
            defaultMessage='Upgrade'
          />
        </BlueCartridge>
      )
    default:
      return null
  }
}
