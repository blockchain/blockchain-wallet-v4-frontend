import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox, SelectBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { DeepLinkGoal } from 'data/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import MakeOfferFees from './fees'

const MakeOffer: React.FC<Props> = (props) => {
  const { close, erc20Balance, formValues, isAuthenticated, nftActions, orderFlow } = props

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
              </>
            </Form>
            <StickyCTA>
              <MakeOfferFees {...props} asset={val} />
              {isAuthenticated ? (
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
                    <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                  )}
                </Button>
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
  erc20Balance: selectors.core.data.eth.getErc20Balance(
    state,
    // @ts-ignore
    selectors.form.getFormValues('nftMakeOffer')(state)?.coin || 'WETH'
  ),
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
