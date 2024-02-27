import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { Modal } from 'blockchain-info-components'
import { modals } from 'data/actions'
import { updateMobile } from 'data/modules/settings/actions'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import MobileNumberAdd from './template'

const AddMobileNumberModal = ({ close, position, total }) => {
  const dispatch = useDispatch()

  const smsNumberNew = useSelector((state) =>
    formValueSelector('mobileNumberAdd')(state, 'mobileNumber')
  )

  const handleClose = () => {
    close()
  }

  const handleSubmit = () => {
    dispatch(updateMobile(smsNumberNew))
    dispatch(modals.closeModal(ModalName.MOBILE_NUMBER_ADD_MODAL))
    dispatch(
      modals.showModal(
        ModalName.MOBILE_NUMBER_VERIFY_MODAL,
        { origin: 'SettingsGeneral' },
        { mobileNumber: smsNumberNew }
      )
    )
  }

  return (
    <Modal size='large' position={position} total={total}>
      <MobileNumberAdd handleClose={handleClose} handleSubmit={handleSubmit} />
    </Modal>
  )
}

export default modalEnhancer('MOBILE_NUMBER_ADD_MODAL')(AddMobileNumberModal)
