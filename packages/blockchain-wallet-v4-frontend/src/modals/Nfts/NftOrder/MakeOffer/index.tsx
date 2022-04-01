import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import { SendFormType } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/types'
import { map } from 'ramda'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { convertCoinToCoin, convertCoinToFiat } from '@core/exchange'
import { GasCalculationOperations, GasDataI } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { OrderType, RatesType } from '@core/types'
import {
  Button,
  CheckBoxInput,
  HeartbeatLoader,
  Icon,
  Image,
  Link,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox, SelectBox } from 'components/Form'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { DeepLinkGoal } from 'data/types'

import { AssetDesc, StickyCTA } from '../../components'
import NetworkFeesComponent from '../../components/networkFees'
import { Props as OwnProps } from '..'
import WrapEthFees from '../WrapEth/fees'
import MakeOfferFees from './fees'

const GetMoreEth = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  border: 1px solid ${(props) => props.theme.blue500};
  border-radius: 12px;
  font-family: Inter, sans-serif;
`

const MakeOffer: React.FC<Props> = (props) => {
  const { erc20BalanceR, ethBalanceR, formValues, isAuthenticated, nftActions, orderFlow } = props

  const wrapFees = orderFlow.wrapEthFees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const offerFees = orderFlow.fees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)

  const ethBalance = ethBalanceR.getOrElse(new BigNumber(0))
  const erc20Balance = erc20BalanceR.getOrElse(0)
  const maxWrapPossible = ethBalance
    .minus(offerFees.totalFees * offerFees.gasPrice)
    .minus(wrapFees.totalFees * offerFees.gasPrice)
  const maxOfferPossible = maxWrapPossible.plus(erc20Balance)
  const standardErc20Balance = convertCoinToCoin({
    coin: formValues.coin || 'WETH',
    value: erc20Balance
  })
  const standardMaxWrapPossible = convertCoinToCoin({
    coin: 'ETH',
    value: maxWrapPossible.toString()
  })
  const amtToWrap = new BigNumber(formValues.amount || 0).minus(standardErc20Balance)
  const canWrap =
    amtToWrap.isLessThanOrEqualTo(standardMaxWrapPossible) && formValues.coin === 'WETH'
  const needsWrap = amtToWrap.isGreaterThan(0) && formValues.coin === 'WETH'
  const [termsAccepted, setTermsAccepted] = useState(false)

  const disabled =
    !formValues.amount ||
    Remote.Loading.is(orderFlow.fees) ||
    props.orderFlow.isSubmitting ||
    !(needsWrap && canWrap) ||
    !termsAccepted

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }

  const validate = (formValues: SendFormType, props: Props) => {
    return {
      amount: needsWrap && !canWrap ? 'NOT_ENOUGH_ETH' : true
    }
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
              <div
                style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}
              >
                <img
                  style={{
                    borderRadius: '8px',
                    height: '64px',
                    marginRight: '24px',
                    width: 'auto'
                  }}
                  alt='nft-asset'
                  src={val.image_url.replace(/=s\d*/, '')}
                />
                <div>
                  <div>
                    <div
                      style={{
                        alignItems: 'center',
                        background: colors.grey100,
                        borderRadius: '24px',
                        display: 'flex',
                        padding: '6px 12px 6px 6px',
                        width: 'fit-content'
                      }}
                    >
                      <img
                        src={val.collection.image_url}
                        style={{ borderRadius: '999px', height: '24px', marginRight: '8px' }}
                        alt='nft-collection'
                      />
                      <Text size='14px' color='grey900' weight={600}>
                        {val?.collection?.name}
                      </Text>
                    </div>
                  </div>
                  <Text
                    style={{ marginTop: '6px', paddingLeft: '1em' }}
                    size='14px'
                    color='grey900'
                    weight={600}
                  >
                    {val?.name}
                  </Text>
                </div>
                <div style={{ marginTop: '6px', paddingLeft: '1em' }}>
                  <Text style={{ textAlign: 'right' }} weight={600}>
                    0.001 WETH
                  </Text>
                  <Text style={{ textAlign: 'right' }}>$40</Text>
                </div>
              </div>
            </Row>
            {/* <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val?.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row> */}
            <Form>
              <>
                <Row>
                  <Value>
                    <AmountFieldInput
                      coin={formValues.coin}
                      walletCurrency='GBP'
                      amtError={false}
                      quote={convertCoinToFiat({
                        coin: formValues.coin,
                        currency: 'GBP',
                        isStandard: true,
                        rates: props.rates,
                        value: formValues.amount || 0
                      })}
                      fix='CRYPTO'
                      name='amount'
                      showCounter
                      validate={validate}
                      validate_terms_of_service='validate_IS_PASSED_TO_reduxForm'
                      onToggleFix={() => {}}
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
                            { text: '1 Day', value: '1' },
                            { text: '3 Days', value: '3' },
                            { text: '7 Days', value: '7' },
                            { text: '1 Months', value: '180' },
                            { text: '3 Months', value: '180' },
                            { text: '6 Months', value: '180' }
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
                      <GetMoreEth>
                        <div style={{ display: 'flex' }}>
                          <Icon size='32px' name='ETH' />{' '}
                          <div style={{ display: 'block', padding: '0em 1em' }}>
                            <Text>Get More Eth</Text>
                            <Text>Buy 0.00 Eth</Text>
                          </div>
                        </div>
                        <Button
                          size='xsmall'
                          small
                          rounded
                          nature='primary'
                          data-e2e='buyMoreEth'
                          width='40px'
                          onClick={() => {
                            props.buySellActions.showModal({
                              orderType: OrderType.BUY,
                              origin: 'NftsMakeOffer'
                            })
                          }}
                        >
                          <FormattedMessage id='modal.nfts.buy_more_eth' defaultMessage='Buy' />
                        </Button>
                      </GetMoreEth>
                      <div style={{ padding: '1em 0em' }}>
                        <Text size='14px' weight={500} style={{ display: 'flex' }}>
                          Max you can offer from this wallet:
                          <CoinDisplay
                            style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 'bold' }}
                            coin='WETH'
                          >
                            {maxOfferPossible}
                          </CoinDisplay>
                        </Text>
                        <Text weight={500} size='14px' style={{ textAlign: 'center' }}>
                          Buy 10 eth to offer this amount
                        </Text>
                      </div>
                    </>
                  )}
                </>
              ) : null}
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '1.2em 0em' }}>
                  <CheckBoxInput name='terms' disabled={false} onChange={toggleTermsAccepted} />
                </div>
                <Text
                  color={colors.grey200}
                  weight={500}
                  size='16px'
                  style={{ padding: '1em 0em', textAlign: 'center' }}
                >
                  I agree to Blockchain.com’s{' '}
                  <Link href='https://www.blockchain.com/legal/terms'>Terms of Service</Link>
                </Text>
              </div>
              {/* <div>
                Eth Balance: <CoinDisplay coin='ETH'>{ethBalance}</CoinDisplay>
              </div>
              {needsWrap ? (
                <>
                  {canWrap ? (
                    <div>
                      <>You will need to Wrap {amtToWrap.toString()} ETH</>
                    </div>
                  ) : (
                    <div>
                      You don&apos;t have enough ETH to offer {formValues.amount} WETH. The max you
                      can offer is <CoinDisplay coin='WETH'>{maxOfferPossible}</CoinDisplay>
                    </div>
                  )}
                </>
              ) : null}
              <MakeOfferFees {...props} asset={val} />
              {needsWrap && <WrapEthFees {...props} />} */}
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
                          offerFees,
                          wrapFees,
                          ...formValues
                        })
                      }
                    >
                      {formValues.amount ? (
                        props.orderFlow.isSubmitting ? (
                          <>{props.orderFlow.status}</>
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
  ethBalanceR: getEthBalance(state),
  formValues: selectors.form.getFormValues('nftMakeOffer')(state) as {
    amount: string
    coin: string
  },
  rates: getRatesSelector('WETH', state).getOrElse({} as RatesType)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    destroyOnUnmount: false,
    form: 'nftMakeOffer',
    initialValues: {
      coin: 'WETH',
      expirationDays: '1',
      networkFees: 'network'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MakeOffer) as React.FC<OwnProps>
