import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  Padding,
  Pager,
  SemanticColors
} from '@blockchain-com/constellation'

import { Modal } from 'blockchain-info-components'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { getSlides } from './Earn.models'
import { getRemote } from './Earn.selectors'
import { CloseContainer } from './Earn.styles'
import SlideContainer from './Slide'

const EARN_INTRO_VIEWED = 'earnIntroViewed'

const EarnOnboarding = ({ closeAll }: OwnProps) => {
  const { data } = useRemote(getRemote)
  const [currentStep, setCurrentStep] = useState<number>(0)

  useEffect(() => {
    localStorage.setItem(EARN_INTRO_VIEWED, 'true')
  }, [])

  const handleClose = () => {
    closeAll()
  }

  const { isActiveEligible, isPassiveEligible, isStakingEligible, maxPercentage } = data || {}

  const slides = getSlides({
    isActiveEligible,
    isPassiveEligible,
    isStakingEligible,
    maxPercentage
  })

  return (
    <Modal size='large'>
      <Padding all={1.5}>
        <Flex alignItems='center' flexDirection='column' gap={24}>
          <Flex alignItems='center' flexDirection='column' justifyContent='center' width='fill'>
            <Flex justifyContent='flex-end' width='fill'>
              <CloseContainer>
                <IconCloseCircleV2
                  color={SemanticColors.muted}
                  onClick={handleClose}
                  size='medium'
                />
              </CloseContainer>
            </Flex>
            <SlideContainer {...slides[currentStep]} />
          </Flex>
          <Pager totalPages={slides.length} selectedPage={currentStep} onChange={setCurrentStep} />
          <Button
            as='button'
            onClick={handleClose}
            size='default'
            state='initial'
            text={
              <FormattedMessage defaultMessage='Start earning' id='modals.onboarding.earn.button' />
            }
            type='button'
            variant='primary'
            width='full'
          />
        </Flex>
      </Padding>
    </Modal>
  )
}

type OwnProps = {
  closeAll: () => void
}

export default modalEnhancer(ModalName.EARN_ONBOARDING)(EarnOnboarding)
