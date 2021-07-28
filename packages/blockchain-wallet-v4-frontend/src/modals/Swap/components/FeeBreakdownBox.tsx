import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Icon, Link, SkeletonRectangle, Text, TextGroup } from 'blockchain-info-components'
import { convertCoinToFiat } from 'blockchain-wallet-v4/src/exchange'
import { coinToString } from 'blockchain-wallet-v4/src/exchange/utils'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout'
import { FiatType, PaymentValue, RemoteDataType, SwapQuoteType } from 'core/types'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/types'

const Container = styled.div`
  background-color: ${(p) => p.theme.grey000};
  border-radius: 8px;
  overflow: hidden;
`
const FeesContainer = styled.div`
  background-color: ${(p) => p.theme.white};
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.grey100};

  & > div:first-child {
    border: 0;
  }
`
const IconWrapper = styled.div<{ toggle: boolean }>`
  transition: transform 0.2s;
  transform: ${(p) => (p.toggle ? 'rotate(180deg)' : 'none')};
  margin-right: -6px;
`

const HorizontalRow = styled(Row)<{ toggle?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  &:last-child {
    border-bottom-width: ${(p) => (p.toggle ? '0px' : '1px')};
  }
`
const Footer = styled.div`
  padding: 16px;
`
const FeeBreakdownBox = ({
  base,
  basePayment,
  baseRates,
  counter,
  counterQuote,
  counterRates,
  paymentR,
  quoteR,
  walletCurrency
}: Props): React.ReactElement => {
  const [toggle, setToggle] = useState(false)
  const networkFee = (value: PaymentValue | undefined) => {
    return value
      ? value.coin === 'BTC' || value.coin === 'BCH'
        ? value.selection?.fee
        : value.fee
      : 0
  }
  const baseFiatFee = convertCoinToFiat({
    coin: base.type === SwapBaseCounterTypes.ACCOUNT ? base.baseCoin : base.coin,
    currency: walletCurrency,
    rates: baseRates,
    value: networkFee(paymentR)
  })
  const counterFiatFee = convertCoinToFiat({
    coin: counter.coin,
    currency: walletCurrency,
    rates: counterRates,
    value: quoteR?.quote?.networkFee || '0'
  })
  const counterName = window.coins[counter.coin].coinfig
    ? window.coins[counter.coin].coinfig.name
    : counter.coin
  const baseName = window.coins[base.coin].coinfig
    ? window.coins[base.coin].coinfig.name
    : base.coin
  const bothCustodial =
    base.type === SwapBaseCounterTypes.CUSTODIAL && counter.type === SwapBaseCounterTypes.CUSTODIAL
  const bothNonCustodial =
    base.type === SwapBaseCounterTypes.ACCOUNT && counter.type === SwapBaseCounterTypes.ACCOUNT

  if (bothCustodial) {
    return (
      <Container>
        <FeesContainer>
          <HorizontalRow>
            <Title>
              <FormattedMessage id='copy.network_fees' defaultMessage='Network Fees' />
            </Title>
            <Value>
              <FormattedMessage id='modals.brokerage.free' defaultMessage='Free' />
            </Value>
          </HorizontalRow>
        </FeesContainer>
        <Footer>
          <Text size='12px'>
            <FormattedMessage
              id='copy.no_network_fees'
              defaultMessage='When using Trading Accounts, there are no network fees.'
            />
          </Text>
        </Footer>
      </Container>
    )
  }

  return (
    <Container>
      <FeesContainer>
        <HorizontalRow>
          <Title>
            <FormattedMessage id='copy.network_fees' defaultMessage='Network Fees' />
          </Title>
          <Value>
            <HorizontalRow style={{ border: 'unset', padding: '0px' }}>
              <Text color='grey900'>~</Text>
              <FiatDisplay size='14px' weight={500} color='grey900' coin={walletCurrency}>
                {Number(baseFiatFee) + Number(counterFiatFee)}
              </FiatDisplay>
              <IconWrapper toggle={toggle}>
                <Icon
                  role='button'
                  data-e2e='toggleSwapFeesDropdown'
                  name='chevron-down'
                  cursor
                  size='24px'
                  color='blue600'
                  onClick={() => {
                    setToggle((prev) => !prev)
                  }}
                />
              </IconWrapper>
            </HorizontalRow>
          </Value>
        </HorizontalRow>
        {toggle && (
          <>
            {base.type === SwapBaseCounterTypes.ACCOUNT && (
              <HorizontalRow toggle={toggle}>
                <Title style={{ fontSize: '12px' }} color='grey900'>
                  <FormattedMessage
                    id='copy.coin_network_fee'
                    defaultMessage='{coin} Network Fee'
                    values={{ coin: base.coin }}
                  />
                </Title>
                <Value
                  color='grey900'
                  size='12px'
                  data-e2e='swapOutgoingFee'
                  style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}
                >
                  {basePayment.cata({
                    Failure: (e) => e,
                    Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                    NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                    Success: (value) => {
                      return (
                        <>
                          <Text size='12px' color='grey900'>
                            {coinToString({
                              unit: { symbol: base.baseCoin },
                              value: convertBaseToStandard(base.baseCoin, networkFee(value))
                            })}
                          </Text>
                          <FiatDisplay
                            size='12px'
                            weight={500}
                            color='grey400'
                            coin={base.baseCoin}
                          >
                            {networkFee(value)}
                          </FiatDisplay>
                        </>
                      )
                    }
                  })}
                </Value>
              </HorizontalRow>
            )}
            {counter.type === SwapBaseCounterTypes.ACCOUNT && (
              <HorizontalRow toggle={toggle}>
                <Title style={{ fontSize: '12px' }} color='grey900'>
                  <FormattedMessage
                    id='copy.coin_network_fee'
                    defaultMessage='{coin} Network Fee'
                    values={{ coin: counter.coin }}
                  />
                </Title>
                <Value
                  data-e2e='swapIncomingFee'
                  style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}
                >
                  {counterQuote.cata({
                    Failure: (e) => e,
                    Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                    NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                    Success: (value) => (
                      <>
                        <Text size='12px' color='grey900'>
                          {coinToString({
                            unit: {
                              symbol: counter.coin
                            },
                            value: convertBaseToStandard(counter.coin, value.quote.networkFee)
                          })}
                        </Text>
                        <FiatDisplay
                          style={{ justifyContent: 'flex-end' }}
                          size='12px'
                          weight={500}
                          color='grey400'
                          coin={counter.coin}
                        >
                          {value.quote.networkFee}
                        </FiatDisplay>
                      </>
                    )
                  })}
                </Value>
              </HorizontalRow>
            )}
          </>
        )}
      </FeesContainer>
      <Footer>
        <TextGroup inline>
          <Text size='14px'>
            <FormattedMessage
              id='copy.network_fees_set'
              defaultMessage='Network fees are set by the'
            />
          </Text>{' '}
          <Text size='14px'>
            {bothNonCustodial
              ? `${baseName} and ${counterName}`
              : base.type !== SwapBaseCounterTypes.CUSTODIAL &&
                counter.type === SwapBaseCounterTypes.CUSTODIAL
              ? baseName
              : counterName}
          </Text>{' '}
          <Text size='14px'>
            {bothCustodial ? (
              <FormattedMessage id='copy.networks' defaultMessage='networks' />
            ) : (
              <FormattedMessage id='copy.network' defaultMessage='network' />
            )}
            .
          </Text>{' '}
          <Link
            href='https://support.blockchain.com/hc/en-us/articles/360018355011-What-fees-are-applied-to-my-Swap-order-'
            size='14px'
            rel='noopener noreferrer'
            target='_blank'
          >
            <FormattedMessage
              id='modals.simplebuy.confirm.learn_more_about_fees'
              defaultMessage='Learn more about fees'
            />
          </Link>
        </TextGroup>
      </Footer>
    </Container>
  )
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  baseRates: selectors.core.data.misc
    .getRatesSelector(
      ownProps.base.type === SwapBaseCounterTypes.ACCOUNT
        ? ownProps.base.baseCoin
        : ownProps.base.coin,
      state
    )
    .getOrElse(0),
  counterRates: selectors.core.data.misc
    .getRatesSelector(ownProps.counter.coin, state)
    .getOrElse(0),
  paymentR: selectors.components.swap.getPayment(state).getOrElse({} as PaymentValue),
  quoteR: selectors.components.swap
    .getQuote(state)
    .getOrElse({} as { quote: SwapQuoteType; rate: number }),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD') as FiatType
})

const connector = connect(mapStateToProps)

interface OwnProps {
  base: SwapAccountType
  basePayment: RemoteDataType<string, PaymentValue | undefined>
  counter: SwapAccountType
  counterQuote: RemoteDataType<
    string,
    {
      quote: SwapQuoteType
      rate: number
    }
  >
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FeeBreakdownBox)
