import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

import { getNewCoinAnnouncement } from '../selectors'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
`
const NewCoinWrapper = styled.div`
  display: flex;
  align-items: center;
`
const VerbText = styled(Text)`
  margin-right: 5px;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.black};
`

const Description = styled(Text)`
  margin-top: 2px;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.black};
  display: none;

  ${media.atLeastMobile`
    display: block;
  `}
`

const CTAWrapper = styled.div`
  display: flex;
  align-items: center;
`

const CTAButton = styled(Button)`
  margin-right: 12px;

  & div {
    color: ${(props) => props.theme.white};
    font-weight: 600;
    font-size: 14px;
  }
`
const CloseLink = styled.div`
  cursor: pointer;
`

const NewCurrency = ({ cacheActions, coinListing, simpleBuyActions }: Props) => {
  if (!coinListing) return null
  if (!window.coins[coinListing]) return null

  const newCoinAnnouncement = getNewCoinAnnouncement(coinListing)
  const { coinfig } = window.coins[coinListing]
  const { name, symbol } = coinfig

  return (
    <Wrapper>
      <NewCoinWrapper>
        <Icon name={coinListing} size='36px' style={{ marginRight: '16px' }} />
        <div>
          <VerbText>
            {name} ({symbol}){' '}
            <FormattedMessage id='copy.now_trading' defaultMessage='is Now Trading' />
          </VerbText>
          <Description>
            <FormattedMessage
              id='layouts.wallet.header.announcements.newcoin.description_1'
              defaultMessage='Buy, sell, swap, send, receive and store {coin} in your Blockchain.com Wallet.'
              values={{ coin: symbol }}
            />
          </Description>
        </div>
      </NewCoinWrapper>

      <CTAWrapper>
        <CTAButton
          data-e2e='newCoinTradeNowButton'
          nature='primary'
          onClick={() => simpleBuyActions.showModal('TransactionList', symbol as CoinType, 'BUY')}
          small
          style={{ borderRadius: '4px' }}
        >
          <Text>
            <FormattedMessage id='copy.buy' defaultMessage='Buy' /> {symbol}
          </Text>
        </CTAButton>
        <CloseLink
          data-e2e='newCoinCloseButton'
          onClick={() => cacheActions.announcementDismissed(newCoinAnnouncement)}
        >
          <Icon size='20px' color='grey400' name='close-circle' />
        </CloseLink>
      </CTAWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  coinListing: selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(NewCurrency)
