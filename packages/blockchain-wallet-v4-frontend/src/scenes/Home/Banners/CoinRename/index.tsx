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

const CoinRename = ({ buySellActions, cacheActions, coinRename }: Props) => {
  if (!coinRename) return null
  if (!window.coins[coinRename]) return null

  const newCoinAnnouncement = ANNOUNCEMENTS.COIN_RENAME(coinRename)
  const { coinfig } = window.coins[coinRename]
  const { displaySymbol, symbol } = coinfig

  return (
    <Wrapper>
      <NewCoinWrapper>
        <Icon name={coinRename} size='36px' style={{ marginRight: '16px' }} />
        <div>
          <VerbText>
            {symbol} <FormattedMessage id='copy.has_new_name' defaultMessage='has a new name' />
          </VerbText>
          <Description>
            <FormattedMessage
              id='layouts.wallet.header.announcements.coin_rename.description'
              defaultMessage='Heads up: {symbol} has renamed to {displaySymbol}. All balances are unaffected.'
              values={{ displaySymbol, symbol }}
            />
          </Description>
        </div>
      </NewCoinWrapper>

      <CTAWrapper>
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
            <FormattedMessage id='copy.trade' defaultMessage='Trade' /> {displaySymbol}
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
  coinRename: selectors.core.walletOptions.getCoinRename(state).getOrElse('')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinRename)
