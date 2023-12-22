import React from 'react'
import { useDispatch } from 'react-redux'
import { destroy } from 'redux-form'

import { Button, Icon, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import { actions } from 'data'
import { BankDWStepType } from 'data/types'

import { Header } from '../Header'
import { FieldsWrapper } from './StepsStyles'

const Failure = () => {
  const dispatch = useDispatch()

  const onConfirm = () => {
    dispatch(destroy('addWireBank'))
    dispatch(actions.components.brokerage.setDWStep({ dwStep: BankDWStepType.DEPOSIT_METHODS }))
  }

  return (
    <>
      <FieldsWrapper>
        <Header />
        <Icon name='bank-filled' />
        <div style={{ textAlign: 'center' }}>
          <Text size='20px' weight={600} color='grey900' style={{ marginBottom: '0.5rem' }}>
            Unable to add bank account
          </Text>
          <Text size='16px' weight={500} color='grey600'>
            There was a problem adding your bank account details. Please try to again or add a
            different payment method.
          </Text>
        </div>
      </FieldsWrapper>
      <FlyoutFooter collapsed>
        <Button data-e2e='addWireBankFailure' fullwidth nature='primary' onClick={onConfirm}>
          Try again
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default Failure
