import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { Box } from 'components/Box'
import { CampaignInfoType } from 'data/types'

import { Props } from '../template.success'
import {
  StxDateOrAmount,
  StxFooterCta,
  StxHeader,
  StxInfo,
  StxStatus
} from './model'

const Header = styled.div`
  display: flex;
  align-items: center;
`
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 26px;
  min-height: 50px;
  > div {
    width: 50%;
  }
`

const StxAirdrop = (props: Props) => {
  if (props.userDoesNotExistYet === true) return null

  const stxCampaign = props.userCampaignsInfoResponseList.find(
    (campaign: CampaignInfoType) => campaign.campaignName === 'BLOCKSTACK'
  )

  // do not show card if user did not sign up for airdrop
  if (
    !stxCampaign ||
    !stxCampaign.userCampaignState ||
    stxCampaign.userCampaignState === 'NONE'
  )
    return null

  return (
    <Box>
      <div>
        <Header>
          <Icon name='STX' color='STX' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginLeft: '16px' }}
          >
            <StxHeader stxCampaign={stxCampaign} />
          </Text>
        </Header>
        <StxInfo stxCampaign={stxCampaign} />
        <StatusContainer>
          <div>
            <StxStatus {...props} />
          </div>
          <StxDateOrAmount stxCampaign={stxCampaign} />
        </StatusContainer>
        <div style={{ marginTop: '26px' }}>
          <StxFooterCta {...props} />
        </div>
      </div>
    </Box>
  )
}

export default StxAirdrop
