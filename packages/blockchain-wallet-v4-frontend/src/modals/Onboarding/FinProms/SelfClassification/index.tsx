import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import FlyoutContent from 'components/Flyout/Content'
import { modals } from 'data/actions'
import { identityVerification } from 'data/components/actions'
import { getKYCExtraSteps } from 'data/components/identityVerification/selectors'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import { Header } from '../Header'
import SelfClassificationSuccess from './SelfClassificationSuccess'

const SelfClassification = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const dispatch = useDispatch()

  const { data: extraKYCResponse, isLoading, isNotAsked } = useRemote(getKYCExtraSteps)

  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    dispatch(
      modals.showModal(ModalName.COMPLETE_USER_PROFILE, { origin: ModalName.SELF_CLASSIFICATION })
    )

    setTimeout(() => {
      close(ModalName.SELF_CLASSIFICATION)
    }, duration)
  }

  const getModalData = async () => {
    dispatch(identityVerification.fetchExtraKYC('SELF_CLASSIFICATION'))
  }

  const handleSubmit = async () => {
    dispatch(identityVerification.saveKYCExtraQuestions())
    getModalData()
  }

  useEffect(() => {
    getModalData()
    setShow(true)
  }, [])

  useEffect(() => {
    // When the questionnaire is done, it returns an empty string and a 204 status
    // Not sure if I can discern if it has already been completed and the user is getting here by
    // mistake or not.
    // @ts-ignore
    if (extraKYCResponse === '') {
      handleClose()
    }
  }, [extraKYCResponse])

  return (
    <Flyout
      position={position}
      total={total}
      userClickedOutside={userClickedOutside}
      isOpen={show}
      onClose={handleClose}
      data-e2e='selfClassificationModal'
    >
      <FlyoutChild>
        {(isLoading || isNotAsked) && <Loading text={LoadingTextEnum.LOADING} />}
        {!isLoading && extraKYCResponse && (
          <>
            <Header text='Self Classification Questionaire' onClickBack={handleClose} />
            <SelfClassificationSuccess {...extraKYCResponse} onSubmit={handleSubmit} />
          </>
        )}
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.SELF_CLASSIFICATION, { transition: duration })(
  SelfClassification
)
