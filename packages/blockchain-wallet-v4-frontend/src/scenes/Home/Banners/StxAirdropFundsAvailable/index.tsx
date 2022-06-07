import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon as ConstellationIcon } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'
import { bindActionCreators } from '@reduxjs/toolkit'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { TagsType } from 'data/types'
import { media } from 'services/styles'

import { getSTXAnnouncement } from '../selectors'
import { BannerButton, CloseLink, IconWrapper } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const PendingIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue100};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 12px;
`

class StxAirdropFundsAvailable extends PureComponent<Props> {
  componentDidMount() {
    // TODO: SELF_CUSTODY move to fetchBalances
    // I already left it there, just need to uncomment it
    this.props.coinsActions.fetchData()
  }

  render() {
    const { tags } = this.props
    const completeSTX = getSTXAnnouncement()
    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='STX' size='30px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              {tags?.BLOCKSTACK ? (
                <FormattedMessage
                  id='copy.stx_airdrop_avail'
                  defaultMessage='Your Stacks (STX) airdrop is here'
                />
              ) : (
                <FormattedMessage id='copy.stx_avail' defaultMessage='STX is Available' />
              )}
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              {tags?.BLOCKSTACK ? (
                <FormattedMessage
                  id='copy.stx_supported_added'
                  defaultMessage='You can now access your STX airdrop in your new STX Private Key Wallet.'
                />
              ) : (
                <FormattedMessage
                  id='copy.stx_support_send_receive_added'
                  defaultMessage='STX support has been added to the Blockchain.com Web Wallet. You can now send and receive STX.'
                />
              )}
            </Copy>
          </Column>
        </Row>
        <Link
          href='https://blockchain.zendesk.com/hc/en-us/articles/4672971270556'
          target='_blank'
          rel='noopener noreferrer'
        >
          <BannerButton jumbo data-e2e='goToSupportStx' nature='primary'>
            <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
          </BannerButton>
        </Link>
        <CloseLink
          data-e2e='newCoinCloseButton'
          onClick={() => this.props.cacheActions.announcementDismissed(completeSTX)}
        >
          <ConstellationIcon
            label='close'
            color='grey600'
            data-e2e='completeProfileCloseModalIcon'
            size='md'
          >
            <IconCloseCircleV2 />
          </ConstellationIcon>
        </CloseLink>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  tags: selectors.modules.profile.getTags(state).getOrElse({} as TagsType) as TagsType
})

const mapDispatchToProps = (dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(StxAirdropFundsAvailable)
