import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { RaffleEntered } from './RaffleEntered'
import { Signup } from './Signup'
import { CowboysPromoStepsType } from './types'
import { VerifyId } from './VerifyId'

const CowboysPromo = (props) => {
  const [step, setStep] = useState<CowboysPromoStepsType>(props.step)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setShow(true)
    if (window) {
      // @ts-ignore
      window.cowboy = (step) => {
        dispatch(
          actions.modals.showModal(ModalName.COWBOYS_PROMO, { origin: 'AddBankModal', step })
        )
      }
    }
  }, [])

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }, [duration])

  return (
    <Flyout {...props} isOpen={show} onClose={props.close} data-e2e='cowboysPromoModal'>
      <FlyoutChild>
        {step === 'signup' && <Signup handleClose={handleClose} setStep={setStep} />}
        {step === 'raffleEntered' && <RaffleEntered handleClose={handleClose} setStep={setStep} />}
        {step === 'verifyId' && <VerifyId handleClose={handleClose} />}
      </FlyoutChild>
    </Flyout>
  )
}

export default modalEnhancer(ModalName.COWBOYS_PROMO, { preventEscapeClose: true })(CowboysPromo)
