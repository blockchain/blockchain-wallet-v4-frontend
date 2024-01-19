import React, { useEffect, useState } from 'react'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Template from './template'
import { BankDetailsModalProps } from './types'

const BankDetails = (props: BankDetailsModalProps & ModalPropsType) => {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  useEffect(() => {
    setShow(true)
  }, [])

  if (!props.accountId) return null

  const { accountId, accountNumber, accountType, bankName, bankType } = props

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='bankDetailsModal'>
      <FlyoutChild>
        <Template
          handleClose={handleClose}
          accountId={accountId}
          accountType={accountType}
          bankType={bankType}
          accountNumber={accountNumber}
          bankName={bankName}
        />
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.BANK_DETAILS_MODAL, { transition: duration })(BankDetails)
