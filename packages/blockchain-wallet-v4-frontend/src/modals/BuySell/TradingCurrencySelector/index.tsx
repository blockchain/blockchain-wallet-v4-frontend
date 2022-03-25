import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { WalletFiatType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'

import { IconsContainer } from '../../components'

const COINS = [
  {
    title: 'US Dollars',
    value: 'USD'
  },
  {
    title: 'Great British Pounds',
    value: 'GBP'
  },
  {
    title: 'Euros',
    value: 'EUR'
  }
]

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const DisclaimerWrapper = styled.div`
  padding: 24px 40px 40px 40px;
`

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const SubContent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const FiatCurrencies = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
`

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
  &:first-child {
    border-top: 0;
  }
  &:hover {
    background-color: ${(props) => props.theme.blue000};
  }
`

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const CoinTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-weight: 600;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CoinItemSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  margin-top: 4px;
  font-weight: 500;
  font-size: 12px;
`

const TradingCurrencySelector = ({
  analyticsActions,
  buySellActions,
  fiatCurrency,
  handleClose
}: Props) => (
  <div>
    <Top>
      <IconsContainer>
        <CloseIconContainer>
          <Icon
            cursor
            data-e2e='tradingLimitsCloseButton'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={handleClose}
          />
        </CloseIconContainer>
      </IconsContainer>
      <Container>
        <Image width='32px' height='32px' name='globe' />
        <Title color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.select_trading_currency.title'
            defaultMessage='Select a Trading Currency.'
          />
        </Title>
        <SubContent color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.select_trading_currency.description'
            defaultMessage='Right now, {currency} is not supported for buying crypto. You can add a bank account or card from the list of available currencies below.'
            values={{
              currency: fiatCurrency
            }}
          />
        </SubContent>
      </Container>
    </Top>
    <FiatCurrencies>
      {COINS.map((coin) => (
        <CoinItem
          key={coin.value}
          onClick={() => {
            buySellActions.setFiatTradingCurrency(coin.value as WalletFiatType)
            analyticsActions.trackEvent({
              key: Analytics.VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED,
              properties: { currency: coin.value }
            })
          }}
        >
          <CoinDetails>
            <CoinTitle data-e2e={coin}>{coin.title}</CoinTitle>
            <CoinItemSubtitle>{coin.value}</CoinItemSubtitle>
          </CoinDetails>
          <Icon name='chevron-right' size='32px' color='grey400' />
        </CoinItem>
      ))}
    </FiatCurrencies>

    <DisclaimerWrapper>
      <Text
        color='grey600'
        size='12px'
        weight={500}
        style={{ marginTop: '40px', textAlign: 'center' }}
      >
        <FormattedMessage
          id='modals.simplebuy.select_trading_currency.disclaimer'
          defaultMessage='Additional bank fees may apply. Your bank may add fee and Exchange Rates to each transaction.'
        />
      </Text>
    </DisclaimerWrapper>
  </div>
)

const mapStateToProps = (state) => ({
  fiatCurrency: selectors.components.buySell.getOriginalFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TradingCurrencySelector)
