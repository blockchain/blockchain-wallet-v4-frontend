import React, { useEffect, useState } from 'react'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Template from './template'
import { RemoveBankModalProps } from './types'

const RemoveBankFlyout = (props: RemoveBankModalProps & ModalPropsType) => {
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

  const { accountId, accountNumber, bankName, bankType } = props
  const entityType = bankType === 'BANK_ACCOUNT' ? 'banks' : 'banktransfer'

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='bankRemoveModal'>
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

const enhance = compose(ModalEnhancer(ModalName.REMOVE_BANK_MODAL, { transition: duration }))

export default enhance(RemoveBankFlyout)
