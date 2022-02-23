import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'
import { Form, NumberBox, SelectBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import MakeOfferFees from './fees'

const MakeOffer: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props
  const { activeOrder } = orderFlow

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
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
                name='arrow-left'
                cursor
                role='button'
                style={{ left: '40px', position: 'absolute', top: '40px' }}
              />
              <Icon
                onClick={() => close()}
                name='close'
                cursor
                role='button'
                style={{ position: 'absolute', right: '40px', top: '40px' }}
              />
              <FullAssetImage cropped backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
            </div>
            <AssetDesc>
              <Text size='16px' color='grey900' weight={600}>
                {val?.collection?.name}
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                {val?.name}
              </Text>
            </AssetDesc>
            <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val?.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row>
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
                {activeOrder ? (
                  <Row>
                    <Title>
                      <FormattedMessage id='copy.current_price' defaultMessage='Current Price' />
                    </Title>
                    <Value>
                      <div style={{ display: 'flex' }}>
                        <CoinDisplay
                          size='14px'
                          color='black'
                          weight={600}
                          coin={activeOrder.paymentTokenContract?.symbol}
                        >
                          {activeOrder.basePrice}
                        </CoinDisplay>
                        &nbsp;-&nbsp;
                        <FiatDisplay
                          size='12px'
                          color='grey600'
                          weight={600}
                          coin={activeOrder.paymentTokenContract?.symbol}
                        >
                          {activeOrder.basePrice}
                        </FiatDisplay>
                      </div>
                    </Value>
                  </Row>
                ) : null}
              </>
            </Form>
            {activeOrder ? (
              <StickyCTA>
                <MakeOfferFees {...props} asset={val} />
                <Button
                  jumbo
                  nature='primary'
                  fullwidth
                  data-e2e='makeOfferNft'
                  disabled={disabled}
                  onClick={() => nftActions.createOffer({ asset: val, ...formValues })}
                >
                  {formValues.amount ? (
                    props.orderFlow.isSubmitting ? (
                      <HeartbeatLoader color='blue100' height='20px' width='20px' />
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
                    <FormattedMessage id='copy.make_and_offer' defaultMessage='Make an Offer' />
                  )}
                </Button>
              </StickyCTA>
            ) : null}
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftMakeOffer')(state) as {
    amount: string
    coin: string
  }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftMakeOffer',
    initialValues: {
      coin: 'WETH'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MakeOffer) as React.FC<OwnProps>
