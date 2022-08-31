import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Icon, Padding } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'

import { Button, Image } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
// import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, UserDataType } from 'data/types'
import { useFetchUserReferrals } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import {
  CloseIconContainer,
  Description,
  DescriptionWrapper,
  HeaderWrapper,
  ImageWrapper,
  Title
} from './ReferralLandingFlyout.styles'
import { ReferralLandingFlyoutComponent } from './ReferralLandingFlyout.types'

const COWBOYS_2022 = 'COWBOYS_2022'

const ReferralLanding: ReferralLandingFlyoutComponent = ({
  close,
  position,
  total,
  userClickedOutside
}) => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const fetchUserReferrals = useFetchUserReferrals()

  const userTags = useSelector(
    (state: RootState) => state.profile.userData.getOrElse({} as UserDataType)?.tags
  )

  const handleClose = useCallback(async () => {
    setOpen(false)

    await new Promise((resolve) => {
      setTimeout(() => {
        close?.call(ModalName.REFERRAL_LANDING_MODAL)

        setTimeout(resolve, 0)
      }, duration)
    })
  }, [close])

  useEffect(() => {
    // load user referrals
    fetchUserReferrals()
  }, [fetchUserReferrals])

  if (!userTags[COWBOYS_2022]) {
    return null
  }

  return (
    <Flyout
      position={position}
      isOpen={isOpen}
      onClose={handleClose}
      userClickedOutside={userClickedOutside}
      data-e2e='referralLandingFlyout'
      total={total}
    >
      <FlyoutChild>
        <HeaderWrapper>
          <CloseIconContainer onClick={handleClose}>
            <Icon label='close' color='grey600' data-e2e='sendNoFundsCloseModalIcon' size='md'>
              <IconCloseCircleV2 />
            </Icon>
          </CloseIconContainer>
        </HeaderWrapper>

        <FlyoutContent mode='top'>
          <ImageWrapper>
            <Image name='cowboys' size='122px' />
          </ImageWrapper>
          <Padding top={45} left={40} right={40} bottom={8}>
            <Title color='textBlack'>
              <FormattedMessage
                id='modals.referralLanding.title'
                defaultMessage='Refer 3+ friends and you could win Blockchain.com suite tickets'
              />
            </Title>
          </Padding>
          <DescriptionWrapper>
            <Padding top={0} left={40} right={40} bottom={8}>
              <Description>
                <FormattedMessage
                  id='modals.referralLanding.description'
                  defaultMessage="Verify your ID, refer 3+ friends and you'll be entered for a chance to win 8 tickets to the Blockchain.com suite at AT&T Stadium for the December 11th game against the Houston Texans."
                />
              </Description>
            </Padding>
          </DescriptionWrapper>
        </FlyoutContent>

        <FlyoutFooter collapsed>
          <Button
            data-e2e='sendNoFundsReceiveCrypto'
            nature='primary'
            onClick={() => {
              // do nothing atm
            }}
            fullwidth
          >
            <FormattedMessage id='buttons.share' defaultMessage='Share' />
          </Button>
        </FlyoutFooter>
      </FlyoutChild>
    </Flyout>
  )
}

const enhance = ModalEnhancer(ModalName.REFERRAL_LANDING_MODAL, { transition: duration })

export default enhance(ReferralLanding)
