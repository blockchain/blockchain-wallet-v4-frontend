import {
  BlueCartridge,
  CustomCartridge,
  ErrorCartridge,
  GreyCartridge,
  SuccessCartridge
} from '../AirdropInfo/model'
import { Button, Link } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import React from 'react'
import styled from 'styled-components'

const { KYC_STATES } = model.profile

const BlueCartridgeCTA = styled(CustomCartridge)`
  cursor: pointer;
  background-color: ${props => props.theme['blue600']};
  font-weight: 600;
`

const Ended = () => {
  return (
    <GreyCartridge>
      <FormattedMessage
        id='scenes.airdrop.stx.expired'
        defaultMessage='Offer Expired'
      />
    </GreyCartridge>
  )
}

// TypeScript🔮
// attributes: {'x-campaign-reject-reason': string}
// campaignEndDate: null
// campaignName: "BLOCKSTACK", "SUNRIVER", "POWER_PAX"
// campaignState: "NONE", "STARTED", "ENDED"
// updatedAt: "2019-11-28T11:08:41.927Z"
// userCampaignState: "NONE", "REGISTERED", "TASK_FINISHED", "REWARD_SEND", "REWARD_RECEIVED", "FAILED"
// userCampaignTransactionResponseList: []
export const StxStatus = ({
  userCampaignsInfoResponseList = [],
  kycState,
  identityVerificationActions
}) => {
  const blockstackCampaign = userCampaignsInfoResponseList.find(
    campaign => campaign.campaignName === 'BLOCKSTACK'
  )

  if (
    kycState !== KYC_STATES.VERIFIED &&
    blockstackCampaign.campaignState === 'ENDED'
  ) {
    return <Ended />
  }

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
      switch (blockstackCampaign.userCampaignState) {
        case 'FAILED':
          return (
            <ErrorCartridge>
              <FormattedMessage
                id='scenes.airdrop.stx.failed'
                defaultMessage='Failed'
              />
            </ErrorCartridge>
          )
        case 'REWARD_RECEIVED':
          return (
            <SuccessCartridge>
              <FormattedMessage
                id='scenes.airdrop.stx.received'
                defaultMessage='Received'
              />
            </SuccessCartridge>
          )
        case 'NONE':
          if (blockstackCampaign.campaignState === 'ENDED') {
            return <Ended />
          }

          return (
            <BlueCartridgeCTA
              onClick={() =>
                identityVerificationActions.claimCampaignClicked('BLOCKSTACK')
              }
            >
              <FormattedMessage
                id='scenes.airdrop.stx.claim'
                defaultMessage='Claim'
              />
            </BlueCartridgeCTA>
          )
        case 'TASK_FINISHED':
          return (
            <BlueCartridge>
              <FormattedMessage
                id='scenes.airdrop.stx.reward_pending'
                defaultMessage='Reward Pending'
              />
            </BlueCartridge>
          )
        case 'REWARD_SEND':
        case 'REGISTERED':
          return blockstackCampaign.attributes['x-campaign-reject-reason'] ? (
            <ErrorCartridge>
              <FormattedMessage
                id='scenes.airdrop.stx.ineligible'
                defaultMessage='Ineligible'
              />
            </ErrorCartridge>
          ) : (
            <SuccessCartridge>
              <FormattedMessage
                id='scenes.airdrop.stx.claimed'
                defaultMessage='Claimed'
              />
            </SuccessCartridge>
          )
      }
      return null
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
