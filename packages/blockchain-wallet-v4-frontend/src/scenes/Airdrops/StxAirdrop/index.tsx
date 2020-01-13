import { Box } from '../AirdropInfo'
import { CampaignInfoType, TagsType } from 'data/types'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import { KycStatesType } from 'data/components/identityVerification/types'
import { LinkDispatchPropsType } from '..'
import { StxShare, StxStatus } from './model'
import React from 'react'
import styled from 'styled-components'
import { propEq } from 'ramda'

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

const CompletedWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 280px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.grey000};
  background-color: ${props => props.theme.stx};
  color: ${props => props.theme.white};
`
const TextParagraph = styled(Text)`
  margin-bottom: 16px;
`

export type Props = {
  userCampaignsInfoResponseList: Array<CampaignInfoType>,
  kycState: KycStatesType,
  tags: TagsType
}

const CompletedStxInfo = () => (
  <CompletedWrapper>
    <Header style={{ marginBottom: '16px' }}>
      <Text size='20px' color='white' weight={600}>
        <FormattedMessage
          id='scenes.airdrops.blockstack.wallet.title'
          defaultMessage='My Blockstack Wallet'
        />
      </Text>
    </Header>
    <Text size='14px' color='white' weight={700}>
      <FormattedMessage
        id='scenes.airdrops.blockstack.wallet.q1'
        defaultMessage='Where are my Stacks?'
      />
    </Text>
    <TextParagraph size='13px' color='white' weight={500}>
      <FormattedMessage
        id='scenes.airdrops.blockstack.wallet.a1'
        defaultMessage='Your Stacks (STX) are saved in your Blockchain Wallet.'
      />
    </TextParagraph>
    <TextParagraph size='13px' color='white' weight={500}>
      <FormattedMessage
        id='scenes.airdrops.blockstack.wallet.a2'
        defaultMessage='Please note the balance is currently non-transferable.'
      />
    </TextParagraph>
    <Text size='13px' color='white' weight={500}>
      <FormattedMessage
        id='scenes.airdrops.blockstack.wallet.a3'
        defaultMessage='Learn more about this and future wallet support for STX'
      />
      {' '}
      <Link
        href='https://support.blockchain.com/hc/en-us/articles/360038745191'
        target='_blank'
        size='13px'
        color='white'
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
  </CompletedWrapper>
)

const StxAirdrop = (props: Props & LinkDispatchPropsType) => {
  const blockstackCampaign = props.userCampaignsInfoResponseList.find(
    (campaign: CampaignInfoType) => campaign.campaignName === 'BLOCKSTACK'
  )
  return propEq('userCampaignState','NONE', blockstackCampaign) ? null : (
    propEq('userCampaignState','REWARD_RECEIVED', blockstackCampaign) ? (
      <CompletedStxInfo />
    ) : (
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
              <FormattedMessage
                id='scenes.airdrops.blockstack'
                defaultMessage='Blockstack'
              />
            </Text>
          </Header>
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
          <StatusContainer>
            <div>
              <StxStatus {...props} />
            </div>
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
          </StatusContainer>
          <div style={{ marginTop: '26px' }}>
            <StxShare {...props} />
          </div>
        </div>
      </Box>
    )
  )
}

export default StxAirdrop
