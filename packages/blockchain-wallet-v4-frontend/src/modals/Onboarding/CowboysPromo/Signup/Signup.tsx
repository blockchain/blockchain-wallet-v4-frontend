import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Text } from '@blockchain-com/constellation'

import { Button, Image } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { SignupComponent } from './types'

const Signup: SignupComponent = ({ handleClose }) => {
  const dispatch = useDispatch()

  const continueCallback = useCallback(() => {
    return dispatch(
      actions.modals.showModal(ModalName.KYC_MODAL, { needMoreInfo: false, origin: 'AddBankModal' })
    )
  }, [dispatch])

  return (
    <FlyoutContainer>
      <FlyoutHeader mode='close' data-e2e='CowboysSignupModal' onClick={handleClose} />
      <FlyoutContent mode='middle'>
        <Image name='cowboy-star' size='249px' />
        <Text size={24}>
          <FormattedMessage id='copy.cowboys.signup_win_big' defaultMessage='Sign up to win BIG!' />
        </Text>
        <Text size={16}>
          <FormattedMessage
            id='copy.cowboys.enter_details_rewards'
            defaultMessage='Enter your details to be entered for a chance to win rewards'
          />
        </Text>
        <Button data-e2e='CowboySignupContinueButton' nature='primary' onClick={continueCallback}>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
        <Button data-e2e='CowboySignupDismissButton' nature='empty-blue' onClick={handleClose}>
          <FormattedMessage
            id='modals.recurringbuys.get_started.maybe_later'
            defaultMessage='Maybe Later'
          />
        </Button>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default Signup
