import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'

import { getDomainApi } from '@core/redux/walletOptions/selectors'
import { ExtraQuestionsType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import FlyoutContent from 'components/Flyout/Content'
import { modals } from 'data/actions'
import { identityVerification } from 'data/components/actions'
import { getKYCExtraSteps } from 'data/components/identityVerification/selectors'
import { getUserApiToken } from 'data/modules/profile/selectors'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import { Header } from '../Header'
import SelfClassificationSuccess from './SelfClassificationSuccess'

const FORM_CONTEXT = 'SELF_CLASSIFICATION'

const SelfClassification = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const dispatch = useDispatch()
  const api = useSelector(getDomainApi).getOrElse('')
  const nabuToken = useSelector(getUserApiToken)

  const dataRef = useRef<ExtraQuestionsType>({
    blocking: false,
    context: 'SELF_CLASSIFICATION',
    nodes: []
  })

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
    dispatch(identityVerification.fetchExtraKYC(FORM_CONTEXT))
  }

  const handleSubmit = async () => {
    // The catch here is that is sends a put to the very same endpoint, saves, and doing a get retrieves the new fields.
    // So we need to wait for the PUT to end before doing a new fetch.
    // Using dispatch(identityVerification.saveKYCExtraQuestions()) did not work because it does not wait
    try {
      await axios.put(
        `${api}/nabu-gateway/kyc/extra-questions?context=${FORM_CONTEXT}`,
        dataRef.current,
        {
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${nabuToken}` }
        }
      )
      dispatch(identityVerification.fetchExtraKYC(FORM_CONTEXT))
    } catch (e) {
      // TODO: FRICTIONS check what to do here
      // eslint-disable-next-line no-console
      console.error(e)
    }
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
            <SelfClassificationSuccess
              {...extraKYCResponse}
              onSubmit={handleSubmit}
              dataRef={dataRef}
            />
          </>
        )}
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.SELF_CLASSIFICATION, { transition: duration })(
  SelfClassification
)
