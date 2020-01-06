import {
  BlueCartridge,
  GreyCartridge,
  SuccessCartridge
} from '../AirdropInfo/model'
import { CampaignType } from '../types'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
`
// TypeScript🔮
// attributes: {}
// campaignEndDate: null
// campaignName: "BLOCKSTACK", "SUNRIVER", "POWER_PAX"
// campaignState: "NONE", "STARTED", "ENDED"
// updatedAt: "2019-11-28T11:08:41.927Z"
// userCampaignState: "NONE", "REGISTERED", "TASK_FINISHED", "REWARD_SEND", "REWARD_RECEIVED", "FAILED"
// userCampaignTransactionResponseList: []

export const Type = ({ campaignName }: CampaignType) => {
  switch (campaignName) {
    case 'SUNRIVER':
      return (
        <TypeWrapper>
          <Icon
            name='xlm-circle-filled'
            color='xlm'
            size='24px'
            style={{ marginRight: '8px' }}
          />
          <Text size='14px' weight={500}>
            Stellar (XLM)
          </Text>
        </TypeWrapper>
      )
    case 'POWER_PAX':
      return (
        <TypeWrapper>
          <Icon name='pax' size='24px' style={{ marginRight: '8px' }} />
          <Text size='14px' weight={500}>
            USD Pax
          </Text>
        </TypeWrapper>
      )
    case 'BLOCKSTACK':
      return (
        <TypeWrapper>
          <Icon
            name='stx'
            color='stx'
            size='24px'
            style={{ marginRight: '8px' }}
          />
          <Text size='14px' weight={500}>
            Blockstack
          </Text>
        </TypeWrapper>
      )
    default:
      return <Text>-</Text>
  }
}

export const Status = ({ campaignName, campaignState, userCampaignState }: CampaignType) => {
  // Special case for BLOCKSTACK campaign
  // See convo: https://blockc.slack.com/archives/GSAK5CKD5/p1578309118000200
  if (campaignName === 'BLOCKSTACK') {
    switch (true) {
      case campaignState === 'ENDED' && userCampaignState === 'TASK_FINISHED':
        return (
          <BlueCartridge>
            <Text size='14px' weight={700} color='blue600'>
              <FormattedMessage
                id='scenes.pastairdrops.pending'
                defaultMessage='Reward Pending'
              />
            </Text>
          </BlueCartridge>
        )
    }
  }
  switch (true) {
    case campaignState === 'ENDED' && userCampaignState === 'REWARD_RECEIVED':
      return (
        <SuccessCartridge>
          <Text size='14px' weight={700} color='green600'>
            <FormattedMessage
              id='scenes.pastairdrops.received'
              defaultMessage='Received'
            />
          </Text>
        </SuccessCartridge>
      )
    case campaignState === 'ENDED':
      return (
        <GreyCartridge>
          <Text size='14px' weight={700} color='grey600'>
            <FormattedMessage
              id='scenes.pastairdrops.offerexpired'
              defaultMessage='Offer Expired'
            />
          </Text>
        </GreyCartridge>
      )
    default:
      return <Text>-</Text>
  }
}

export const To = ({ campaignName, userCampaignState }: CampaignType) => {
  switch (campaignName) {
    case 'SUNRIVER':
      return userCampaignState === 'REWARD_RECEIVED' ? (
        <Text size='14px' weight={500}>
          My Stellar Wallet
        </Text>
      ) : (
          <Text>-</Text>
        )
    case 'BLOCKSTACK':
      return userCampaignState === 'REWARD_RECEIVED' ? (
        <Text size='14px' weight={500}>
          My Blockstack Wallet
        </Text>
      ) : (
          <Text>-</Text>
        )
    default:
      return <Text>-</Text>
  }
}
