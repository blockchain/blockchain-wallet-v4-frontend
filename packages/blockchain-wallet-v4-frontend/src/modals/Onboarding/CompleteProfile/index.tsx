import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { getDomainApi } from '@core/redux/walletOptions/selectors'
import { ProductTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { modals } from 'data/actions'
import { trackEvent } from 'data/analytics/slice'
import { buySell, identityVerification } from 'data/components/actions'
import { getUserApiToken } from 'data/modules/profile/selectors'
import { Analytics, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../components'
import LinkItem from './LinkItem'
import {
  CloseIconContainer,
  ContentWrapper,
  HeaderWrapper,
  LinksWrapper,
  ProgressRow,
  ProgressWrapper,
  TopText,
  Wrapper
} from './model'
import { getData } from './selectors'
import { COMPLETE_PROFILE_STEPS, ResponseShape } from './types'

const CompleteProfile = (props) => {
  const dispatch = useDispatch()

  const api = useSelector(getDomainApi).getOrElse('')
  const nabuToken = useSelector(getUserApiToken)
  const data = useSelector(getData)

  const [show, setShow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [handholdData, setHandholdData] = useState<ResponseShape[]>([])

  const getHandholdData = async () => {
    setLoading(true)
    try {
      const response: { data: { items: ResponseShape[] } } = await axios.get(
        `${api}/nabu-gateway/onboarding/handhold`,
        {
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${nabuToken}` }
        }
      )

      setHandholdData(response.data.items)
    } catch (e) {
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

    setTimeout(() => {
      props.close(ModalName.COMPLETE_USER_PROFILE)
    }, duration)
  }

  const trackButtonEvent = (eventType: COMPLETE_PROFILE_STEPS) => {
    // dispatch(
    //   trackEvent({
    //     key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED,
    //     properties: {
    //       button_clicked: isButtonClick,
    //       current_step_completed: String(data.currentStep),
    //       item: eventType
    //     }
    //   })
    // )
  }

  const startVerification = () => {
    dispatch(
      identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'CompleteProfile',
        tier: 2
      })
    )

    trackButtonEvent('KYC_VERIFICATION')
  }

  const startAddingCards = () => {
    dispatch(buySell.showModal({ origin: 'CompleteProfile' }))
    dispatch(
      buySell.setStep({
        step: 'DETERMINE_CARD_PROVIDER'
      })
    )
    dispatch(modals.closeModal(ModalName.COMPLETE_USER_PROFILE))
  }

  const handleLinkBankOrCardClick = () => {
    trackButtonEvent('BUY_CRYPTO')
    if (data.isVerifiedId) {
      startAddingCards()
    } else {
      startVerification()
    }
  }

  const handleBuyCryptoClick = () => {
    const { isBankOrCardLinked, isVerifiedId } = data

    if (isBankOrCardLinked) {
      dispatch(buySell.showModal({ origin: 'CompleteProfile' }))
    } else if (isVerifiedId) {
      startAddingCards()
      return
    } else {
      dispatch(
        identityVerification.verifyIdentity({
          needMoreInfo: false,
          origin: 'CompleteProfile',
          tier: 2
        })
      )
      trackButtonEvent('KYC_VERIFICATION')
    }

    dispatch(modals.closeModal(ModalName.COMPLETE_USER_PROFILE))
  }

  const handleSelfClassification = () => {
    dispatch(modals.showModal(ModalName.SELF_CLASSIFICATION, { origin: 'CompleteProfile' }))
  }

  const handleSelfAssessment = () => {
    dispatch(modals.showModal(ModalName.SELF_ASSESSMENT, { origin: 'CompleteProfile' }))
  }

  const getOnClick = (step: COMPLETE_PROFILE_STEPS) => {
    handleClose()
    switch (step) {
      case 'KYC_VERIFICATION':
        return startVerification()
      case 'FINPROMS_ASSESSMENT':
        return handleSelfAssessment()
      case 'SELF_CLASSIFICATION':
        return handleSelfClassification()
      case 'DEPOSIT_CRYPTO':
        return handleLinkBankOrCardClick()
      case 'BUY_CRYPTO':
        return handleBuyCryptoClick()
      case 'EMAIL_VERIFICATION':
        // Investigate what to do here, I don't think this appears when modal is called
        return () => {}

      default:
        return startVerification()
    }
  }

  useEffect(() => {
    setShow(true)
    getHandholdData()

    dispatch(buySell.fetchCards(false))
    dispatch(buySell.fetchAccumulatedTrades({ product: ProductTypes.SIMPLEBUY }))

    // dispatch(
    //   trackEvent({
    //     key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED,
    //     properties: { current_step_completed: String(data.currentStep) }
    //   })
    // )
  }, [])

  const completedSteps = handholdData.filter((step) => step.status === 'COMPLETED').length

  const percentage = handholdData.length > 0 ? (completedSteps / handholdData.length) * 100 : 0

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose} data-e2e='completeProfileModal'>
      <FlyoutChild>
        <Wrapper>
          {isLoading && <Loading text={LoadingTextEnum.LOADING} />}
          {!isLoading && (
            <>
              <HeaderWrapper>
                <TopText color='grey800' size='20px' weight={600}>
                  <ProgressRow>
                    <ProgressWrapper>
                      <CircularProgressBar percentage={percentage} strokeWidth={12}>
                        <Text size='16px' color='blue600' weight={600}>
                          {`${completedSteps}/${handholdData.length}`}
                        </Text>
                      </CircularProgressBar>
                    </ProgressWrapper>
                  </ProgressRow>
                  <CloseIconContainer>
                    <Icon
                      cursor
                      data-e2e='completeProfileCloseModalIcon'
                      name='close'
                      size='20px'
                      color='grey600'
                      role='button'
                      onClick={handleClose}
                    />
                  </CloseIconContainer>
                </TopText>
                <Text size='12px' color='grey600' weight={500} style={{ textAlign: 'center' }}>
                  <FormattedMessage
                    id='modal.complete_profile.note'
                    defaultMessage='Your steps towards owning the future.'
                  />
                </Text>
              </HeaderWrapper>
              <ContentWrapper>
                <Text
                  size='24px'
                  weight={600}
                  color='grey900'
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='scenes.home.banner.complete_your_profile.complete_your_profile'
                    defaultMessage='Complete Your Profile.'
                  />
                </Text>
                <Text
                  size='16px'
                  weight={500}
                  color='grey900'
                  style={{ flex: 1, marginTop: '8px', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='modal.complete_profile.finish_settings'
                    defaultMessage='Finish setting up your Blockchain.com Account and start buying crypto today.'
                  />
                </Text>

                <LinksWrapper>
                  {handholdData.map(({ iconUrl, id, metadata, status, subtitle, title }) => (
                    <LinkItem
                      iconUrl={iconUrl}
                      key={id}
                      metadata={metadata}
                      onClick={() => getOnClick(id)}
                      status={status}
                      subtitle={subtitle}
                      title={title}
                    />
                  ))}
                </LinksWrapper>
              </ContentWrapper>
            </>
          )}
        </Wrapper>
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.COMPLETE_USER_PROFILE, { transition: duration })(
  CompleteProfile
)
