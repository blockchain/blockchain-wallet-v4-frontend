import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Row, Title, Value } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import TextBox from 'components/Form/TextBox'
import { selectors } from 'data'
import { required, validEthAddress } from 'services/forms'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import TransferFees from './fees'

const Transfer: React.FC<Props> = (props) => {
  const { close, formValues, isInvited, nftActions, openSeaAssetR } = props

  const disabled = formValues ? !formValues.to || props.orderFlow.isSubmitting : true

  return (
    <>
      {openSeaAssetR.cata({
        Failure: (e) => <NftFlyoutFailure error={e} close={close} />,
        Loading: () => <NftFlyoutLoader close={props.close} />,
        NotAsked: () => <NftFlyoutLoader close={props.close} />,
        Success: (val) => (
          <>
            <FlyoutHeader sticky data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
              Transfer Item
            </FlyoutHeader>
            <NftAssetHeaderRow asset={val} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <NftFlyoutRow>
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
              </NftFlyoutRow>
            </div>
            <StickyCTA>
              <TransferFees {...props} asset={val} />
              <br />
              {isInvited ? (
                props.orderFlow.fees.cata({
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
                })
              ) : (
                <Link href='https://www.blockchain.com/waitlist/nft' target='_blank'>
                  <Button jumbo nature='primary' fullwidth data-e2e='joinWaitlist'>
                    <FormattedMessage id='copy.join_waitlist' defaultMessage='Join the Waitlist' />
                  </Button>
                </Link>
              )}
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
