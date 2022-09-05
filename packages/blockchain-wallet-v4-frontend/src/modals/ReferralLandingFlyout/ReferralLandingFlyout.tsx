import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import {
  IconCloseCircleV2,
  Padding,
  PaletteColors,
  useCopyToClipboard
} from '@blockchain-com/constellation'

import { Button, Image, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { RootState } from 'data/rootReducer'
import { ModalName, UserDataType } from 'data/types'
import { useFetchUserReferrals } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import {
  CircleBackground,
  CloseIconContainer,
  Description,
  DescriptionWrapper,
  HeaderWrapper,
  ImageWrapper,
  ReferralId,
  ReferralItem,
  ReferralItemDescription,
  ReferralItems,
  ReferralItemWrapper,
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
  const [v, copy] = useCopyToClipboard()

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

  const handleOnClickToCopyText = useCallback(() => {
    copy('12345678')
  }, [copy])

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
            <IconCloseCircleV2
              label='close'
              color={PaletteColors['grey-600']}
              data-e2e='sendNoFundsCloseModalIcon'
              size='medium'
            />
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

          <Padding top={32} left={40} right={40} bottom={8}>
            <Text color='grey400' style={{ textAlign: 'center' }} size='14px'>
              <FormattedMessage
                id='modals.referralLanding.referralCode'
                defaultMessage='Your referral code'
              />
            </Text>
          </Padding>
          <Padding top={0} left={40} right={40} bottom={8}>
            <ReferralId>
              <Text
                color='grey900'
                style={{ fontFamily: 'Inter', letterSpacing: '0.4em', textAlign: 'center' }}
                size='24px'
                weight={500}
              >
                12345678
              </Text>
              <Button
                data-e2e='copyReferralNumber'
                nature='white-blue'
                onClick={handleOnClickToCopyText}
              >
                <FormattedMessage id='buttons.copy' defaultMessage='Copy' />
              </Button>
            </ReferralId>
            <Padding top={16} left={40} right={40} bottom={8}>
              <Text color='grey400' style={{ textAlign: 'center' }} size='14px'>
                <FormattedMessage
                  id='modals.referralLanding.toQualify'
                  defaultMessage='To qualify, your friends must:'
                />
              </Text>
            </Padding>

            <ReferralItemWrapper>
              <ReferralItems>
                <ReferralItem>
                  <CircleBackground size='24px' color='blue000'>
                    <Text color='blue600' size='16px'>
                      1
                    </Text>
                  </CircleBackground>
                  <ReferralItemDescription>
                    <Text color='grey800' style={{ textAlign: 'center' }} size='14px'>
                      <FormattedMessage
                        id='modals.referralLanding.signUpUsingCode'
                        defaultMessage='Sign up using your code'
                      />
                    </Text>
                  </ReferralItemDescription>
                </ReferralItem>
                <ReferralItem>
                  <CircleBackground size='24px' color='blue000'>
                    <Text color='blue600' size='16px'>
                      2
                    </Text>
                  </CircleBackground>
                  <ReferralItemDescription>
                    <Text color='grey800' style={{ textAlign: 'center' }} size='14px'>
                      <FormattedMessage
                        id='modals.referralLanding.verifyIdentity'
                        defaultMessage='Verify their identity'
                      />
                    </Text>
                  </ReferralItemDescription>
                </ReferralItem>
                <ReferralItem>
                  <CircleBackground size='24px' color='blue000'>
                    <Text color='blue600' size='16px'>
                      3
                    </Text>
                  </CircleBackground>
                  <ReferralItemDescription>
                    <Text color='grey800' style={{ textAlign: 'center' }} size='14px'>
                      <FormattedMessage
                        id='modals.referralLanding.buy20'
                        defaultMessage='Buy $20+ of crypto'
                      />
                    </Text>
                  </ReferralItemDescription>
                </ReferralItem>
              </ReferralItems>
            </ReferralItemWrapper>
          </Padding>
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
