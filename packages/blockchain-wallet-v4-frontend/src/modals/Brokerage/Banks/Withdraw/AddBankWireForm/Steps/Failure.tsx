import React from 'react'
import { useDispatch } from 'react-redux'
import { destroy } from 'redux-form'

import { Button, Icon, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import { modals } from 'data/actions'
import { ModalName } from 'data/types'

import { Header } from '../Header'
import { WIRE_BANK_FORM } from './constants'
import { FinalStatusWrapper } from './StepsStyles'

const Failure = ({ message, title }: { message?: string; title?: string }) => {
  const dispatch = useDispatch()

  const onConfirm = () => {
    dispatch(destroy(WIRE_BANK_FORM))
    dispatch(modals.closeModal(ModalName.BANK_DEPOSIT_MODAL))
  }

  return (
    <>
      <FinalStatusWrapper>
        <Header />
        <Icon color='error' name='close-circle' size='3rem' />
        <Text size='20px' weight={600} color='grey900'>
          {title ?? 'Unable to add bank account'}
        </Text>
        <Text size='16px' weight={500} color='grey600'>
          {message ??
            'There was a problem adding your bank account details. Please try to again or add a different payment method.'}
        </Text>
      </FinalStatusWrapper>
      <FlyoutFooter collapsed>
        <Button data-e2e='addWireBankFailure' fullwidth nature='primary' onClick={onConfirm}>
          Try again
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default Failure
