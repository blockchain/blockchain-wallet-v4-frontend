import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import Content from 'components/Flyout/Content'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Analytics, LimitsAndDetails, SettingsLimit } from 'data/types'

import { IconsContainer, Title } from '../../components'
import { Props as OwnProps, SuccessStateType } from '.'
import { SETTINGS_ITEM_PERIOD, SETTINGS_ITEMS } from './model'
import {
  RowItemSubTitle,
  RowItemTitle,
  RowItemWrapper,
  StatusCartridge,
  UpgradeContainer,
  UpgradeRow,
  UpgradeRowWithBorder
} from './styles'

type Props = OwnProps & SuccessStateType

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

const LimitStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const LimitPeriod = styled(RowItemSubTitle)`
  text-align: right;
`

const renderPeriod = (period: SETTINGS_ITEM_PERIOD) => {
  switch (period) {
    case SETTINGS_ITEM_PERIOD.DAY:
      return <FormattedMessage id='modals.tradinglimits.per_day' defaultMessage='Per Day' />
    case SETTINGS_ITEM_PERIOD.MONTH:
      return <FormattedMessage id='modals.tradinglimits.per_month' defaultMessage='Per Month' />
    case SETTINGS_ITEM_PERIOD.YEAR:
      return <FormattedMessage id='modals.tradinglimits.per_year' defaultMessage='Per Year' />

    default:
      return <></>
  }
}

const renderLimit = (limit: SettingsLimit) => {
  const { currency, value } = limit.value

  return (
    <LimitStatusWrapper>
      <RowItemTitle>
        {fiatToString({
          digits: 0,
          showNarrowSymbol: true,
          unit: currency,
          value: convertBaseToStandard('FIAT', value)
        })}
      </RowItemTitle>

      <LimitPeriod>{renderPeriod(limit.period as SETTINGS_ITEM_PERIOD)}</LimitPeriod>
    </LimitStatusWrapper>
  )
}

const renderStatus = (limits: LimitsAndDetails, settingsItem: SETTINGS_ITEMS) => {
  const limit = limits.limits.find((limit) => limit.name === settingsItem)

  if (!limit) {
    return
  }

  if (limit.limit && !limit.limit.value && limit.limit.period) {
    return (
      <Text color='grey900' size='16px' weight={600} style={{ fontStyle: 'normal' }}>
        <FormattedMessage id='modals.tradinglimits.no_limit' defaultMessage='No limit' />
      </Text>
    )
  }

  if (limit.limit?.value) {
    return renderLimit(limit.limit)
  }

  return <Image name='check-empty-blue' size='20px' />
}

const Template: React.FC<Props> = (props) => {
  const { analyticsActions, handleClose, limitsAndDetails, userData } = props
  const userCurrentTier = userData?.tiers?.current ?? 0

  const onCloseModal = useCallback(() => {
    handleClose()

    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_TRADING_LIMITS_DISMISSED,
      properties: {
        tier: userCurrentTier
      }
    })
  }, [analyticsActions, userCurrentTier, handleClose])

  return (
    <Wrapper>
      <HeaderWrapper>
        <IconsContainer>
          <Title color='textBlack'>
            <FormattedMessage
              id='modals.onboarding.upgrade_now.account_limits'
              defaultMessage='Account Limits'
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
        <Title color='textBlack' size='24px' weight={600} style={{ marginTop: '16px' }}>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.success.verified'
            defaultMessage='Verified'
          />
        </Title>
        <Text color='grey600' size='14px' weight={500} style={{ fontStyle: 'normal' }}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.your_current_limits'
            defaultMessage='Your Current Limits & Features'
          />
        </Text>
        <Text color='grey900' size='12px' weight={500} style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='modals.onboarding.upgrade_now.verified_account_description'
            defaultMessage='With a Verified Account, you can now connect your bank or card to your Blockchain.com Account. Hold cash in your Wallet. Earn crypto with Rewards.'
          />
        </Text>
      </HeaderWrapper>

      <Content mode='top'>
        <UpgradeContainer>
          <UpgradeRowWithBorder>
            <Image name='blue-verified' size='20px' />
            <RowItemTitle>
              <FormattedMessage
                id='modals.onboarding.upgrade_now.verified_level'
                defaultMessage='Verified Level'
              />
            </RowItemTitle>
            <StatusCartridge>
              <Text color='grey900' size='12px' weight={500}>
                <FormattedMessage id='copy.active' defaultMessage='Active' />
              </Text>
            </StatusCartridge>
          </UpgradeRowWithBorder>
          <UpgradeRowWithBorder>
            <Image name='send' size='20px' />
            <RowItemWrapper>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.send_and_receive_crypto'
                  defaultMessage='Send & Receive Crypto'
                />
              </RowItemTitle>
              <RowItemSubTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.to_from_trading_accounts'
                  defaultMessage='To & From Trading Accounts'
                />
              </RowItemSubTitle>
            </RowItemWrapper>
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.SEND_CRYPTO)}
          </UpgradeRowWithBorder>
          <UpgradeRowWithBorder>
            <Image name='swap-blue' size='20px' />
            <RowItemWrapper>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.tradinglimits.swap_crypto'
                  defaultMessage='Swap Crypto'
                />
              </RowItemTitle>
              <RowItemSubTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.swap_gold_description'
                  defaultMessage='Between All Accounts'
                />
              </RowItemSubTitle>
            </RowItemWrapper>
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.SWAP_CRYPTO)}
          </UpgradeRowWithBorder>
          <UpgradeRowWithBorder>
            <Image name='buy-blue-circle' size='20px' />
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
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.BUY_AND_SELL)}
          </UpgradeRowWithBorder>
          <UpgradeRowWithBorder>
            <Image name='credit-card-blue' size='20px' />
            <RowItemWrapper>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.tradinglimits.card_purchase'
                  defaultMessage='Card Purchases'
                />
              </RowItemTitle>
              <RowItemSubTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.buying_crypto'
                  defaultMessage='Buying Crypto'
                />
              </RowItemSubTitle>
            </RowItemWrapper>
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.BUY_WITH_CARD)}
          </UpgradeRowWithBorder>
          <UpgradeRowWithBorder>
            <Image name='withdraw-blue-circle' size='20px' />
            <RowItemWrapper>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.tradinglimits.bank_withdrawals'
                  defaultMessage='Bank Withdrawals'
                />
              </RowItemTitle>
              <RowItemSubTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.personal_bank_account'
                  defaultMessage='To Personal Bank Account'
                />
              </RowItemSubTitle>
            </RowItemWrapper>
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.WITHDRAW_WITH_BANK)}
          </UpgradeRowWithBorder>

          <UpgradeRow>
            <Image name='percent-blue-circle' size='20px' />
            <RowItemWrapper>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.rewards_accounts'
                  defaultMessage='Rewards Accounts'
                />
              </RowItemTitle>
              <RowItemSubTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.earn_rewards_on_your_crypto'
                  defaultMessage='Earn Rewards On Your Crypto'
                />
              </RowItemSubTitle>
            </RowItemWrapper>
            {renderStatus(limitsAndDetails, SETTINGS_ITEMS.SAVINGS_INTEREST)}
          </UpgradeRow>
        </UpgradeContainer>
      </Content>
    </Wrapper>
  )
}

export default Template
