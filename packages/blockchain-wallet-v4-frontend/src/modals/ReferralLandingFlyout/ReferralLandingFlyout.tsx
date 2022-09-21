import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Padding, useCopyToClipboard } from '@blockchain-com/constellation'
import { compose } from 'redux'

import { Button, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import {
  CircleBackground,
  Description,
  DescriptionWrapper,
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
  hasCowboysTag,
  position,
  referralInformation,
  total,
  userClickedOutside
}) => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const [textCopied, setTextCopied] = useState(false)
  const [textShared, setTextShared] = useState(false)
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

  const handleOnClickShare = useCallback(() => {
    if (referralInformation) {
      copy(referralInformation.code)
      setTextShared(true)
    }
  }, [copy, referralInformation])

  const handleOnClickToCopyText = useCallback(() => {
    if (referralInformation) {
      copy(referralInformation.code)
      setTextCopied(true)
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
        <FlyoutContainer>
          <FlyoutHeader
            position='absolute'
            mode='close'
            data-e2e='ReferralFlyoutCloseModal'
            onClick={handleClose}
          />
          <FlyoutContent mode='middle'>
            <div>
              {hasCowboysTag && (
                <Flex justifyContent='center'>
                  <Padding bottom={1}>
                    <Image name='cowboys' />
                  </Padding>
                </Flex>
              )}
              {!hasCowboysTag && referralInformation?.promotion?.icon?.url && (
                <ImageWrapper>
                  <img
                    src={referralInformation.promotion.icon.url}
                    alt={referralInformation.promotion.title}
                  />
                </ImageWrapper>
              )}
              <Padding horizontal={3} bottom={0.5}>
                <Title color='textBlack'>{referralInformation.rewardTitle}</Title>
              </Padding>
              <DescriptionWrapper>
                <Padding top={0} horizontal={3} bottom={0.5}>
                  <Description>{referralInformation.rewardSubtitle}</Description>
                </Padding>
              </DescriptionWrapper>

              <Padding top={2} horizontal={3} bottom={0.5}>
                <Text color='grey400' style={{ textAlign: 'center' }} size='14px'>
                  <FormattedMessage
                    id='modals.referralLanding.referralCode'
                    defaultMessage='Your referral code'
                  />
                </Text>
              </Padding>
              <Padding top={0} horizontal={3} bottom={0.5}>
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
                    style={{ background: 'transparent' }}
                    onClick={handleOnClickToCopyText}
                  >
                    {textCopied ? (
                      <FormattedMessage id='buttons.copied' defaultMessage='Copied' />
                    ) : (
                      <FormattedMessage id='buttons.copy' defaultMessage='Copy' />
                    )}
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
            </div>
          </FlyoutContent>

          <FlyoutFooter collapsed>
            <Button
              data-e2e='sendNoFundsReceiveCrypto'
              nature='primary'
              onClick={handleOnClickShare}
              fullwidth
            >
              {textShared ? (
                <FormattedMessage id='buttons.copied' defaultMessage='Copied' />
              ) : (
                <FormattedMessage id='buttons.share' defaultMessage='Share' />
              )}
            </Button>
          </FlyoutFooter>
        </FlyoutContainer>
      </FlyoutChild>
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  hasCowboysTag: selectors.modules.profile.getCowboysTag(state).getOrElse(false),
  referralInformation: selectors.components.referral.getReferralInformation(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.REFERRAL_LANDING_MODAL, { transition: duration }),
  connector
)

export default enhance(ReferralLanding)
