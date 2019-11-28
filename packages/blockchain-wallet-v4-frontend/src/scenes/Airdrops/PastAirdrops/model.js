import { FormattedMessage } from 'react-intl'
import { GreyCartridge, SuccessCartridge } from '../AirdropInfo/model'
import { Icon, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
`
// TypeScript🔮
// campaignEndDate: null
// campaignName: "BLOCKSTACK", "SUNRIVER", "POWER_PAX"
// campaignState: "NONE", "STARTED", "ENDED"
// updatedAt: "2019-11-28T11:08:41.927Z"
// userCampaignState: "NONE", "REGISTERED", "TASK_FINISHED", "REWARD_SEND", "REWARD_RECEIVED", "FAILED"
// userCampaignTransactionResponseList: []

export const Type = ({ campaignName }) => {
  switch (campaignName) {
    case 'SUNRIVER':
      return (
        <TypeWrapper>
          <Icon
            name='xlm-circle-filled'
            color='xlm'
            size='24px'
            style={{ marginRight: '16px' }}
          />
          <Text size='14px' weight={500}>
            Stellar (XLM)
          </Text>
        </TypeWrapper>
      )
    default:
      return <Text>-</Text>
  }
}

export const Status = ({ campaignState, userCampaignState }) => {
  switch (true) {
    case campaignState === 'ENDED' && userCampaignState === 'REWARD_RECEIVED':
      return (
        <SuccessCartridge>
          <Text size='14px' weight={500}>
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
          <Text size='14px' weight={600} color='grey600'>
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

export const To = ({ campaignName, userCampaignState }) => {
  switch (campaignName) {
    case 'SUNRIVER':
      return userCampaignState === 'REWARD_RECEIVED' ? (
        <Text size='14px' weight={500}>
          My Stellar Wallet
        </Text>
      ) : (
        <Text>-</Text>
      )
    default:
      return <Text>-</Text>
  }
}
