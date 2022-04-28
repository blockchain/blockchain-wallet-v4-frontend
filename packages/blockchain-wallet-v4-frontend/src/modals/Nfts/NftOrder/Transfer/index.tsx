import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import Form from 'components/Form/Form'
import TextBox from 'components/Form/TextBox'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required, validEthAddress } from 'services/forms'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import TransferFees from '../ShowAsset/Transfer/fees'

const Transfer: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props

  const disabled = formValues ? !formValues.to || props.orderFlow.isSubmitting : true

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
              <FlyoutHeader data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
                Transfer Item
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
              </div>
            </Row>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0em 0em 30em 0em'
              }}
            >
              <Row>
                <Title>
                  <b>
                    <Text weight={600}>Where Is This Going?</Text>
                  </b>
                </Title>
                <Value>
                  <Field
                    onChange={(e) =>
                      props.nftActions.fetchFees({
                        asset: val,
                        operation: GasCalculationOperations.Transfer,
                        to: e.target.value
                      })
                    }
                    name='to'
                    component={TextBox}
                    placeholder='i.e 0x234...4589 or john.eth'
                    validate={[required, validEthAddress]}
                  />
                </Value>
                <Value>
                  <Text size='12px'>Double check the address above before clicking Transfer </Text>
                </Value>
              </Row>
            </div>
            <StickyCTA>
              <TransferFees {...props} asset={val} />
              {props.orderFlow.fees.cata({
                Failure: (e) => (
                  <>
                    <Text
                      size='14px'
                      weight={600}
                      style={{ marginBottom: '8px', maxHeight: '200px' }}
                    >
                      {e}
                    </Text>
                    <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
                      <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
                    </Button>
                  </>
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
                    type='submit'
                    onClick={() =>
                      nftActions.createTransfer({
                        asset: val,
                        gasData: fees,
                        to: formValues.to
                      })
                    }
                  >
                    {props.orderFlow.isSubmitting ? (
                      <HeartbeatLoader color='blue100' height='20px' width='20px' />
                    ) : (
                      <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
                    )}
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
