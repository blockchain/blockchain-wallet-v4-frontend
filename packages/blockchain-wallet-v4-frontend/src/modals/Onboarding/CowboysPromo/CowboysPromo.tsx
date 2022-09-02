import React from 'react'

import { RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import Flyout, { FlyoutChild } from 'components/Flyout'
import { actions, model } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { RaffleEntered } from './RaffleEntered'
import { Signup } from './Signup'
import { VerifyId } from './VerifyId'

const CowboysPromo = (props) => {
  return (
    <Flyout {...props} isOpen onClose={props.close} data-e2e='cowboysPromoModal' doNotHide>
      {props.step === 'signup' && (
        <FlyoutChild>
          <Signup handleClose={props.close} />
        </FlyoutChild>
      )}
      {props.step === 'raffleEntered' && (
        <FlyoutChild>
          <RaffleEntered />
        </FlyoutChild>
      )}
      {props.step === 'verifyId' && (
        <FlyoutChild>
          <VerifyId />
        </FlyoutChild>
      )}
    </Flyout>
  )
}

export default modalEnhancer(ModalName.COWBOYS_PROMO, { preventEscapeClose: true })(CowboysPromo)
