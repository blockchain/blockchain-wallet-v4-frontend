import React from 'react'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Image,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { WalletFiatType } from 'blockchain-wallet-v4/src/types'
import {
  BlueCartridge,
  ErrorCartridge,
  OrangeCartridge,
  SuccessCartridge
} from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { UserTierType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '.'
import { ITEMS, TIER_TYPES, TIERS } from './model'

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

const Item = styled.div<{ isClickable?: boolean }>`
  border-top: 1px solid ${props => props.theme.grey000};
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: ${props => (props.isClickable ? 'pointer' : 'auto')};
`

const ContentItem = styled(Item)`
  align-items: center;
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
const HeaderWrapper = styled(FlyoutWrapper)`
  position: fixed;
  max-width: 480px;
  background-color: ${props => props.theme.white};
`
const FooterWrapper = styled(FlyoutWrapper)`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
`
const CartridgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  min-width: 75px;
`
const IconBareWrapper = styled.div`
  span {
    margin-top: -8px;
    margin-right: -8px;
  }
`
const MainContent = styled.div`
  margin-top: 177px;
`
const ItemTitle = styled(Text)`
  color: ${props => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  margin-left: 20px;
`
const ItemSubtitle = styled(Text)`
  color: ${props => props.theme.grey900};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`

type Props = OwnProps & SuccessStateType

const getItemBadgeStatus = (
  tier: number | undefined,
  type: ITEMS,
  isEligible: boolean = false
) => {
  return (tier !== undefined && TIERS[tier][type]) || isEligible ? (
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
  if (tierDetails.state === 'under_review' || tierDetails.state === 'pending') {
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
    <IconBareWrapper>
      <Icon name='chevron-right' size='32px' color='grey400' />
    </IconBareWrapper>
  )
}

const Template: React.FC<Props> = props => {
  const { sddEligible, userData, userTiers } = props

  if (!Array.isArray(userTiers)) {
    return null
  }
  const silverTier = userTiers.find(
    userTier => userTier.index === TIER_TYPES.SILVER
  )
  const goldTier = userTiers.find(
    userTier => userTier.index === TIER_TYPES.GOLD
  )

  const userCurrentTier = path(['tiers', 'current'], userData) as number
  const currentTier: number | undefined =
    userCurrentTier === TIER_TYPES.NONE
      ? userCurrentTier
      : sddEligible && sddEligible.tier === TIER_TYPES.SILVER_PLUS
      ? TIER_TYPES.SILVER_PLUS
      : userCurrentTier
  const isUserGold = currentTier === TIER_TYPES.GOLD
  const isUserVerifiedSilver =
    currentTier === TIER_TYPES.SILVER ||
    isUserGold ||
    currentTier === TIER_TYPES.SILVER_PLUS

  const swapProduct =
    props.productsEligibility &&
    props.productsEligibility.find(pE => pE.product === 'SWAP')
  const simpleBuyProduct =
    props.productsEligibility &&
    props.productsEligibility.find(pE => pE.product === 'SIMPLEBUY')
  const brokerageProduct =
    props.productsEligibility &&
    props.productsEligibility.find(pE => pE.product === 'BROKERAGE')
  const savingsProduct =
    props.productsEligibility &&
    props.productsEligibility.find(pE => pE.product === 'SAVINGS')

  const isGoldInreview =
    goldTier.state === 'under_review' || goldTier.state === 'pending'

  return (
    <Wrapper>
      <HeaderWrapper>
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
      </HeaderWrapper>

      <MainContent>
        <Item
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
            <ItemSubtitle color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='modals.tradinglimits.silver_subheader'
                defaultMessage='Trade up to {amount}/year.'
                values={{
                  amount: fiatToString({
                    value: silverTier.limits.annual,
                    unit: (silverTier.limits.currency ||
                      'USD') as WalletFiatType,
                    digits: 0
                  })
                }}
              />
            </ItemSubtitle>

            <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
              <FormattedMessage
                id='modals.tradinglimits.silver_desc'
                defaultMessage='You’ll need to verify your email address, name, home address and date of birth.'
              />
            </Text>
          </TierDescription>

          {getTierStatus(currentTier, TIER_TYPES.SILVER, silverTier)}
        </Item>

        <Item
          onClick={() =>
            isUserGold || isGoldInreview
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

            <ItemSubtitle color='grey900' size='14px' weight={500}>
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
            </ItemSubtitle>

            <TextGroup inline>
              <Text color='grey600' size='12px' weight={500}>
                <FormattedMessage
                  id='modals.tradinglimits.gold_desc1'
                  defaultMessage='You’ll need to verify your identity by uploading an ID and a selfie.'
                />
              </Text>
              <Text color='grey600' italic size='12px' weight={500}>
                <FormattedMessage
                  id='modals.tradinglimits.gold_desc2'
                  defaultMessage='Requires Silver Tier approval.'
                />
              </Text>
            </TextGroup>
          </TierDescription>

          {getTierStatus(
            currentTier === TIER_TYPES.SILVER_PLUS
              ? TIER_TYPES.SILVER
              : currentTier,
            TIER_TYPES.GOLD,
            goldTier
          )}
        </Item>

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
          {getItemBadgeStatus(currentTier, ITEMS.SWAP, swapProduct?.eligible)}
        </ContentItem>

        <ContentItem>
          <Icon name='USD' color='blue600' size='20px' />
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
          {getItemBadgeStatus(
            currentTier,
            ITEMS.BUY_WITH_A_CARD,
            simpleBuyProduct?.eligible
          )}
        </ContentItem>
        <ContentItem>
          <Icon name='bank-filled' color='blue600' size='20px' />
          <ItemTitle>
            <FormattedMessage
              id='modals.tradinglimits.deposits_and_withdrawals'
              defaultMessage='Deposits & Withdrawals'
            />
          </ItemTitle>
          {getItemBadgeStatus(
            currentTier,
            ITEMS.DEPOSIT_AND_WITHDRAWAL,
            brokerageProduct?.eligible
          )}
        </ContentItem>
        <ContentItem>
          <Icon name='percentage' color='blue600' size='20px' />
          <ItemTitle>
            <FormattedMessage
              id='modals.tradinglimits.earn_interest'
              defaultMessage='Earn Interest'
            />
          </ItemTitle>
          {getItemBadgeStatus(
            currentTier,
            ITEMS.EARN_INTEREST,
            savingsProduct?.eligible
          )}
        </ContentItem>
      </MainContent>

      <FooterWrapper>
        {!isUserGold && !isGoldInreview && (
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
            {isUserVerifiedSilver ? (
              <FormattedMessage
                id='modals.tradinglimits.unlock_gold_tier'
                defaultMessage='Unlock Gold Tier ->'
              />
            ) : (
              <FormattedMessage
                id='buttons.unlock_all'
                defaultMessage='Unlock All  ->'
              />
            )}
          </Button>
        )}
      </FooterWrapper>
    </Wrapper>
  )
}

export default Template
