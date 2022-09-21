import React, { useEffect, useState } from 'react'

import Flyout from 'components/Flyout'

import { Loading, LoadingTextEnum } from '../../components'
import { LoadingWrapper } from '../OrderCard/OrderCard.model'
import { Props } from './TerminateCard'
import TerminateFailureStep from './TerminateFailureStep'
import TerminateStep from './TerminateStep'
import TerminateSuccessStep from './TerminateSuccessStep'

const TerminateCard = (props: Props) => {
  const { close, currentCard, debitCardActions, terminateHandler } = props
  const [show, setShow] = useState(true)

  useEffect(() => {
    return () => {
      debitCardActions.cleanTerminateHandler()
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    })
  }

  const handleTerminate = () => {
    debitCardActions.terminateCard(currentCard.id)
  }

  const currentView = () =>
    terminateHandler.cata({
      Failure: () => (
        <TerminateFailureStep handleClose={handleClose} handleRetry={handleTerminate} />
      ),
      Loading: () => (
        <LoadingWrapper>
          <Loading text={LoadingTextEnum.PROCESSING} />
        </LoadingWrapper>
      ),
      NotAsked: () => (
        <TerminateStep
          handleClose={handleClose}
          handleTerminate={handleTerminate}
          last4={currentCard.last4}
        />
      ),
      Success: () => <TerminateSuccessStep handleClose={handleClose} />
    })

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      {currentView()}
    </Flyout>
  )
}

export default TerminateCard
