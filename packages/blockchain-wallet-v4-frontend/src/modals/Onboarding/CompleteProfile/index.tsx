import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'

import { COMPLETE_PROFILE_STEPS, ProductTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { custodial, modals } from 'data/actions'
import { buySell, identityVerification } from 'data/components/actions'
import { getVerificationSteps } from 'data/components/identityVerification/selectors'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../components'
import { ModalPropsType } from '../../types'
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

const CompleteProfile = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const dispatch = useDispatch()

  const { isBankOrCardLinked, isKycVerified } = useSelector(getData)

  const { data: handholdData, isLoading, isNotAsked } = useRemote(getVerificationSteps)

  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)

    setTimeout(() => {
      close(ModalName.COMPLETE_USER_PROFILE)
    }, duration)
  }

  const startVerification = () => {
    dispatch(
      identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'CompleteProfile',
        tier: 2
      })
    )
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
    if (isKycVerified) {
      startAddingCards()
    } else {
      startVerification()
    }
  }

  const handleBuyCryptoClick = () => {
    if (isBankOrCardLinked) {
      dispatch(buySell.showModal({ origin: 'CompleteProfile' }))
    } else if (isKycVerified) {
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
    }

    dispatch(modals.closeModal(ModalName.COMPLETE_USER_PROFILE))
  }

  const handleSelfClassification = () => {
    dispatch(modals.showModal(ModalName.SELF_CLASSIFICATION, { origin: 'CompleteProfile' }))
  }

  const handleSelfAssessment = () => {
    dispatch(modals.showModal(ModalName.SELF_ASSESSMENT, { origin: 'CompleteProfile' }))
  }

  const handleEmailVerification = () => {
    dispatch(push('/security-center/basic'))
  }

  const getOnClick = (step: COMPLETE_PROFILE_STEPS) => {
    switch (step) {
      case 'EMAIL_VERIFICATION':
        return handleEmailVerification()
      case 'KYC_VERIFICATION':
        return startVerification()
      case 'SELF_CLASSIFICATION':
        return handleSelfClassification()
      case 'FINPROMS_ASSESSMENT':
        return handleSelfAssessment()
      case 'DEPOSIT_CRYPTO':
        return handleLinkBankOrCardClick()
      case 'BUY_CRYPTO':
        return handleBuyCryptoClick()
      default:
        return startVerification()
    }
  }

  useEffect(() => {
    setShow(true)
    dispatch(identityVerification.fetchVerificationSteps())
    dispatch(buySell.fetchCards(false))
    dispatch(buySell.fetchAccumulatedTrades({ product: ProductTypes.SIMPLEBUY }))
    dispatch(custodial.fetchProductEligibilityForUser())
  }, [])

  if (handholdData === '') {
    dispatch(custodial.fetchProductEligibilityForUser())
    dispatch(modals.closeModal(ModalName.COMPLETE_USER_PROFILE))
    return null
  }

  const itemsLength = handholdData?.items?.length ?? 0
  const completedSteps =
    handholdData?.items?.filter((step) => step.status === 'COMPLETED').length ?? 0

  const percentage = itemsLength > 0 ? (completedSteps / itemsLength) * 100 : 0

  return (
    <Flyout
      total={total}
      position={position}
      userClickedOutside={userClickedOutside}
      isOpen={show}
      onClose={handleClose}
      data-e2e='completeProfileModal'
    >
      <FlyoutChild>
        <Wrapper>
          {(isLoading || isNotAsked) && <Loading text={LoadingTextEnum.LOADING} />}
          {!isLoading && (
            <>
              <HeaderWrapper>
                <TopText color='grey800' size='20px' weight={600}>
                  <ProgressRow>
                    <ProgressWrapper>
                      <CircularProgressBar percentage={percentage} strokeWidth={12}>
                        <Text size='16px' color='blue600' weight={600}>
                          {`${completedSteps}/${itemsLength}`}
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
                  {handholdData?.items.map(({ iconUrl, id, metadata, status, subtitle, title }) => (
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
