import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { FlyoutContainer, FlyoutContent } from 'components/Flyout/Layout'
import { Analytics, ModalName } from 'data/types'

import { IconsContainer, Title } from '../../components'
import { TIER_TYPES } from '../../Settings/TradingLimits/model'
import { Props as OwnProps, SuccessStateType } from '.'

const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: column;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`
const RowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  padding-left: 16px;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

const RowItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const RowItemSubTitle = styled(Text)`
  color: ${(props) => props.theme.grey600};
  font-size: 14px;
  padding-left: 16px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

const StatusCartridgeSuccess = styled(SuccessCartridge)`
  display: flex;
  flex-direction: row;
  background: ${SemanticColors.success};
  > span {
    padding: 3px 8px;
  }
`

const UpgradeContainer = styled.div<{ second?: boolean }>`
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 16px 40px;
  ${(props) =>
    props.second &&
    css`
      border: 1px solid ${(props) => props.theme.blue400};
      background-color: ${(props) => props.theme.blue600};
    `}
`

const Disclaimer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
`

const UpgradeRow = styled.div`
  display: flex;
  padding: 16px 24px;
`
const UpgradeRowWithBorder = styled(UpgradeRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
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

const IconsContainerRight = styled(IconsContainer)`
  justify-content: space-between;
`

type Props = OwnProps & SuccessStateType

const Template = (props: Props) => {
  useEffect(() => {
    const userCurrentTier = props.userData?.tiers?.current ?? 0
    props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_VIEWED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [])

  const {
    analyticsActions,
    handleClose,
    identityVerificationActions,
    modalActions,
    products,
    userData,
    userTiers
  } = props
  const userCurrentTier = userData?.tiers?.current ?? 0

  const startVerification = useCallback(() => {
    modalActions.closeModal(ModalName.TRADING_LIMITS_MODAL)
    modalActions.closeModal(ModalName.UPGRADE_NOW_SILVER_MODAL)
    identityVerificationActions.verifyIdentity({
      needMoreInfo: false,
      origin: 'UpgradeNowSilver',
      tier: userCurrentTier === TIER_TYPES.NONE ? TIER_TYPES.GOLD : userCurrentTier
    })
    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_GET_VERIFIED_CTA_CLICKED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [identityVerificationActions, modalActions, analyticsActions, userCurrentTier])

  const onCloseModal = useCallback(() => {
    handleClose()

    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_DISMISSED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [analyticsActions, userCurrentTier, handleClose])

  if (!Array.isArray(userTiers)) {
    return null
  }

  return (
    <FlyoutContainer>
      <HeaderWrapper>
        <IconsContainerRight>
          <Image width='32px' name='blue-verified' />
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
        </IconsContainerRight>
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '10px' }}>
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
            {products?.kycVerification?.enabled && (
              <>
                <UpgradeRow>
                  <Image name='blue-verified' size='20px' />
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
                      id='modals.onboarding.upgrade_now.upgrade_and_unlock'
                      defaultMessage='Upgrade & Unlock'
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
              <Image name='check-empty-white' size='20px' />
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
              <Image name='check-empty-white' size='20px' />
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
    </FlyoutContainer>
  )
}

export default Template
