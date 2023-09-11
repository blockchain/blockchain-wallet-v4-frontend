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

const CoinRename = ({ buySellActions, cacheActions, coinRename }: Props) => {
  if (!coinRename) return null
  if (!window.coins[coinRename]) return null

  const newCoinAnnouncement = ANNOUNCEMENTS.COIN_RENAME(coinRename)
  const { coinfig } = window.coins[coinRename]
  const { displaySymbol, symbol } = coinfig

  return (
    <Wrapper>
      <CenterWrapper>
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
            <FormattedMessage id='copy.trade' defaultMessage='Trade' /> {displaySymbol}
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
  coinRename: selectors.core.walletOptions.getCoinRename(state).getOrElse('')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinRename)
