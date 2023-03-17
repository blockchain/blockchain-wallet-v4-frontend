import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import styled, { css } from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { ModalName } from 'data/types'

import { IconsContainer, Title } from '../../components'
import { TIER_TYPES } from '../TradingLimits/model'
import { Props as OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const HeaderWrapper = styled(FlyoutWrapper)`
  position: fixed;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
`
const TierTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
`
const MainContent = styled.div`
  margin-top: 222px;
`

const StatusCartridge = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 40px;
  > span {
    padding: 3px 8px;
  }
`

const UpgradeContainer = styled.div<{ second?: boolean }>`
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 40px;
  &:hover {
    background-color: rgba(240, 242, 247, 0.32);
  }
  ${(props) =>
    props.second &&
    css`
      border-bottom: 1px solid ${(props) => props.theme.grey000};
    `}
`
const UpgradeSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 14px;
  font-weight: 500;
  margin: 4px 0 16px 0;
`
const UpgradeDescription = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 12px;
  font-weight: 500;
  margin: 4px 0 16px 0;
  > span {
    color: ${(props) => props.theme.grey600};
  }
`

type Props = OwnProps & SuccessStateType

const Template: React.FC<Props> = (props) => {
  const { earnEDDStatus, identityVerificationActions, modalActions, userData, userTiers } = props
  const startVerification = useCallback(
    (tier: TIER_TYPES) => () => {
      modalActions.closeModal(ModalName.TRADING_LIMITS_MODAL)
      modalActions.closeModal(ModalName.UPGRADE_NOW_MODAL)
      identityVerificationActions.verifyIdentity({
        needMoreInfo: false,
        origin: 'Settings',
        tier
      })
    },
    [identityVerificationActions, modalActions]
  )
  if (!Array.isArray(userTiers)) {
    return null
  }

  const goldTier = userTiers.find((userTier) => userTier.index === TIER_TYPES.GOLD)

  const userCurrentTier = (path(['tiers', 'current'], userData) as number) ?? 0
  const isUserTierZero = userCurrentTier === TIER_TYPES.NONE
  const isUserTierSilver =
    userCurrentTier === TIER_TYPES.SILVER || userCurrentTier === TIER_TYPES.SILVER_PLUS

  const isGoldInReview = goldTier.state === 'under_review' || goldTier.state === 'pending'

  return (
    <Wrapper>
      <HeaderWrapper>
        <IconsContainer>
          <Link onClick={props.handleClose} data-e2e='upgradeNowCloseButton'>
            <Image width='26px' name='arrow-left' />
          </Link>
        </IconsContainer>
        <Title color='textBlack' style={{ marginTop: '18px' }}>
          <FormattedMessage id='scenes.interest.verifyid' defaultMessage='Upgrade Now' />
        </Title>
        <Text
          color='textBlack'
          size='16px'
          weight={500}
          style={{ fontStyle: 'normal', marginTop: '8px' }}
        >
          <FormattedMessage
            id='modals.upgradenow.subtitle'
            defaultMessage='Start buying & selling crypto today.'
          />
        </Text>
      </HeaderWrapper>

      <MainContent>
        {(isUserTierSilver || isUserTierZero) && (
          <UpgradeContainer>
            <Image name='blockchain-gold' size='20px' />
            <TierTitle>
              <FormattedMessage
                id='modals.tradinglimits.upgrade.full_access_limits'
                defaultMessage='Full Access Limits'
              />
            </TierTitle>
            <UpgradeSubtitle>
              <FormattedMessage
                id='modals.tradinglimits.upgrade.tier.silver.description'
                defaultMessage='Verify your ID and link your bank to Buy & Sell Crypto straight from your wallet.'
              />
            </UpgradeSubtitle>
            <UpgradeDescription>
              <FormattedMessage
                id='modals.upgradenow.gold_details'
                defaultMessage='Connect your bank or card to your Blockchain.com Account. Hold cash in your wallet. Earn crypto with Rewards.'
              />
              {` `}
              <span>
                <FormattedMessage
                  id='modals.upgradenow.gold_details_additional'
                  defaultMessage='Includes all Silver limits and features.'
                />
              </span>
            </UpgradeDescription>
            {earnEDDStatus?.eddSubmitted || isGoldInReview ? (
              <StatusCartridge>
                <BlueCartridge fontSize='12px'>
                  <FormattedMessage
                    id='modals.upgradenow.in_manual_review'
                    defaultMessage='In Manual Review'
                  />
                </BlueCartridge>
              </StatusCartridge>
            ) : (
              <Button
                fullwidth
                size='16px'
                height='48px'
                nature='light'
                data-e2e='upgradeNowUnlockGoldLimits'
                type='button'
                onClick={startVerification(TIER_TYPES.GOLD)}
              >
                <FormattedMessage
                  id='modals.upgradenow.unlock_full_access_limits'
                  defaultMessage='Unlock Full Access'
                />
              </Button>
            )}
          </UpgradeContainer>
        )}

        <UpgradeContainer second>
          <Image name='blockchain-silver' size='20px' />
          <TierTitle>
            <FormattedMessage
              id='modals.tradinglimits.upgrade.limited_access_limits'
              defaultMessage='Limited Access Limits'
            />
          </TierTitle>
          <UpgradeSubtitle>
            <FormattedMessage
              id='modals.upgradenow.silver_subtitle'
              defaultMessage='Unlock Trade Accounts and Swap.'
            />
          </UpgradeSubtitle>
          <UpgradeDescription>
            <FormattedMessage
              id='modals.upgradenow.silver_details'
              defaultMessage='Unlock Swap - our in-app exchange.'
            />
          </UpgradeDescription>
          {isUserTierZero && (
            <Button
              fullwidth
              size='16px'
              height='48px'
              nature='primary'
              data-e2e='upgradeNowUnlockSilverLimits'
              type='button'
              onClick={startVerification(TIER_TYPES.SILVER)}
            >
              <FormattedMessage
                id='modals.upgradenow.unlock_silver_limits'
                defaultMessage='Unlock Silver Limits'
              />
            </Button>
          )}
        </UpgradeContainer>
      </MainContent>
    </Wrapper>
  )
}

export default Template
