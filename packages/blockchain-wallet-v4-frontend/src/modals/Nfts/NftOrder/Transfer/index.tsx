import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'
import { Title, Value } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import TextBox from 'components/Form/TextBox'
import { selectors } from 'data'
import { required, validEthAddress } from 'services/forms'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import TransferCTA from './cta'
import TransferFees from './fees'

const Transfer: React.FC<Props> = (props) => {
  const { close, orderFlow } = props
  const { viewOrder } = orderFlow

  return viewOrder ? (
    <>
      <FlyoutHeader sticky data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
        Transfer Item
      </FlyoutHeader>
      <NftAssetHeaderRow asset={viewOrder} />
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
                  asset: viewOrder,
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
        <TransferFees {...props} asset={viewOrder} />
        <br />
        <TransferCTA {...props} asset={viewOrder} />
      </StickyCTA>
    </>
  ) : null
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

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(Transfer) as React.FC<OwnProps>
