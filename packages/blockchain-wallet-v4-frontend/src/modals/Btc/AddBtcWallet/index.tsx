import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { Modal } from 'blockchain-info-components'
import { newHDAccount } from 'data/modules/settings/actions'
import modalEnhancer from 'providers/ModalEnhancer'

import AddBtcWallet from './template'

const AddBtcWalletModal = ({ close, position, total }) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    close()
  }

  const wallet = useSelector((state) => formValueSelector('addBtcWallet')(state, 'wallet'))
  const handleSubmit = () => {
    dispatch(newHDAccount(wallet))
  }

  return (
    <Modal size='large' position={position} total={total}>
      <AddBtcWallet handleSubmit={handleSubmit} handleClose={handleClose} />
    </Modal>
  )
}

export default modalEnhancer('ADD_BTC_WALLET_MODAL')(AddBtcWalletModal)
