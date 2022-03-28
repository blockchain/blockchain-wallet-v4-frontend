import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, GasDataI } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, SpinningLoader, Text } from 'blockchain-info-components'
import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox, SelectBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { DeepLinkGoal } from 'data/types'

import { AssetDesc, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import WrapEthFees from '../WrapEth/fees'
import MakeOfferFees from './fees'

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

  const disabled =
    !formValues.amount || Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting

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
              <div style={{ alignItems: 'center', display: 'flex' }}>
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
                  <Text style={{ marginTop: '6px' }} size='14px' color='grey900' weight={600}>
                    {val?.name}
                  </Text>
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
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Select Coin' />
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
              </Row>
              <>
                <Row>
                  <Title>
                    <b>
                      <FormattedMessage id='copy.amount' defaultMessage='Amount' />
                    </b>
                  </Title>
                  <Value>
                    <Field name='amount' component={NumberBox} />
                  </Value>
                  <Value>
                    <FiatDisplay size='12px' weight={600} coin={formValues.coin}>
                      {convertCoinToCoin({
                        baseToStandard: false,
                        coin: formValues.coin,
                        value: formValues.amount
                      }) || 0}
                    </FiatDisplay>
                  </Value>
                </Row>
              </>
            </Form>
            <StickyCTA>
              <div>
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
              {needsWrap && <WrapEthFees {...props} />}
              {isAuthenticated ? (
                <>
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
                          defaultMessage='Make an Offer for {val}'
                          values={{
                            val: `${formValues.amount} ${formValues.coin}`
                          }}
                        />
                      )
                    ) : (
                      <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                    )}
                  </Button>
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
  }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    destroyOnUnmount: false,
    form: 'nftMakeOffer',
    initialValues: {
      coin: 'WETH'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MakeOffer) as React.FC<OwnProps>
