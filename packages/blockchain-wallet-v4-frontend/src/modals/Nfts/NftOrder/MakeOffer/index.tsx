import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { map } from 'ramda'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { GasCalculationOperations, GasDataI } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import {
  Button,
  CheckBoxInput,
  Image,
  Link,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { getEthBalances } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { Form, SelectBox } from 'components/Form'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { Analytics, DeepLinkGoal } from 'data/types'

import { AssetDesc, StickyCTA } from '../../components'
import GetMoreEthComponent from '../../components/getMoreEth'
import NetworkFeesComponent from '../../components/networkFees'
import { Props as OwnProps } from '..'

const MakeOffer: React.FC<Props> = (props) => {
  const {
    erc20BalanceR,
    ethBalancesR,
    formActions,
    formValues,
    isAuthenticated,
    nftActions,
    orderFlow,
    rates,
    walletCurrency
  } = props
  const [termsAccepted, setTermsAccepted] = useState(false)
  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.NFT_MAKE_AN_OFFER_VIEWED,
      properties: {}
    })
  }, [])
  const { amount, coin, fix } = formValues
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])
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
  const wrapFees = orderFlow.wrapEthFees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const offerFees = orderFlow.fees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const ethBalance = new BigNumber(selfCustodyBalance)
  const erc20Balance = erc20BalanceR.getOrElse(0)
  const maxWrapPossible = ethBalance
    .minus(offerFees.totalFees * offerFees.gasPrice)
    .minus(wrapFees.totalFees * offerFees.gasPrice)
  const maxOfferPossible = maxWrapPossible.plus(erc20Balance)
  const amtToBuy = maxOfferPossible
    .times(-1)
    .plus(convertCoinToCoin({ baseToStandard: false, coin, value: cryptoAmt }))
  const standardErc20Balance = convertCoinToCoin({
    coin: formValues.coin || 'WETH',
    value: erc20Balance
  })
  const standardMaxWrapPossible = convertCoinToCoin({
    coin: 'ETH',
    value: maxWrapPossible.toString()
  })
  const amtToWrap = new BigNumber(cryptoAmt || 0).minus(standardErc20Balance)
  const canWrap =
    amtToWrap.isLessThanOrEqualTo(standardMaxWrapPossible) && formValues.coin === 'WETH'
  const needsWrap = amtToWrap.isGreaterThan(0) && formValues.coin === 'WETH'

  const disabled =
    !formValues.amount ||
    Remote.Loading.is(orderFlow.fees) ||
    props.orderFlow.isSubmitting ||
    !termsAccepted

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
                Make Offer
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
            <Form>
              <>
                <Row>
                  <Value>
                    <AmountFieldInput
                      coin={coin}
                      fiatCurrency='GBP'
                      amtError={false}
                      quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
                      fix={fix as 'CRYPTO' | 'FIAT'}
                      name='amount'
                      showCounter
                      showToggle
                      data-e2e='amountField'
                      onToggleFix={() => {
                        formActions.change(
                          'nftMakeOffer',
                          'fix',
                          fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                        )
                        formActions.change(
                          'nftMakeOffer',
                          'amount',
                          fix === 'CRYPTO' ? fiatAmt : cryptoAmt
                        )
                      }}
                    />
                  </Value>
                </Row>
              </>
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.offer_with' defaultMessage='Offer With' />
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
                        asset: val,
                        offer: '0.0001',
                        operation: GasCalculationOperations.CreateOffer,
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
                          .filter((symbol) => !!window.coins[symbol].coinfig.type.erc20Address)
                          .map((coin) => ({
                            text: window.coins[coin].coinfig.symbol,
                            value: window.coins[coin].coinfig.symbol
                          }))
                      }
                    ]}
                  />
                </Value>
                <Value>
                  <Text size='12px'>
                    ETH will automatically be wrapped to WETH during transaction{' '}
                  </Text>
                </Value>
              </Row>
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Expires After' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='expirationDays'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(days: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    }}
                    component={SelectBox}
                    elements={[
                      {
                        group: '',
                        items: map(
                          (item) => ({
                            text: item.text,
                            value: item.value
                          }),
                          [
                            { text: '1 Day', value: 1 },
                            { text: '3 Days', value: 3 },
                            { text: '7 Days', value: 7 },
                            { text: '1 Months', value: 30 },
                            { text: '3 Months', value: 90 },
                            { text: '6 Months', value: 180 }
                          ]
                        )
                      }
                    ]}
                  />
                </Value>
              </Row>
              <Row>
                <Value>
                  <NetworkFeesComponent {...props} {...[val]} />
                </Value>
              </Row>
            </Form>
            <StickyCTA>
              {needsWrap ? (
                <>
                  {canWrap ? (
                    <div />
                  ) : (
                    <>
                      <GetMoreEthComponent
                        amount={cryptoAmt}
                        amtToBuy={amtToBuy}
                        selfCustodyBalance={new BigNumber(selfCustodyBalance)}
                        custodialBalance={new BigNumber(custodialBalance)}
                      />
                      <div style={{ padding: '1em 0em' }}>
                        <Text
                          size='12px'
                          weight={500}
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          The max you can offer from this wallet is&nbsp;
                          <CoinDisplay style={{ fontSize: '12px', fontWeight: 'bold' }} coin='WETH'>
                            {Math.max(maxOfferPossible.toNumber(), 0)}
                          </CoinDisplay>
                        </Text>
                      </div>
                    </>
                  )}
                </>
              ) : null}

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
              {isAuthenticated ? (
                <>
                  {needsWrap && !canWrap ? (
                    <Button rounded nature='dark' fullwidth data-e2e='notEnoughEth'>
                      <Image
                        width='16px'
                        height='16px'
                        name='alert-orange'
                        style={{ marginRight: '0.5em' }}
                      />
                      <FormattedMessage id='copy.not_enough_eth' defaultMessage='Not Enough ETH' />
                    </Button>
                  ) : (
                    <Button
                      jumbo
                      nature='primary'
                      fullwidth
                      data-e2e='makeOfferNft'
                      disabled={disabled}
                      onClick={() =>
                        nftActions.createOffer({
                          amtToWrap: amtToWrap.isGreaterThan(0) ? amtToWrap.toString() : '',
                          asset: val,
                          expirationTime: moment().add(formValues.expirationDays, 'day').unix(),
                          offerFees,
                          wrapFees,
                          ...formValues
                        })
                      }
                    >
                      {formValues.amount ? (
                        props.orderFlow.isSubmitting ? (
                          <>
                            {props.orderFlow.status &&
                              (props.orderFlow.status === 'WRAP_ETH' ? (
                                <>
                                  <SpinningLoader width='14px' height='14px' borderWidth='3px' />
                                  <div style={{ paddingLeft: '1em' }}>
                                    <FormattedMessage
                                      id='copy.wrap_eth'
                                      defaultMessage='Wrapping Eth...'
                                    />
                                  </div>
                                </>
                              ) : (
                                <>{props.orderFlow.status}</>
                              ))}
                          </>
                        ) : (
                          <FormattedMessage
                            id='copy.make_offer_value'
                            defaultMessage={
                              !needsWrap ? 'Make an Offer for {val}' : 'Wrap ETH & Make Offer'
                            }
                            values={{
                              val: `${formValues.amount} ${formValues.coin}`
                            }}
                          />
                        )
                      ) : (
                        <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <LinkContainer
                  to={`/open/${DeepLinkGoal.MAKE_OFFER_NFT}?contract_address=${val.asset_contract.address}&token_id=${val.token_id}`}
                >
                  <Button jumbo nature='primary' fullwidth data-e2e='login'>
                    <FormattedMessage
                      id='copy.login_to_make_offer'
                      defaultMessage='Login to Make an Offer'
                    />
                  </Button>
                </LinkContainer>
              )}
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
    selectors.form.getFormValues('nftMakeOffer')(state)?.coin || 'WETH'
  ),
  ethBalancesR: getEthBalances(state),
  formValues: selectors.form.getFormValues('nftMakeOffer')(state) as {
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
    form: 'nftMakeOffer',
    initialValues: {
      coin: 'WETH',
      expirationDays: 1,
      fix: 'CRYPTO',
      networkFees: 'network'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MakeOffer) as React.FC<OwnProps>
