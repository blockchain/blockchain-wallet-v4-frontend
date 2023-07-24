import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FlyoutContent } from 'components/Flyout/Layout'
import { model } from 'data'
import { Analytics, ModalName } from 'data/types'

import { IconsContainer, Title } from '../../components'
import { Props as OwnProps, SuccessStateType } from '.'
import { TIER_TYPES } from './model'
import {
  Disclaimer,
  RowItemSubTitle,
  RowItemTitle,
  RowItemWrapper,
  StatusCartridgeSuccess,
  UpgradeContainer,
  UpgradeRow,
  UpgradeRowWithBorder
} from './styles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const HeaderWrapper = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.white};
`

type Props = OwnProps & SuccessStateType

const Template: React.FC<Props> = (props) => {
  const { analyticsActions, handleClose, products, userData, userTiers } = props
  const { KYC_STATES } = model.profile
  const userCurrentTier = userData?.tiers?.current ?? 0
  const isUserTierZero = userCurrentTier === TIER_TYPES.NONE
  const isUserRejected = userData?.kycState === KYC_STATES.REJECTED

  const onCloseModal = useCallback(() => {
    handleClose()

    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_DISMISSED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [analyticsActions, userCurrentTier, handleClose])

  const startVerification = useCallback(() => {
    props.modalActions.closeModal(ModalName.TRADING_LIMITS_MODAL)
    props.modalActions.closeModal(ModalName.UPGRADE_NOW_SILVER_MODAL)
    props.identityVerificationActions.verifyIdentity({
      needMoreInfo: false,
      origin: 'Settings',
      tier: 2
    })

    // based on button send diff event
    analyticsActions.trackEvent({
      key: isUserTierZero
        ? Analytics.ONBOARDING_TRADING_LIMITS_GET_BASIC_CTA_CLICKED
        : Analytics.ONBOARDING_TRADING_LIMITS_GET_VERIFIED_CTA_CLICKED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [
    props.identityVerificationActions,
    props.modalActions,
    isUserTierZero,
    analyticsActions,
    userCurrentTier
  ])

  if (!Array.isArray(userTiers)) {
    return null
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <IconsContainer>
          <Title color='textBlack'>
            <FormattedMessage
              id='layouts.wallet.header.tradinglimits'
              defaultMessage='Trading Limits'
            />
          </Title>
          <CloseIconContainer>
            <Icon
              cursor
              data-e2e='tradingLimitsCloseButton'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={onCloseModal}
            />
          </CloseIconContainer>
        </IconsContainer>
        <Image width='32px' name='blue-verified' style={{ marginTop: '8px' }} />
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '18px' }}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.title'
            defaultMessage='Upgrade Your Account.'
          />
        </Title>
        <Title color='textBlack' size='24px' weight={600}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.title_second'
            defaultMessage='Buy, Sell & Swap More Crypto.'
          />
        </Title>
        <Text
          color='grey600'
          size='16px'
          weight={500}
          style={{ fontStyle: 'normal', marginTop: '8px' }}
        >
          <FormattedMessage
            id='modals.onboarding.upgrade_now.description'
            defaultMessage='Verify your identity and unlock access to Buying, Selling, Swapping & Rewards Accounts.'
          />
        </Text>
      </HeaderWrapper>

      <FlyoutContent mode='top'>
        <div>
          <UpgradeContainer>
            {products?.kycVerification?.enabled && !isUserRejected && (
              <>
                <UpgradeRow>
                  <Image name='grey-verified' size='20px' />
                  <RowItemTitle>
                    <FormattedMessage
                      id='modals.onboarding.upgrade_now.full_access'
                      defaultMessage='Full Access'
                    />
                  </RowItemTitle>
                  <StatusCartridgeSuccess>
                    <Text color='white' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.onboarding.upgrade_now.apply_now'
                        defaultMessage='Apply Now'
                      />
                    </Text>
                  </StatusCartridgeSuccess>
                </UpgradeRow>

                <UpgradeRowWithBorder style={{ padding: '25px' }}>
                  <Button
                    fullwidth
                    size='16px'
                    height='48px'
                    nature='primary'
                    data-e2e='upgradeNowUnlockSilverLimits'
                    type='button'
                    onClick={startVerification}
                  >
                    <FormattedMessage
                      id='modals.onboarding.upgrade_now.get_full_access'
                      defaultMessage='Get Full Access'
                    />
                  </Button>
                </UpgradeRowWithBorder>
              </>
            )}

            <UpgradeRowWithBorder>
              <Image name='swap-white' size='20px' />
              <RowItemWrapper>
                <RowItemTitle>
                  <FormattedMessage
                    id='modals.tradinglimits.swap_crypto'
                    defaultMessage='Swap Crypto'
                  />
                </RowItemTitle>

                <RowItemSubTitle>
                  <FormattedMessage
                    id='modals.onboarding.upgrade_now.between_all_wallets_and_accounts'
                    defaultMessage='Between All Wallets & Accounts'
                  />
                </RowItemSubTitle>
              </RowItemWrapper>
              <Image name='check-empty-blue' size='20px' />
            </UpgradeRowWithBorder>

            <UpgradeRowWithBorder>
              <Image name='buy-white-circle' size='20px' />
              <RowItemWrapper>
                <RowItemTitle>
                  <FormattedMessage
                    id='modals.onboarding.upgrade_now.buying_and_selling'
                    defaultMessage='Buying & Selling'
                  />
                </RowItemTitle>
                <RowItemSubTitle>
                  <FormattedMessage
                    id='modals.onboarding.upgrade_now.card_or_banking_methods'
                    defaultMessage='Card or Banking Methods'
                  />
                </RowItemSubTitle>
              </RowItemWrapper>
              <Image name='check-empty-blue' size='20px' />
            </UpgradeRowWithBorder>

            <UpgradeRow>
              <Image name='percent-white-circle' size='20px' />
              <RowItemWrapper>
                <RowItemTitle>
                  <FormattedMessage
                    id='modals.tradinglimits.earn_interest'
                    defaultMessage='Earn Rewards'
                  />
                </RowItemTitle>
                <RowItemSubTitle>
                  <FormattedMessage
                    id='modals.onboarding.upgrade_now.earn_rewards_on_your_crypto'
                    defaultMessage='Earn Rewards On Your Crypto'
                  />
                </RowItemSubTitle>
              </RowItemWrapper>
              <Image name='check-empty-white' size='20px' />
            </UpgradeRow>
          </UpgradeContainer>
          <Disclaimer>
            <RowItemSubTitle>
              <FormattedMessage
                id='modals.onboarding.upgrade_now.disclaimer_full_access'
                defaultMessage='Full Access includes all limited access features'
              />
            </RowItemSubTitle>
          </Disclaimer>
        </div>
      </FlyoutContent>
    </Wrapper>
  )
}

export default Template
