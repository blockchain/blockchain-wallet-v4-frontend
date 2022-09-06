import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Icon, Padding, useCopyToClipboard } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'
import { compose } from 'redux'

import { Button, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
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

const ReferralLanding: ReferralLandingFlyoutComponent = ({
  close,
  position,
  referralInformation,
  total,
  userClickedOutside
}) => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const [v, copy] = useCopyToClipboard()

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
    if (referralInformation) {
      copy(referralInformation.code)
    }
  }, [copy, referralInformation])

  if (!referralInformation) {
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
          <CloseIconContainer onClick={handleClose} data-e2e='sanctionsInfoCloseModalIcon'>
            <Icon label='close' color='grey600' data-e2e='sendNoFundsCloseModalIcon' size='md'>
              <IconCloseCircleV2 />
            </Icon>
          </CloseIconContainer>
        </HeaderWrapper>

        <FlyoutContent mode='top'>
          {referralInformation?.promotion?.icon?.url && (
            <ImageWrapper>
              <img
                src={referralInformation.promotion.icon.url}
                alt={referralInformation.promotion.title}
              />
            </ImageWrapper>
          )}
          <Padding top={3} left={3} right={3} bottom={0.5}>
            <Title color='textBlack'>{referralInformation.rewardTitle}</Title>
          </Padding>
          <DescriptionWrapper>
            <Padding top={0} left={3} right={3} bottom={0.5}>
              <Description>{referralInformation.rewardSubtitle}</Description>
            </Padding>
          </DescriptionWrapper>

          <Padding top={2} left={3} right={3} bottom={0.5}>
            <Text color='grey400' style={{ textAlign: 'center' }} size='14px'>
              <FormattedMessage
                id='modals.referralLanding.referralCode'
                defaultMessage='Your referral code'
              />
            </Text>
          </Padding>
          <Padding top={0} left={3} right={3} bottom={0.5}>
            <ReferralId>
              <Text
                color='grey900'
                style={{ fontFamily: 'Inter', letterSpacing: '0.4em', textAlign: 'center' }}
                size='24px'
                weight={500}
              >
                {referralInformation.code}
              </Text>
              <Button
                data-e2e='copyReferralNumber'
                nature='white-blue'
                onClick={handleOnClickToCopyText}
              >
                <FormattedMessage id='buttons.copy' defaultMessage='Copy' />
              </Button>
            </ReferralId>
            <Padding top={2} left={3} right={3} bottom={0.5}>
              <Text color='grey400' style={{ textAlign: 'center' }} size='14px'>
                <FormattedMessage
                  id='modals.referralLanding.toQualify'
                  defaultMessage='To qualify, your friends must:'
                />
              </Text>
            </Padding>

            <ReferralItemWrapper>
              <ReferralItems>
                {referralInformation.criteria.map((criteria, index) => (
                  <ReferralItem key={criteria}>
                    <CircleBackground size='24px' color='blue000'>
                      <Text color='blue600' size='16px'>
                        {index + 1}
                      </Text>
                    </CircleBackground>
                    <ReferralItemDescription>
                      <Text color='grey800' size='14px'>
                        {criteria}
                      </Text>
                    </ReferralItemDescription>
                  </ReferralItem>
                ))}
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

const mapStateToProps = (state: RootState) => ({
  referralInformation: selectors.components.referral.getReferralInformation(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.REFERRAL_LANDING_MODAL, { transition: duration }),
  connector
)

export default enhance(ReferralLanding)
