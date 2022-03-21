import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../components'
import { ModalPropsType } from '../types'
import CreateCardStep from './CreateCardStep'
import FailedCreationStep from './FailedCreationStep'
import { LoadingWrapper } from './model'
import { getData } from './selectors'
import SuccessCreationStep from './SuccessCreationStep'

const OrderMyCard = (props: Props) => {
  const [show, setShow] = useState(true)

  // MVP only one product will be available, for V1 there will be a product selector in the UI
  const [{ productCode }] = props.products

  useEffect(() => {
    // Initialize selector for preventing wrong state
    props.debitCardActions.resetCreateCardState()
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    })
  }

  const handleCreateCard = () => {
    props.debitCardActions.createCard(productCode)
  }

  const handleRetry = () => {
    props.debitCardActions.createCard(productCode)
  }

  const currentView = () =>
    props.data.cata({
      Failure: () => <FailedCreationStep handleClose={handleClose} handleRetry={handleRetry} />,
      Loading: () => (
        <LoadingWrapper>
          <Loading text={LoadingTextEnum.PROCESSING} />
        </LoadingWrapper>
      ),
      NotAsked: () => (
        <CreateCardStep handleClose={handleClose} handleCreateCard={handleCreateCard} />
      ),
      Success: () => <SuccessCreationStep />
    })

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      {currentView()}
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  products: selectors.components.debitCard.getProducts(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<any>(modalEnhancer(ModalName.ORDER_MY_CARD, { transition: duration }))
export default connector(enhance(OrderMyCard))
