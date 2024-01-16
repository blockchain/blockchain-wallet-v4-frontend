import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'

import { getDomainApi } from '@core/redux/walletOptions/selectors'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { modals } from 'data/actions'
import { getUserApiToken } from 'data/modules/profile/selectors'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import { Wrapper } from './model'
import SelfAssessmentFinalPage from './SelfAssessmentFinalPage'
import SelfAssessment from './SelfAssessmentSuccess'
import { IntroPageType, QuizSubmitResult, SelfAssessmentType } from './types'

const QUESTIONS_INITIAL = {
  blocking: false,
  introPage: {} as IntroPageType,
  pages: []
}

const ENDPOINT = 'nabu-gateway/onboarding/quiz'

// TODO: FRICTIONS - REMOVE TEST STATUSES
const RETRY = {
  nextRetryDate: '2024-01-16T05:19:52.219259Z',
  status: 'RETRY'
}

const RETRY_LATER = {
  nextRetryDate: '2024-01-16T21:19:52.219259Z',
  status: 'RETRY_LATER'
}

const SUCCESS = {
  status: 'SUCCESS'
}

const FAILED = { status: 'FAILED' }

const SelfAssessmentModal = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const dispatch = useDispatch()
  const api = useSelector(getDomainApi).getOrElse('')
  const nabuToken = useSelector(getUserApiToken)

  const [step, setStep] = useState(-1)
  const [show, setShow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [modalQuestions, setModalQuestions] = useState<SelfAssessmentType>(QUESTIONS_INITIAL)
  const [resultData, setResultData] = useState<QuizSubmitResult>({} as QuizSubmitResult)

  // Here we hold the ref to the form to send it later without re-rendering extra times
  const dataRef = useRef<SelfAssessmentType>({
    blocking: false,
    introPage: {} as IntroPageType,
    pages: []
  })

  const getModalData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${api}/${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${nabuToken}` }
      })
      dataRef.current = response.data // This is to have the ref populated beforehand
      setModalQuestions(response.data)
    } catch (e) {
      // TODO: FRICTIONS check what to do here
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setLoading(false)
  }

  const goToNextStep = () => setStep((step) => step + 1)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await axios.put(`${api}/${ENDPOINT}`, dataRef.current, {
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${nabuToken}` }
      })
      // TODO: FRICTIONS thoroughly check each status is correctly displayed
      // {
      //   "status": "SUCCESS", "RETRY", "RETRY_LATER", "FAILED",
      //   "nextRetryDate": "2023..."
      // }
      setResultData(response.data)
    } catch (e) {
      // TODO: FRICTIONS check what to do here
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setLoading(false)
  }

  const handleClose = () => {
    setShow(false)

    // dispatch(
    //   trackEvent({
    //     key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED,
    //     properties: { current_step_completed: String(data.currentStep) }
    //   })
    // )

    dispatch(
      modals.showModal(ModalName.COMPLETE_USER_PROFILE, { origin: ModalName.SELF_ASSESSMENT })
    )

    setTimeout(() => {
      close(ModalName.SELF_ASSESSMENT)
    }, duration)
  }

  useEffect(() => {
    getModalData()
    setShow(true)
  }, [])

  const { introPage, pages } = modalQuestions

  const isLastPage = step === pages?.length - 1
  const showResultScreen = !isLoading && !!resultData?.status
  const showAssessment = !isLoading && modalQuestions && !showResultScreen

  return (
    <Flyout
      total={total}
      position={position}
      userClickedOutside={userClickedOutside}
      isOpen={show}
      onClose={handleClose}
      data-e2e='selfAssessmentModal'
    >
      <FlyoutChild>
        <Wrapper>
          {isLoading && <Loading text={LoadingTextEnum.LOADING} />}
          {showAssessment && (
            <SelfAssessment
              introPage={step < 0 ? introPage : {}}
              nodes={pages[step]?.nodes}
              dataRef={dataRef}
              step={step}
              onSubmit={isLastPage ? handleSubmit : goToNextStep}
            />
          )}
          {showResultScreen && (
            <SelfAssessmentFinalPage
              handleClose={handleClose}
              status={resultData.status}
              nextRetryDate={resultData.nextRetryDate ?? ''}
            />
          )}
        </Wrapper>
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.SELF_ASSESSMENT, { transition: duration })(
  SelfAssessmentModal
)
