import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { convertCoinToCoin } from '@core/exchange'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'
import { Form, NumberBox } from 'components/Form'
import TabMenuNftSaleType from 'components/Form/TabMenuNftSaleType'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'

const MarkForSale: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props
  const coin = 'ETH'

  const disabled = formValues['sale-type'] === 'fixed-price' ? !formValues.amount : true

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
                    <FormattedMessage id='copy.sale_type' defaultMessage='Sale Type' />
                  </b>
                </Title>
                <Value>
                  <div style={{ display: 'inline-block' }}>
                    <Field name='sale-type' component={TabMenuNftSaleType} />
                  </div>
                </Value>
              </Row>
              {formValues['sale-type'] === 'fixed-price' ? (
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
                      <FiatDisplay size='12px' weight={600} coin={coin}>
                        {convertCoinToCoin({
                          baseToStandard: false,
                          coin,
                          value: formValues.amount
                        }) || 0}
                      </FiatDisplay>
                    </Value>
                  </Row>
                  <Row>
                    <Value asTitle>
                      <FormattedMessage id='copy.service_fees' defaultMessage='Service Fees' />
                    </Value>
                    <Title asValue>
                      <FormattedMessage
                        id='copy.opensea_service_fee'
                        defaultMessage='OpenSea Service Fee'
                      />{' '}
                      {val.asset_contract.opensea_seller_fee_basis_points / 100}%
                    </Title>
                    <Title asValue>
                      <FormattedMessage
                        id='copy.creator_royalty'
                        defaultMessage='Creator Royalty'
                      />{' '}
                      {Number(val.collection.dev_seller_fee_basis_points) / 100}%
                    </Title>
                  </Row>
                </>
              ) : (
                <Row>
                  <Title>
                    <ErrorCartridge>
                      <FormattedMessage id='copy.coming_soon' defaultMessage='Coming Soon' />
                    </ErrorCartridge>
                  </Title>
                </Row>
              )}
            </Form>
            <StickyCTA>
              <Button
                jumbo
                nature='primary'
                fullwidth
                data-e2e='sellNft'
                disabled={disabled}
                onClick={() => nftActions.createSellOrder({ asset: val })}
              >
                {formValues.amount ? (
                  <FormattedMessage
                    id='copy.mark_for_sale'
                    defaultMessage='Mark for Sale for {val}'
                    values={{
                      val: `${formValues.amount} ${coin}`
                    }}
                  />
                ) : (
                  <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
                )}
              </Button>
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftMarkForSale')(state) as { amount: string }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftMarkForSale',
    initialValues: { 'sale-type': 'fixed-price' }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MarkForSale) as React.FC<OwnProps>
