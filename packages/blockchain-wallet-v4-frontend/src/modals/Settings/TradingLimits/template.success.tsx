import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { WalletFiatType } from '@core/types'
import { Button, Icon, Image, Link, Text, TextGroup } from 'blockchain-info-components'
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

const SILVER_LIMIT = '2000'
const GOLD_LIMIT = '500000'

const TextWrapper = styled(Text)`
  a {
    color: ${(props) => props.theme.blue600};
    text-decoration: none;
  }
`

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
  justify-content: space-between;
  width: 100%;
`
const Item = styled.div<{ isClickable?: boolean }>`
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'auto')};
`
const ContentItem = styled(Item)`
  align-items: center;
  position: relative;
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
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
`
const LinkWrapper = styled.div`
  padding: 0 40px 35px;
`
const FooterWrapper = styled(FlyoutWrapper)`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
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
const TierTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
`
const MainContent = styled.div`
  margin-top: 177px;
`
const ItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  margin-left: 20px;
`
const ItemSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`

type Props = OwnProps & SuccessStateType

const getItemBadgeStatus = (tier: number | undefined, type: ITEMS, isEligible = false) => {
  return (tier !== undefined && TIERS[tier][type]) || isEligible ? (
    <CartridgeWrapper>
      <SuccessCartridge fontSize='12px'>
        <FormattedMessage id='modals.tradinglimits.unlocked' defaultMessage='Unlocked' />
      </SuccessCartridge>
    </CartridgeWrapper>
  ) : (
    <CartridgeWrapper>
      <ErrorCartridge fontSize='12px'>
        <FormattedMessage id='modals.tradinglimits.locked' defaultMessage='Locked' />
      </ErrorCartridge>
    </CartridgeWrapper>
  )
}

const getTierStatus = (
  tier: number | undefined,
  tierType: TIER_TYPES,
  tierDetails: UserTierType,
  isEddQualified: boolean
) => {
  if (tierDetails.state === 'under_review' || tierDetails.state === 'pending') {
    return (
      <StatusCartridge>
        <OrangeCartridge fontSize='12px'>
          <FormattedMessage id='copy.in_review' defaultMessage='In Review' />
        </OrangeCartridge>
      </StatusCartridge>
    )
  }

  if (isEddQualified) {
    return (
      <StatusCartridge>
        <ErrorCartridge fontSize='12px'>
          <FormattedMessage id='modals.tradinglimits.info_needed' defaultMessage='Info Needed' />
        </ErrorCartridge>
      </StatusCartridge>
    )
  }

  if (tier && tier >= tierType) {
    return (
      <div>
        <StatusCartridge>
          <BlueCartridge fontSize='12px'>
            <FormattedMessage id='modals.tradinglimits.approved' defaultMessage='Approved' />
          </BlueCartridge>
        </StatusCartridge>
      </div>
    )
  }

  return (
    <IconBareWrapper>
      <Icon name='chevron-right' size='32px' color='grey400' />
    </IconBareWrapper>
  )
}

const Template: React.FC<Props> = (props) => {
  const { limitsAndDetails } = props

  const { approvedTierLimit: currentTier } = limitsAndDetails

  const isUserGold = currentTier === TIER_TYPES.GOLD
  const isUserVerifiedSilver =
    currentTier === TIER_TYPES.SILVER || isUserGold || currentTier === TIER_TYPES.SILVER_PLUS

  const isGoldInreview = false

  console.log('limitsAndDetails', limitsAndDetails)

  return (
    <Wrapper>
      <HeaderWrapper>
        <IconsContainer>
          <Image width='26px' name='bar-chart' />
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
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '18px' }}>
          <FormattedMessage
            id='modals.limits_and_features.title'
            defaultMessage='Limits & Features'
          />
        </Title>
        <Text
          color='textBlack'
          size='16px'
          weight={500}
          style={{ fontStyle: 'normal', marginTop: '8px' }}
        >
          {isUserVerifiedSilver && (
            <FormattedMessage
              id='modals.limits_and_features.subtitle.silver'
              defaultMessage='Unlock new trading features in your Blockchain.com Wallet by verifying your ID and linked a bank or card.'
            />
          )}
          {isUserGold && (
            <FormattedMessage
              id='modals.limits_and_features.subtitle.gold'
              defaultMessage='You currently have the highest level of Account Limits and features available.'
            />
          )}
        </Text>
      </HeaderWrapper>

      <MainContent>
        <Item
          onClick={() =>
            isUserVerifiedSilver
              ? null
              : props.identityVerificationActions.verifyIdentity({
                  needMoreInfo: false,
                  origin: 'Settings',
                  tier: TIER_TYPES.SILVER
                })
          }
          isClickable={!isUserVerifiedSilver}
          data-e2e={`continueKycTier${TIER_TYPES.SILVER}Btn`}
        >
          <div>
            <Image name='tier-silver' size='32px' />
          </div>
          <TierDescription>
            <TierTitle>
              <FormattedMessage
                id='components.identityverification.tiercard.silver'
                defaultMessage='Silver Level'
              />
            </TierTitle>
            <ItemSubtitle color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='modals.tradinglimits.silver_subheader'
                defaultMessage='Trade up to {amount}/year.'
                values={{
                  amount: fiatToString({
                    digits: 0,
                    unit: 'USD' as WalletFiatType,
                    value: SILVER_LIMIT
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
        </Item>

        <Item
          onClick={() =>
            isUserGold || isGoldInreview
              ? null
              : props.identityVerificationActions.verifyIdentity({
                  needMoreInfo: false,
                  origin: 'Settings',
                  tier: TIER_TYPES.GOLD
                })
          }
          isClickable={!isUserGold}
          data-e2e={`continueKycTier${TIER_TYPES.GOLD}Btn`}
        >
          <div>
            <Image name='tier-gold' size='32px' />
          </div>
          <TierDescription>
            <TierTitle>
              <FormattedMessage
                id='components.identityverification.tiercard.gold'
                defaultMessage='Gold Level'
              />
            </TierTitle>

            <ItemSubtitle color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='modals.tradinglimits.gold_subheader'
                defaultMessage='Earn Rewards & trade up to {amount}/day.'
                values={{
                  amount: fiatToString({
                    digits: 0,
                    unit: 'USD' as WalletFiatType,
                    value: GOLD_LIMIT
                  })
                }}
              />
            </ItemSubtitle>

            {/* <TextGroup inline>
                <Text color='grey600' size='12px' weight={500}>
                  <FormattedMessage
                    id='modals.tradinglimits.gold_desc_high_edd'
                    defaultMessage='Due to the high balance in your account, we need further information for legal reasons.'
                  />
                </Text>
                <Link
                  size='12px'
                  weight={500}
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://support.blockchain.com/hc/en-us/articles/360018080172-Identity-Verification-Overview'
                >
                  <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
                </Link>
              </TextGroup> */}

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
        </Item>

        {/* <LinkWrapper>
            <Link
              onClick={() => {
                props.interestUploadDocumentActions.showModal({
                  origin: 'InterestUploadDocument'
                })
              }}
              style={{ width: '100%' }}
            >
              <Button data-e2e='earnInterestSupplyInformation' fullwidth nature='primary'>
                <FormattedMessage
                  id='scenes.interest.submit_information'
                  defaultMessage='Submit Information'
                />
              </Button>
            </Link>
          </LinkWrapper> */}

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
            <FormattedMessage id='modals.tradinglimits.swap_crypto' defaultMessage='Swap Crypto' />
          </ItemTitle>
          {getItemBadgeStatus(currentTier, ITEMS.SWAP, false)}
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
          {getItemBadgeStatus(currentTier, ITEMS.BUY_WITH_A_CARD, false)}
        </ContentItem>
        <ContentItem>
          <Icon name='bank-filled' color='blue600' size='20px' />
          <ItemTitle>
            <FormattedMessage
              id='modals.tradinglimits.deposits_and_withdrawals'
              defaultMessage='Deposits & Withdrawals'
            />
          </ItemTitle>
          {getItemBadgeStatus(currentTier, ITEMS.DEPOSIT_AND_WITHDRAWAL, false)}
        </ContentItem>
        <ContentItem>
          <Icon name='percentage' color='blue600' size='20px' />
          <ItemTitle>
            <FormattedMessage
              id='modals.tradinglimits.earn_interest'
              defaultMessage='Earn Rewards'
            />
          </ItemTitle>
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
              props.identityVerificationActions.verifyIdentity({
                needMoreInfo: false,
                origin: 'Settings',
                tier: TIER_TYPES.GOLD
              })
            }
          >
            {isUserVerifiedSilver ? (
              <FormattedMessage
                id='modals.tradinglimits.unlock_gold_tier'
                defaultMessage='Unlock Gold Tier ->'
              />
            ) : (
              <FormattedMessage id='buttons.unlock_all' defaultMessage='Unlock All  ->' />
            )}
          </Button>
        )}

        <TextWrapper
          size='12px'
          weight={500}
          color='gray600'
          style={{
            marginBottom: '12px',
            marginTop: '12px'
          }}
        >
          <FormattedMessage
            id='modals.limits_and_features.footer.line1'
            defaultMessage='Transaction limits may apply to certain banks and card issuers.'
          />
        </TextWrapper>

        <TextWrapper
          size='12px'
          weight={500}
          color='gray600'
          style={{
            marginBottom: '12px'
          }}
        >
          <FormattedMessage
            id='modals.limits_and_features.footer.line2'
            defaultMessage='Purchase or deposit limits are determined by many factors, including verification completed on your account, your purchase history, your payment type, and more.'
          />
        </TextWrapper>

        <TextWrapper size='12px' weight={500} color='gray600'>
          <FormattedMessage
            id='modals.limits_and_features.footer.line3'
            defaultMessage='Learn more about Trading Accounts, Limits, and features by visiting our <a>Support Center</a>.'
            values={{
              a: (msg) => (
                <a
                  href='https://support.blockchain.com/hc/en-us/articles/4410561005844'
                  target='_blank'
                  rel='noopener noreferrrer noreferrer'
                >
                  {msg}
                </a>
              )
            }}
          />
        </TextWrapper>
      </FooterWrapper>
    </Wrapper>
  )
}

export default Template
