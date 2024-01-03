import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Template from './template'

const BankDetails = (props: ModalPropsType) => {
  const [show, setShow] = useState(false)

  const account = useSelector(selectors.components.brokerage.getAccount)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  useEffect(() => {
    setShow(true)
  }, [])

  if (!account) return null

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='bankDetailsModal'>
      <FlyoutChild>
        <Template account={account} handleClose={handleClose} />
      </FlyoutChild>
    </Flyout>
  )
}

const enhance = compose(ModalEnhancer(ModalName.BANK_DETAILS_MODAL, { transition: duration }))

export default enhance(BankDetails)
