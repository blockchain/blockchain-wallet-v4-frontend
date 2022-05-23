import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'

const TerminateCard = (props: Props) => {
  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    })
  }

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      TERMINATE
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.TERMINATE_CARD, { transition: duration })
)
export default connector(enhance(TerminateCard))
