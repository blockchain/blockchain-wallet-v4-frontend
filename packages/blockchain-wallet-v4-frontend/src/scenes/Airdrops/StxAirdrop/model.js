import { Button, Link } from 'blockchain-info-components'
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
  font-weight: 600;
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
            defaultMessage='Pending KYC'
          />
        </GreyCartridge>
      )
    case KYC_STATES.VERIFIED:
      return tags['BLOCKSTACK'] ? (
        <SuccessCartridge>
          <FormattedMessage
            id='scenes.airdrop.stx.claimed'
            defaultMessage='Claimed'
          />
        </SuccessCartridge>
      ) : (
        <BlueCartridge
          onClick={() =>
            identityVerificationActions.claimCampaignClicked('BLOCKSTACK')
          }
        >
          <FormattedMessage
            id='scenes.airdrop.stx.claim'
            defaultMessage='Claim'
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

export const StxShare = ({ tags, kycState }) => {
  switch (kycState) {
    case KYC_STATES.REJECTED:
    case KYC_STATES.EXPIRED:
    case KYC_STATES.PENDING:
    case KYC_STATES.UNDER_REVIEW:
    case KYC_STATES.NONE:
      return (
        <Link
          href='https://blockstack.org/try-blockstack'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button nature='light' fullwidth>
            <FormattedMessage
              id='scenes.airdrop.stx.learnmore'
              defaultMessage='Learn More'
            />
          </Button>
        </Link>
      )
    case KYC_STATES.VERIFIED:
      return tags['BLOCKSTACK'] ? (
        <Link
          href='https://blockchain.com/getcrypto'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button nature='light' fullwidth>
            <FormattedMessage
              id='scenes.airdrop.stx.share'
              defaultMessage='Share'
            />
          </Button>
        </Link>
      ) : (
        <Link
          href='https://blockstack.org/try-blockstack'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button nature='light' fullwidth>
            <FormattedMessage
              id='scenes.airdrop.stx.learnmore'
              defaultMessage='Learn More'
            />
          </Button>
        </Link>
      )
    default:
      return null
  }
}
