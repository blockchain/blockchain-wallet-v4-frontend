import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinType, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import { Wrapper } from '../styles'

const StyledWrapper = styled(Wrapper)`
  align-items: center !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const NewAlert = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  text-transform: uppercase;
  margin-right: 5px;
  color: ${(props) => props.theme.green600};
  background-color: ${(props) => props.theme.green000};
`

const VerbText = styled.span`
  margin-right: 5px;
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.grey800};
`

const Description = styled.span`
  margin-right: 5px;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.grey600};
`

const CTAButton = styled(Button)`
  margin-right: 5px;

  & div {
    color: ${(props) => props.theme.white};
    font-weight: 600;
    font-size: 14px;
  }
`
const CloseLink = styled.div`
  cursor: pointer;
`

const NewCurrency = ({ announcementState, cacheActions, coinListing, simpleBuyActions }: Props) => {
  if (!coinListing) return null
  if (!window.coins[coinListing]) return null

  const newCoinAnnouncement = `${coinListing}-homepage`
  const { coinfig } = window.coins[coinListing]
  const { name, symbol } = coinfig
  const isDismissed =
    (announcementState &&
      announcementState[newCoinAnnouncement] &&
      announcementState[newCoinAnnouncement].dismissed) ||
    false

  if (isDismissed) {
    return null
  }

  return (
    <StyledWrapper>
      <NewAlert>
        <FormattedMessage id='copy.new' defaultMessage='New' />
      </NewAlert>
      <VerbText>
        {name} {symbol} <FormattedMessage id='copy.now_trading' defaultMessage='is Now Trading' />
      </VerbText>
      <Description>
        <FormattedMessage
          id='layouts.wallet.header.announcements.newcoin.description_1'
          defaultMessage='Buy, sell, swap, send, receive and store {coin} in your Blockchain.com Wallet.'
          values={{ coin: symbol }}
        />
      </Description>

      <CTAButton
        data-e2e='newCoinTradeNowButton'
        nature='primary'
        onClick={() => simpleBuyActions.showModal('TransactionList', symbol as CoinType)}
        small
        style={{ borderRadius: '4px' }}
      >
        <Text>
          <FormattedMessage id='copy.trade' defaultMessage='Trade' /> {symbol}{' '}
          <FormattedMessage id='copy.now' defaultMessage='Now' />
        </Text>
      </CTAButton>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(newCoinAnnouncement)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </StyledWrapper>
  )
}

const mapStateToProps = (state) => ({
  announcementState: selectors.cache.getLastAnnouncementState(state),
  coinListing: selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(NewCurrency)
