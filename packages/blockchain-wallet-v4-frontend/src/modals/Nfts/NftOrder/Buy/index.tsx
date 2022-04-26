import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators, compose } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { Field, reduxForm } from 'redux-form'

import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { GasCalculationOperations, GasDataI } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import { CheckBoxInput, Icon, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { getEthBalances } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { SelectBox } from 'components/Form'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { orderFromJSON } from 'data/components/nfts/utils'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import NetworkFeesComponent from '../../components/networkFees'
import { Props as OwnProps } from '..'
import BuyCta from './cta'
import BuyFees from './fees'

const Buy: React.FC<Props> = (props) => {
  const {
    close,
    erc20BalanceR,
    ethBalancesR,
    formActions,
    formValues,
    nftActions,
    orderFlow,
    rates,
    walletCurrency
  } = props
  const { amount, coin, fix } = formValues
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])
  const { orderToMatch } = orderFlow

  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount
  const [termsAccepted, setTermsAccepted] = useState(false)

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }

  const acceptTerms = () => {
    setTermsAccepted(true)
  }

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <StickyHeaderWrapper>
              <FlyoutHeader
                data-e2e='wrapEthHeader'
                mode='back'
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
              >
                Buy
              </FlyoutHeader>
            </StickyHeaderWrapper>
            <Row>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                  <img
                    style={{
                      borderRadius: '8px',
                      height: '64px',
                      marginRight: '12px',
                      width: 'auto'
                    }}
                    alt='nft-asset'
                    src={val.image_url.replace(/=s\d*/, '')}
                  />
                  <div>
                    <Text size='16px' color='grey900' weight={600}>
                      {val?.name}
                    </Text>
                    {val.collection.safelist_request_status === 'verified' ? (
                      <Text
                        size='14px'
                        weight={600}
                        color='green600'
                        style={{
                          background: colors.green100,
                          borderRadius: '8px',
                          padding: '5px 8px',
                          textAlign: 'center',
                          width: 'fit-content'
                        }}
                      >
                        Verified
                      </Text>
                    ) : (
                      <Text
                        size='14px'
                        weight={600}
                        color='orange600'
                        style={{
                          background: colors.orange100,
                          borderRadius: '8px',
                          padding: '5px 8px',
                          textAlign: 'center',
                          width: 'fit-content'
                        }}
                      >
                        Not Verified
                      </Text>
                    )}
                  </div>
                </div>
                <Text
                  style={{
                    justifyContent: 'right'
                  }}
                >
                  <CoinDisplay
                    size='14px'
                    color='black'
                    weight={600}
                    coin='ETH'
                    style={{ justifyContent: 'right' }}
                  >
                    {val.last_sale?.total_price || 0}
                  </CoinDisplay>
                  <FiatDisplay
                    size='14px'
                    color={colors.grey600}
                    weight={600}
                    coin='ETH'
                    style={{ justifyContent: 'right' }}
                  >
                    {val.last_sale?.total_price || 0}
                  </FiatDisplay>
                </Text>
              </div>
            </Row>
            <Row>
              <Value>
                <AmountFieldInput
                  coin={coin}
                  fiatCurrency={walletCurrency}
                  amtError={false}
                  quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
                  fix={fix as 'CRYPTO' | 'FIAT'}
                  name='amount'
                  showCounter
                  showToggle
                  data-e2e='amountField'
                  onToggleFix={() => {
                    formActions.change('nftBuy', 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
                    formActions.change('nftBuy', 'amount', fix === 'CRYPTO' ? fiatAmt : cryptoAmt)
                  }}
                />
              </Value>
            </Row>
            <Row>
              <Title>
                <b>
                  <FormattedMessage id='copy.buy_with' defaultMessage='Buy With' />
                </b>
              </Title>
              <Value>
                <Field
                  name='coin'
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(coin: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const address = window.coins[coin].coinfig.type.erc20Address!

                    nftActions.fetchFees({
                      operation: GasCalculationOperations.Buy,
                      order: orderFromJSON(orderToMatch),
                      paymentTokenAddress: address
                    })
                  }}
                  component={SelectBox}
                  elements={[
                    {
                      group: '',
                      items: val.collection.payment_tokens
                        .map((token) => token.symbol)
                        .filter((symbol) => !!window.coins[symbol])
                        .filter((symbol) => !window.coins[symbol].coinfig.type.erc20Address)
                        .map((coin) => ({
                          text: window.coins[coin].coinfig.symbol,
                          value: window.coins[coin].coinfig.symbol
                        }))
                    }
                  ]}
                />
              </Value>
            </Row>
            <Row>
              <Value>
                <NetworkFeesComponent isMakeOffer title='Network Fees' {...props} {...[val]} />
              </Value>
            </Row>
            <Row>
              <div style={{ display: 'flex' }}>
                {' '}
                <div style={{ padding: '1.2em 0em' }}>
                  <CheckBoxInput
                    name='terms'
                    disabled={false}
                    onChange={toggleTermsAccepted}
                    checked={termsAccepted}
                  />
                </div>
                <Text
                  color={colors.grey200}
                  weight={500}
                  size='16px'
                  style={{ padding: '1em 0em', textAlign: 'center' }}
                >
                  I agree to Blockchain.com’s{' '}
                  <Link
                    onClick={acceptTerms}
                    href='https://www.blockchain.com/legal/terms'
                    target='_blank'
                  >
                    Terms of Service
                  </Link>
                </Text>
              </div>
            </Row>
            <StickyCTA>
              <BuyFees {...props} />
              <BuyCta {...props} />
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}
const mapStateToProps = (state) => ({
  erc20BalanceR: selectors.core.data.eth.getErc20Balance(
    state,
    // @ts-ignore
    selectors.form.getFormValues('nftBuy')(state)?.coin || 'WETH'
  ),
  ethBalancesR: getEthBalances(state),
  formValues: selectors.form.getFormValues('nftBuy')(state) as {
    amount: string
    coin: string
    expirationDays: string
    fix: string
  },
  rates: getRatesSelector('WETH', state).getOrElse({} as RatesType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    destroyOnUnmount: false,
    form: 'nftBuy',
    initialValues: {
      amount: 0,
      coin: 'ETH',
      fix: 'CRYPTO'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(Buy) as React.FC<OwnProps>
