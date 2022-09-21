import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { OrderCardStep } from 'data/components/debitCard/model'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import ResidentialAddress from './ResidentialAddress'
import SelectCard from './SelectCard'
import SocialSecurityNumber from './SocialSecurityNumber'

const OrderCard = (props: Props) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    props.debitCardActions.resetCreateCardState()
  }, [props.debitCardActions])

  const handleClose = () => {
    setShow(false)

    setTimeout(() => {
      props.close()
    })
  }

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose} data-e2e='orderDebitCardModal'>
      {props.step === OrderCardStep.RESIDENTIAL_ADDRESS ? (
        <FlyoutChild>
          <ResidentialAddress handleClose={handleClose} />
        </FlyoutChild>
      ) : null}
      {props.step === OrderCardStep.SSN ? (
        <FlyoutChild>
          <SocialSecurityNumber />
        </FlyoutChild>
      ) : null}
      {props.step === OrderCardStep.SELECT_CARD ? (
        <FlyoutChild>
          <SelectCard handleClose={handleClose} />
        </FlyoutChild>
      ) : null}
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.debitCard.getOrderCardStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.ORDER_MY_CARD_MODAL, { transition: duration })
)
export default connector(enhance(OrderCard))
