import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Button, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { SignupComponent } from '../types'

const Signup: SignupComponent = ({ handleClose, setStep }) => {
  const dispatch = useDispatch()

  const continueCallback = useCallback(() => {
    dispatch(
      actions.modals.showModal(ModalName.KYC_MODAL, { needMoreInfo: false, origin: 'AddBankModal' })
    )

    setTimeout(() => {
      setStep('raffleEntered')
    }, 4000)
  }, [dispatch])

  return (
    <FlyoutContainer>
      <FlyoutHeader mode='close' data-e2e='CowboysSignupModal' onClick={handleClose} />
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column' alignItems='center'>
          <Padding bottom={61}>
            <Image name='cowboys' width='219px' />
          </Padding>
          <Padding bottom={24}>
            <Text color='grey900' size='24px' weight={700}>
              <FormattedMessage
                id='copy.cowboys.signup_win_big'
                defaultMessage='Sign up to win BIG!'
              />
            </Text>
          </Padding>
          <Padding bottom={80} horizontal={77}>
            <Text color='grey900' size='16px' weight={600} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.enter_details_rewards'
                defaultMessage='Enter your details to be entered for a chance to win rewards'
              />
            </Text>
          </Padding>
        </Flex>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Padding bottom={16}>
          <Button
            data-e2e='CowboySignupContinueButton'
            nature='primary'
            fullwidth
            onClick={continueCallback}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </Padding>
        <Button
          data-e2e='CowboySignupDismissButton'
          nature='empty-blue'
          fullwidth
          onClick={handleClose}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.maybe_later'
            defaultMessage='Maybe Later'
          />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default Signup
