import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ModalName } from 'data/modals/types'
import { Analytics, SettingsItem, SettingsLimit } from 'data/types'

import { IconsContainer, Title } from '../../components'
import { Props as OwnProps, SuccessStateType } from '.'
import { SETTINGS_ITEM_PERIOD, SETTINGS_ITEMS, SETTINGS_ITEMS_ICONS, TIER_TYPES } from './model'
import Gold from './template.success.gold'
import Silver from './template.success.silver'

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
const HeaderWrapper = styled(FlyoutWrapper)`
  position: fixed;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
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
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
  }
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
const ItemTitleWrapper = styled(Text)`
  flex-direction: column;
  justify-content: center;
`
const ItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const ItemSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  margin-left: 20px;
  display: flex;
`
const UpgradeContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 24px 40px;
`

const UpgradeSubtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 14px;
  font-weight: 500;
  margin: 4px 0 16px 0;
`
const HeadlineWrapper = styled.div`
  background-color: rgba(240, 242, 247, 0.32);
  padding: 8px 24px 8px 40px;
`
const Headline = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
`

const LimitStatus = styled(Text)`
  color: ${(props) => props.theme.grey600};
  font-size: 16px;
  font-weight: 600;
`

type Props = OwnProps & SuccessStateType

const upgradeWallet = (tier: TIER_TYPES, showUpgradeModal: () => void) => {
  if (tier === TIER_TYPES.GOLD) {
    return
  }

  return (
    <UpgradeContainer>
      <TierTitle>
        {tier === TIER_TYPES.NONE ? (
          <FormattedMessage id='copy.upgrade_your_wallet' defaultMessage='Upgrade Your Wallet' />
        ) : (
          <FormattedMessage
            id='modals.tradinglimits.upgrade.tier.full_access.title'
            defaultMessage='Upgrade to Full Access'
          />
        )}
      </TierTitle>
      <UpgradeSubtitle>
        {tier === TIER_TYPES.NONE ? (
          <FormattedMessage
            id='modals.tradinglimits.upgrade.tier.zero.description'
            defaultMessage='Blockchain.com offers two types of Account Limits, each designed to suit your crypto goals and needs.'
          />
        ) : (
          <FormattedMessage
            id='modals.tradinglimits.upgrade.tier.silver.description'
            defaultMessage='Verify your ID and link your bank to Buy & Sell Crypto straight from your wallet.'
          />
        )}
      </UpgradeSubtitle>
      <Button
        fullwidth
        size='16px'
        height='48px'
        nature='primary'
        data-e2e='tradingLimitsUnlockAll'
        type='button'
        onClick={showUpgradeModal}
      >
        {tier === TIER_TYPES.NONE ? (
          <FormattedMessage id='modals.send.banner.get_started' defaultMessage='Get Started' />
        ) : (
          <FormattedMessage id='scenes.borrow.verifyid' defaultMessage='Upgrade Now' />
        )}
      </Button>
    </UpgradeContainer>
  )
}

const renderLabelSubtitle = (name: SETTINGS_ITEMS) => {
  switch (name) {
    case SETTINGS_ITEMS.SEND_CRYPTO:
      return (
        <ItemSubtitle>
          <FormattedMessage
            id='modals.tradinglimits.from_trading_account'
            defaultMessage='from Trading Accounts'
          />
        </ItemSubtitle>
      )
    case SETTINGS_ITEMS.RECEIVE_CRYPTO:
      return (
        <ItemSubtitle>
          <FormattedMessage
            id='modals.tradinglimits.to_trading_account'
            defaultMessage='to Trading Accounts'
          />
        </ItemSubtitle>
      )

    default:
      return <></>
  }
}
const renderPeriod = (period: SETTINGS_ITEM_PERIOD) => {
  switch (period) {
    case SETTINGS_ITEM_PERIOD.DAY:
      return <FormattedMessage id='modals.tradinglimits.a_day' defaultMessage='a Day' />
    case SETTINGS_ITEM_PERIOD.MONTH:
      return <FormattedMessage id='modals.tradinglimits.a_month' defaultMessage='a Month' />
    case SETTINGS_ITEM_PERIOD.YEAR:
      return <FormattedMessage id='modals.tradinglimits.a_year' defaultMessage='a Year' />

    default:
      return <></>
  }
}

const renderLimit = (limit: SettingsLimit) => {
  const { currency, value } = limit.value

  return (
    <LimitStatus>
      {fiatToString({
        digits: 0,
        unit: currency,
        value: convertBaseToStandard('FIAT', value)
      })}
      {` `}
      {renderPeriod(limit.period as SETTINGS_ITEM_PERIOD)}
    </LimitStatus>
  )
}

const renderLabel = (name: SETTINGS_ITEMS) => {
  switch (name) {
    case SETTINGS_ITEMS.SEND_CRYPTO:
      return <FormattedMessage id='modals.tradinglimits.send_crypto' defaultMessage='Send Crypto' />
    case SETTINGS_ITEMS.RECEIVE_CRYPTO:
      return (
        <FormattedMessage
          id='modals.requestcrypto.coinselect.title'
          defaultMessage='Receive Crypto'
        />
      )
    case SETTINGS_ITEMS.SWAP_CRYPTO:
      return <FormattedMessage id='modals.tradinglimits.swap_crypto' defaultMessage='Swap Crypto' />
    case SETTINGS_ITEMS.BUY_AND_SELL:
      return <FormattedMessage id='buttons.buy_sell' defaultMessage='Buy & Sell' />
    case SETTINGS_ITEMS.BUY_WITH_CARD:
      return (
        <FormattedMessage id='modals.tradinglimits.card_purchase' defaultMessage='Card Purchases' />
      )
    case SETTINGS_ITEMS.BUY_AND_DEPOSIT_WITH_BANK:
      return (
        <FormattedMessage
          id='modals.tradinglimits.bank_buy_and_deposit'
          defaultMessage='Bank Buys / Deposits'
        />
      )
    case SETTINGS_ITEMS.WITHDRAW_WITH_BANK:
      return (
        <FormattedMessage
          id='modals.tradinglimits.bank_withdrawals'
          defaultMessage='Bank Withdrawals'
        />
      )
    case SETTINGS_ITEMS.SAVINGS_INTEREST:
      return (
        <FormattedMessage id='modals.tradinglimits.earn_interest' defaultMessage='Earn Rewards' />
      )

    default:
      return <></>
  }
}

const renderStatus = (limit: SettingsItem) => {
  if (!limit.enabled) {
    return (
      <LimitStatus>
        <FormattedMessage
          id='scenes.security.advanced.secondpassword.disabled'
          defaultMessage='Disabled'
        />
      </LimitStatus>
    )
  }

  if (limit.limit?.value) {
    return renderLimit(limit.limit)
  }

  return (
    <LimitStatus>
      <FormattedMessage
        id='scenes.security.advanced.secondpassword.enabled'
        defaultMessage='Enabled'
      />
    </LimitStatus>
  )
}

const Template: React.FC<Props> = (props) => {
  const { analyticsActions, limitsAndDetails, modalActions, userData, userTiers } = props
  const userCurrentTier = userData?.tiers?.current ?? 0
  useEffect(() => {
    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_VIEWED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [])

  const showUpgradeModal = useCallback(() => {
    modalActions.showModal(ModalName.UPGRADE_NOW_MODAL, {
      origin: 'TradingLimits'
    })
  }, [modalActions])

  if (!Array.isArray(userTiers)) {
    return null
  }

  const isUserTierZero = userCurrentTier === TIER_TYPES.NONE
  const isUserGold = userCurrentTier === TIER_TYPES.GOLD
  const isUserTierSilver =
    userCurrentTier === TIER_TYPES.SILVER || userCurrentTier === TIER_TYPES.SILVER_PLUS

  // show silver/silver+ settings
  if (isUserTierSilver || isUserTierZero) {
    return <Silver {...props} />
  }
  // show gold settings
  if (isUserGold) {
    return <Gold {...props} />
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <IconsContainer>
          <Image width='26px' name='bar-chart' />
          <CloseIconContainer>
            <Icon
              cursor
              data-e2e='tradingLimitsCloseButton'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={props.handleClose}
            />
          </CloseIconContainer>
        </IconsContainer>
        <Title color='textBlack' style={{ marginTop: '18px' }}>
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
          {isUserTierZero && (
            <FormattedMessage
              id='modals.tradinglimits.upgrade.unlock_tier_zero'
              defaultMessage='Unlock new trading features in your Blockchain.com Account by verifying your ID and link a bank or card.'
            />
          )}
          {isUserTierSilver && (
            <FormattedMessage
              id='modals.limits_and_features.subtitle.silver'
              defaultMessage='Unlock new trading features in your Blockchain.com Account by verifying your ID and linked a bank or card.'
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
        {upgradeWallet(userCurrentTier, showUpgradeModal)}

        <HeadlineWrapper>
          <Headline>
            <FormattedMessage
              id='modals.tradinglimits.your_limits'
              defaultMessage='Your Limits & Features'
            />
          </Headline>
        </HeadlineWrapper>

        {isUserTierSilver && (
          <ContentItem>
            <IconWrapper>
              <Image name='blockchain-silver' size='20px' />
              <ItemTitleWrapper>
                <ItemTitle>
                  <FormattedMessage
                    id='modals.tradinglimits.upgrade.limited_access_limits'
                    defaultMessage='Limited Access Limits'
                  />
                </ItemTitle>
              </ItemTitleWrapper>
            </IconWrapper>
            <StatusCartridge>
              <SuccessCartridge fontSize='14px'>
                <FormattedMessage id='modals.tradinglimits.approved' defaultMessage='Approved' />
              </SuccessCartridge>
            </StatusCartridge>
          </ContentItem>
        )}

        {isUserGold && (
          <ContentItem>
            <IconWrapper>
              <Image name='blockchain-gold' size='20px' />
              <ItemTitleWrapper>
                <ItemTitle>
                  <FormattedMessage
                    id='modals.tradinglimits.upgrade.full_access_limits'
                    defaultMessage='Full Access Limits'
                  />
                </ItemTitle>
                <ItemSubtitle>
                  <FormattedMessage
                    id='modals.tradinglimits.upgrade.include_silver_limits'
                    defaultMessage='Includes Silver Features'
                  />
                </ItemSubtitle>
              </ItemTitleWrapper>
            </IconWrapper>
            <StatusCartridge>
              <SuccessCartridge fontSize='14px'>
                <FormattedMessage id='modals.tradinglimits.approved' defaultMessage='Approved' />
              </SuccessCartridge>
            </StatusCartridge>
          </ContentItem>
        )}

        {limitsAndDetails?.limits.length > 0 &&
          limitsAndDetails.limits.map((limit) => (
            <ContentItem key={limit.name}>
              <IconWrapper>
                <Image name={SETTINGS_ITEMS_ICONS[limit.name]} size='20px' />
                <ItemTitleWrapper>
                  <ItemTitle>{renderLabel(limit.name as SETTINGS_ITEMS)}</ItemTitle>
                  {renderLabelSubtitle(limit.name as SETTINGS_ITEMS)}
                </ItemTitleWrapper>
              </IconWrapper>
              {renderStatus(limit)}
            </ContentItem>
          ))}
      </MainContent>

      <FooterWrapper>
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
