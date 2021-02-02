import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Props as OwnProps, SuccessStateType } from '.'
import { path } from 'ramda'

import { UserTierType } from 'data/types'
import { WalletFiatType } from 'core/types'
import React from 'react'
import styled from 'styled-components'

import { ITEMS, TIER_TYPES, TIERS } from './model'

import {
  BlueCartridge,
  ErrorCartridge,
  OrangeCartridge,
  SuccessCartridge
} from 'components/Cartridge'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Title = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`
const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`
const ContentItem = styled.div<{ isClickable?: boolean }>`
  border-top: 1px solid ${props => props.theme.grey000};
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: ${props => (props.isClickable ? 'pointer' : 'auto')};
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const TierDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`
const FooterWrapper = styled(FlyoutWrapper)`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`
const CartridgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
`
const ItemTitle = styled(Text)`
  color: ${props => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  margin-left: 20px;
`

type Props = OwnProps & SuccessStateType

const getItemBadgeStatus = (tier: number | undefined, type: ITEMS) => {
  return tier && TIERS[tier][type] ? (
    <CartridgeWrapper>
      <SuccessCartridge fontSize='12px'>
        <FormattedMessage
          id='modals.tradinglimits.unlocked'
          defaultMessage='Unlocked'
        />
      </SuccessCartridge>
    </CartridgeWrapper>
  ) : (
    <CartridgeWrapper>
      <ErrorCartridge fontSize='12px'>
        <FormattedMessage
          id='modals.tradinglimits.locked'
          defaultMessage='Locked'
        />
      </ErrorCartridge>
    </CartridgeWrapper>
  )
}

const getTierStatus = (
  tier: number | undefined,
  tierType: TIER_TYPES,
  tierDetails: UserTierType
) => {
  if (tierDetails.state === 'under_review') {
    return (
      <div>
        <CartridgeWrapper>
          <OrangeCartridge fontSize='12px'>
            <FormattedMessage id='copy.in_review' defaultMessage='In Review' />
          </OrangeCartridge>
        </CartridgeWrapper>
      </div>
    )
  }

  if (tier && tier >= tierType) {
    return (
      <div>
        <CartridgeWrapper>
          <BlueCartridge fontSize='12px'>
            <FormattedMessage
              id='modals.tradinglimits.approved'
              defaultMessage='Approved'
            />
          </BlueCartridge>
        </CartridgeWrapper>
      </div>
    )
  }

  return (
    <div>
      <Icon name='chevron-right' size='32px' color='grey400' />
    </div>
  )
}

const Template: React.FC<Props> = props => {
  const { userTiers, userData, sddEligible } = props

  if (!Array.isArray(userTiers)) {
    return null
  }
  const silverTier = userTiers.find(
    userTier => userTier.index === TIER_TYPES.SILVER
  )
  const goldTier = userTiers.find(
    userTier => userTier.index === TIER_TYPES.GOLD
  )
  const currentTier: number | undefined =
    sddEligible && sddEligible.tier === TIER_TYPES.SILVER_PLUS
      ? TIER_TYPES.SILVER_PLUS
      : path(['tiers', 'current'], userData)
  const isUserGold = currentTier === TIER_TYPES.GOLD
  const isUserVerifiedSilver = currentTier === TIER_TYPES.SILVER || isUserGold

  return (
    <Wrapper>
      <FlyoutWrapper>
        <IconsContainer>
          <Icon
            cursor
            data-e2e='tradingLimitsCloseButton'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </IconsContainer>
        <Title color='grey800' size='24px' weight={600}>
          <FormattedMessage
            id='layouts.wallet.header.tradinglimits'
            defaultMessage='Trading Limits'
          />
        </Title>
        <Text
          color='grey600'
          size='16px'
          weight={500}
          style={{ marginTop: '8px' }}
        >
          <FormattedMessage
            id='modals.tradinglimits.description'
            defaultMessage='Unlock features within your Blockchain.com Wallet. Some features may ask you to verify your identity.'
          />
        </Text>
      </FlyoutWrapper>

      <ContentItem
        onClick={() =>
          isUserVerifiedSilver
            ? null
            : props.identityVerificationActions.verifyIdentity(
                TIER_TYPES.SILVER,
                false
              )
        }
        isClickable={!isUserVerifiedSilver}
        data-e2e={`continueKycTier${TIER_TYPES.SILVER}Btn`}
      >
        <div>
          <Image name='tier-silver' size='32px' />
        </div>
        <TierDescription>
          <Text color='grey900' size='16px' weight={600}>
            <FormattedMessage
              id='components.identityverification.tiercard.silver'
              defaultMessage='Silver Level'
            />
          </Text>
          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              id='modals.tradinglimits.silver_subheader'
              defaultMessage='Trade up to {amount}/year.'
              values={{
                amount: fiatToString({
                  value: silverTier.limits.annual,
                  unit: (silverTier.limits.currency || 'USD') as WalletFiatType,
                  digits: 0
                })
              }}
            />
          </Text>

          <Text color='grey600' size='12px' weight={500}>
            <FormattedMessage
              id='modals.tradinglimits.gold_description'
              defaultMessage='You’ll need to verify your identity by uploading an ID and a selfie. Requires Silver Tier Approval'
            />
          </Text>
        </TierDescription>

        {getTierStatus(currentTier, TIER_TYPES.SILVER, silverTier)}
      </ContentItem>

      <ContentItem
        onClick={() =>
          isUserGold
            ? null
            : props.identityVerificationActions.verifyIdentity(
                TIER_TYPES.GOLD,
                false
              )
        }
        isClickable={!isUserGold}
        data-e2e={`continueKycTier${TIER_TYPES.GOLD}Btn`}
      >
        <div>
          <Image name='tier-gold' size='32px' />
        </div>
        <TierDescription>
          <Text color='grey900' size='16px' weight={600}>
            <FormattedMessage
              id='components.identityverification.tiercard.gold'
              defaultMessage='Gold Level'
            />
          </Text>

          <Text color='grey900' size='14px' weight={500}>
            <FormattedMessage
              id='modals.tradinglimits.gold_subheader'
              defaultMessage='Earn Interest & trade up to {amount}/day.'
              values={{
                amount: fiatToString({
                  value: goldTier.limits.daily,
                  unit: (goldTier.limits.currency || 'USD') as WalletFiatType,
                  digits: 0
                })
              }}
            />
          </Text>

          <Text color='grey600' size='12px' weight={500}>
            <FormattedMessage
              id='modals.tradinglimits.silver_description'
              defaultMessage='Please verify your email address, add your name, home address and date of birth.'
            />
          </Text>
        </TierDescription>

        {getTierStatus(
          currentTier === TIER_TYPES.SILVER_PLUS
            ? TIER_TYPES.SILVER
            : currentTier,
          TIER_TYPES.GOLD,
          goldTier
        )}
      </ContentItem>

      <ContentItem>
        <IconWrapper>
          <Icon name='send' color='blue600' size='20px' />
          <ItemTitle>
            <FormattedMessage
              id='modals.tradinglimits.send_crypto'
              defaultMessage='Send Crypto'
            />
          </ItemTitle>
        </IconWrapper>
        {getItemBadgeStatus(currentTier, ITEMS.SEND)}
      </ContentItem>

      <ContentItem>
        <Icon name='qr-code' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.receive_crypto'
            defaultMessage='Receive Crypto'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.RECEIVE)}
      </ContentItem>
      <ContentItem>
        <Icon name='arrow-switch-thick' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.swap_crypto'
            defaultMessage='Swap Crypto'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.SWAP)}
      </ContentItem>

      <ContentItem>
        <Icon name='usd' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.cash_accounts'
            defaultMessage='Cash Accounts'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.CASH_ACCOUNT)}
      </ContentItem>
      <ContentItem>
        <Icon name='credit-card-sb' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.buy_with_a_card'
            defaultMessage='Buy with a Card'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.BUY_WITH_A_CARD)}
      </ContentItem>
      <ContentItem>
        <Icon name='bank-filled' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.deposits_and_withdrawals'
            defaultMessage='Deposits & Withdrawals'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.DEPOSIT_AND_WITHDRAWAL)}
      </ContentItem>
      <ContentItem>
        <Icon name='percentage' color='blue600' size='20px' />
        <ItemTitle>
          <FormattedMessage
            id='modals.tradinglimits.earn_interest'
            defaultMessage='Earn Interest'
          />
        </ItemTitle>
        {getItemBadgeStatus(currentTier, ITEMS.EARN_INTEREST)}
      </ContentItem>

      <FooterWrapper>
        {!isUserGold && (
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='primary'
            data-e2e='tradingLimitsUnlockAll'
            type='button'
            onClick={() =>
              props.identityVerificationActions.verifyIdentity(2, false)
            }
          >
            <FormattedMessage
              id='buttons.unlock_all'
              defaultMessage='Unlock All  ->'
            />
          </Button>
        )}
      </FooterWrapper>
    </Wrapper>
  )
}

export default Template
