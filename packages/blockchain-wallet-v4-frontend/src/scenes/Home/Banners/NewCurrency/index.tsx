import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

import ANNOUNCEMENTS from '../constants'
import { Wrapper } from '../styles'

const CenterWrapper = styled.div`
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

const NewCurrency = ({ buySellActions, cacheActions, coinListing }: Props) => {
  if (!coinListing) return null
  if (!window.coins[coinListing]) return null

  const newCoinAnnouncement = ANNOUNCEMENTS.NEW_COIN(coinListing)
  const { coinfig } = window.coins[coinListing]
  const { name, symbol } = coinfig

  return (
    <Wrapper>
      <CenterWrapper>
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
      </CenterWrapper>

      <CenterWrapper>
        <CTAButton
          data-e2e='newCoinTradeNowButton'
          nature='primary'
          onClick={() =>
            buySellActions.showModal({
              cryptoCurrency: symbol as CoinType,
              orderType: 'BUY',
              origin: 'TransactionList'
            })
          }
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
      </CenterWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  coinListing: selectors.core.walletOptions.getNewCoinListing(state).getOrElse('')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(NewCurrency)
