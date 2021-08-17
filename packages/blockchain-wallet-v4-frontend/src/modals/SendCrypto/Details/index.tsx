import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import { selectors } from 'data'

import { Props as OwnProps } from '..'
import Success from './template.success'

// TODO: different transaction types (custodial, non custodial) will have different details
const Details: React.FC<Props> = (props) => {
  return (
    <>
      <FlyoutWrapper>
        <StepHeader>
          <Text size='24px' color='grey800' weight={600}>
            <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
          </Text>
        </StepHeader>
      </FlyoutWrapper>
      {props.transactionR.cata({
        Failure: () => 'Failure',
        Loading: () => 'Loading',
        NotAsked: () => 'Loading',
        Success: (val) => <Success transaction={val} />
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  transactionR: selectors.components.sendCrypto.getTransaction(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default Details as React.ComponentType<OwnProps>
