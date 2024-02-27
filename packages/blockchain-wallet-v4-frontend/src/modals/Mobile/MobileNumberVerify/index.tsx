import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { Modal } from 'blockchain-info-components'
import { modals } from 'data/actions'
import { resendMobile, verifyMobile } from 'data/modules/settings/actions'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import MobileNumberVerify from './template'

const VerifyMobileNumberModal = ({ close, mobileNumber, position, total }) => {
  const dispatch = useDispatch()

  const code = useSelector((state) => formValueSelector('mobileNumberVerify')(state, 'code'))

  const handleClose = () => {
    close()
  }
  const handleResend = () => {
    dispatch(resendMobile(mobileNumber))
  }

  const handleChange = () => {
    dispatch(modals.closeModal(ModalName.MOBILE_NUMBER_VERIFY_MODAL))
    dispatch(modals.showModal(ModalName.MOBILE_NUMBER_CHANGE_MODAL, { origin: 'SettingsGeneral' }))
  }

  const handleSubmit = () => {
    dispatch(verifyMobile(code))
  }

  return (
    <Modal size='large' position={position} total={total}>
      <MobileNumberVerify
        mobileNumber={mobileNumber}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleResend={handleResend}
        handleChange={handleChange}
      />
    </Modal>
  )
}

export default modalEnhancer('MOBILE_NUMBER_VERIFY_MODAL')(VerifyMobileNumberModal)
