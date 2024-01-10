import React, { useEffect, useState } from 'react'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Template from './template'
import { RemoveBankModalProps } from './types'

const RemoveBank = ({
  accountId,
  accountNumber,
  bankName,
  bankType,
  close,
  position,
  total
}: RemoveBankModalProps & ModalPropsType) => {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    }, duration)
  }

  useEffect(() => {
    setShow(true)
  }, [])

  if (!accountId) return null

  const entityType = bankType === 'BANK_ACCOUNT' ? 'banks' : 'banktransfer'

  return (
    <Flyout
      total={total}
      position={position}
      onClose={handleClose}
      isOpen={show}
      data-e2e='bankRemoveModal'
    >
      <FlyoutChild>
        <Template
          handleClose={handleClose}
          accountId={accountId}
          accountNumber={accountNumber}
          bankName={bankName}
          entityType={entityType}
        />
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.REMOVE_BANK_MODAL, { transition: duration })(RemoveBank)
