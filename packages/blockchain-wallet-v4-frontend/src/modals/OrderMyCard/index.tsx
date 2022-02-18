import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration } from 'components/Flyout'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import CreateCardStep from './CreateCardStep'

const OrderMyCard = (props: Props) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    })
  }

  const handleCreateCard = () => {}

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      <CreateCardStep handleClose={handleClose} handleCreateCard={handleCreateCard} />
    </Flyout>
  )
}

const connector = connect()

type Props = ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<any>(modalEnhancer(ModalName.ORDER_MY_CARD, { transition: duration }))
export default connector(enhance(OrderMyCard))
