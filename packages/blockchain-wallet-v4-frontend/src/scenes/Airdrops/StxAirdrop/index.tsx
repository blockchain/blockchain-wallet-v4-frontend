import { Box } from '../AirdropInfo'
import { CampaignInfoType, TagsType } from 'data/types'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import { KycStatesType } from 'data/components/identityVerification/types'
import { LinkDispatchPropsType } from '..'
import { StxShare, StxStatus } from './model'
import React from 'react'
import styled from 'styled-components'

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
const Date = styled.div`
  height: 100%;
  padding-left: 20px;
  border-left: 1px solid ${props => props.theme.grey000};

  > div:first-child {
    margin-bottom: 4px;
  }
`

export type Props = {
  userCampaignsInfoResponseList: Array<CampaignInfoType>,
  kycState: KycStatesType,
  tags: TagsType
}

const StxAirdrop = (props: Props & LinkDispatchPropsType) => {
  const stxCampaign = props.userCampaignsInfoResponseList.find(
    (campaign: CampaignInfoType) => campaign.campaignName === 'BLOCKSTACK'
  )
  const receivedAirdrop = stxCampaign && stxCampaign.userCampaignState === 'REWARD_RECEIVED'

  return stxCampaign && stxCampaign.userCampaignState !== 'NONE' ? (
    <Box>
      <div>
        <Header>
          <Icon name='stx' color='stx' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginLeft: '16px' }}
          >
            {receivedAirdrop ? (
              <FormattedMessage
                id='scenes.airdrops.stx.wallet.title'
                defaultMessage='My Blockstack Wallet'
              />
            ) : (
              <FormattedMessage
                id='scenes.airdrops.stx'
                defaultMessage='Blockstack'
              />
            )}
          </Text>
        </Header>
        {receivedAirdrop ? (
          <>
            <Text color='grey800' size='14px' weight={700} style={{ margin: '16px 0 4px' }}>
              <FormattedMessage
                id='scenes.airdrops.stx.wallet.q1'
                defaultMessage='Where are my Stacks?'
              />
            </Text>
            <Text size='13px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.airdrops.stx.wallet.a1'
                defaultMessage='Your Stacks (STX) are saved in your Blockchain Wallet.'
              />
            </Text>
          </>
        ) : (
          <Text
            size='12px'
            color='grey600'
            weight={500}
            lineHeight='1.5'
            style={{ marginTop: '16px' }}
          >
            <FormattedHTMLMessage
              id='scenes.airdrop.stx.stxinfo1'
              defaultMessage='Own your digital identity and data with hundreds of decentralized apps built with Blockstack.'
            />{' '}
            <Link
              href='https://blockstack.org/try-blockstack'
              target='_blank'
              rel='noopener noreferrer'
              size='12px'
            >
              <FormattedHTMLMessage
                id='scenes.airdrop.stx.learnmore'
                defaultMessage='Learn more'
              />
            </Link>
          </Text>
        )}
        <StatusContainer>
          <div>
            <StxStatus {...props} />
          </div>
          {receivedAirdrop ? (
            <Date>
              <Text size='16px' color='grey800' weight={600}>
                {stxCampaign.userCampaignTransactionResponseList.length && stxCampaign.userCampaignTransactionResponseList[0].withdrawalQuantity}
                {' STX'}
              </Text>
              <Text size='12px' color='grey600' weight={500}>
                <FormattedMessage
                  id='scenes.airdrop.stx.wallet'
                  defaultMessage='My Blockstack Wallet'
                />
              </Text>
            </Date>
          ) : (
            <Date>
              <Text size='16px' color='grey800' weight={600}>
                <FormattedMessage
                  id='scenes.airdrop.stx.jan'
                  defaultMessage='Jan. 2020'
                />
              </Text>
              <Text size='12px' color='grey600' weight={500}>
                <FormattedMessage
                  id='scenes.airdrop.stx.date'
                  defaultMessage='Airdrop Date'
                />
              </Text>
            </Date>
          )}
        </StatusContainer>
        <div style={{ marginTop: '26px' }}>
          {receivedAirdrop ? (
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.airdrop.stx.wallet.balance'
                defaultMessage='Please note the balance is currently non-transferable. Learn more about this and future wallet support for STX'
              />
              {' '}
              <Link
                href='https://support.blockchain.com/hc/en-us/articles/360038745191'
                target='_blank'
                size='12px'
                weight={500}
                style={{ textDecoration: 'underline' }}
              >
                <FormattedMessage
                  id='scenes.airdrops.blockstack.wallet.here'
                  defaultMessage='here'
                />
              </Link>
              {'.'}
            </Text>
          ) : (
            <StxShare {...props} />
          )}
        </div>
      </div>
    </Box>
  ) : null
}

export default StxAirdrop
