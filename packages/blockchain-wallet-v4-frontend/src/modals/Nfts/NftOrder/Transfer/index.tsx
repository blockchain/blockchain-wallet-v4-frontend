import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'
import { Form, NumberBox, TextBox } from 'components/Form'
import TabMenuNftSaleType from 'components/Form/TabMenuNftSaleType'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required, validEthAddress } from 'services/forms'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import TransferFees from '../ShowAsset/Transfer/fees'

const Transfer: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props
  const coin = 'ETH'

  const disabled = formValues ? !formValues.to || Remote.Loading.is(props.sellOrder) : true

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
                    <FormattedMessage id='copy.to' defaultMessage='To' />
                  </b>
                </Title>
                <Value>
                  <Field name='to' component={TextBox} validate={[required, validEthAddress]} />
                </Value>
              </Row>
            </Form>
            <StickyCTA>
              <TransferFees {...props} asset={val} />
              {props.orderFlow.fees.cata({
                Failure: () => (
                  <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
                  </Button>
                ),
                Loading: () => (
                  <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
                  </Button>
                ),
                NotAsked: () => null,
                Success: (fees) => (
                  <Button
                    jumbo
                    nature='primary'
                    fullwidth
                    data-e2e='transferNft'
                    disabled={disabled}
                    onClick={() =>
                      nftActions.createTransfer({
                        asset: val,
                        gasData: fees,
                        to: formValues.to
                      })
                    }
                  >
                    <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
                  </Button>
                )
              })}
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftTransfer')(state) as { to: string }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftTransfer'
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(Transfer) as React.FC<OwnProps>
