import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button as ConstellationButton,
  Flex,
  IconChevronDownV2,
  IconChevronUpV2,
  IconInformation,
  IconTriangleDown,
  IconTriangleUp,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { format } from 'date-fns'

import { Button, Icon, TooltipHost } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { EDDMessageContainer } from '../ActiveRewards.model'
import BalanceDropdown from './AccountSummary.BalanceDropdown.template'
import Detail from './AccountSummary.Detail.template'
import {
  Bottom,
  Container,
  DetailsWrapper,
  StatusIconWrapper,
  StatusWrapper,
  Top,
  TopText,
  WarningContainer,
  Wrapper
} from './AccountSummary.styles'
import { SuccessPropsType } from './AccountSummary.types'

const AccountSummary: React.FC<SuccessPropsType> = ({
  account,
  accountBalanceBase,
  activeRewardsBalanceBase,
  coin,
  currentPrice,
  handleBalanceDropdown,
  handleClose,
  handleCoinToggled,
  handleDepositClick,
  handleEDDSubmitInfo,
  handleTransactionsToggled,
  handleWithdrawal,
  isBalanceDropdownToggled,
  isCoinDisplayed,
  isDepositEnabled,
  isEDDRequired,
  isTransactionsToggled,
  isWithdrawalEnabled,
  pendingTransactions,
  percentChange,
  priceChangeColor,
  priceChangeSymbol,
  rate,
  showSupply,
  stepMetadata,
  totalBondingDeposits,
  triggerPrice,
  walletCurrency
}) => (
  <Wrapper>
    <Top>
      <TopText color='grey800' size='20px' weight={600}>
        <Flex alignItems='center' gap={16}>
          <Icon name={coin} color={coin} size='24px' />
          <Flex flexDirection='column' gap={4}>
            <Text color={SemanticColors.title} variant='body2'>
              <FormattedMessage
                id='modals.active-rewards.detailstitle'
                defaultMessage='{displayName} Active Rewards'
                values={{ displayName: coin }}
              />
            </Text>
            <Flex gap={4}>
              <Text color={SemanticColors.body} variant='paragraph1'>
                {currentPrice}
              </Text>
              <Text color={SemanticColors[priceChangeColor]} variant='paragraph1'>
                {priceChangeSymbol + percentChange}%
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Icon
          onClick={handleClose}
          cursor
          name='close'
          size='20px'
          color='grey600'
          data-e2e='closeInterest'
        />
      </TopText>
      {!showSupply && (
        <>
          <Flex>
            <Container>
              {isBalanceDropdownToggled && (
                <BalanceDropdown
                  activeRewardsBalance={account?.balance || '0'}
                  coin={coin}
                  handleBalanceDropdown={handleBalanceDropdown}
                  handleCoinToggled={handleCoinToggled}
                  isCoinDisplayed={isCoinDisplayed}
                  totalBondingDeposits={totalBondingDeposits}
                  walletCurrency={walletCurrency}
                />
              )}
              <Padding bottom={0.25}>
                <Text color={SemanticColors.body} variant='paragraph1'>
                  <FormattedMessage
                    id='modals.active-rewards.balance'
                    defaultMessage='{coin} Balance'
                    values={{ coin }}
                  />
                </Text>
              </Padding>
              {account ? (
                <>
                  <Flex justifyContent='space-between'>
                    <CoinDisplay coin={coin} color='grey800' size='18px' weight={600}>
                      {accountBalanceBase}
                    </CoinDisplay>
                    {isBalanceDropdownToggled ? (
                      <IconTriangleUp
                        color={PaletteColors['grey-400']}
                        onClick={handleBalanceDropdown}
                        size='large'
                      />
                    ) : (
                      <IconTriangleDown
                        color={PaletteColors['grey-400']}
                        onClick={handleBalanceDropdown}
                        size='large'
                      />
                    )}
                  </Flex>
                  <FiatDisplay
                    color='grey600'
                    size='14px'
                    weight={500}
                    coin={coin}
                    style={{ marginTop: '5px' }}
                  >
                    {account.balance}
                  </FiatDisplay>
                </>
              ) : (
                <Text color={SemanticColors.body} variant='body1'>
                  0 {coin}
                </Text>
              )}
            </Container>
            <Container>
              <Padding bottom={0.25}>
                <Flex alignItems='center' gap={4}>
                  <Text color={SemanticColors.body} variant='paragraph1'>
                    <FormattedMessage
                      id='modals.active-rewards.netearnings'
                      defaultMessage='Net Earnings'
                    />
                  </Text>
                  <TooltipHost id='modals.active-rewards.summary.total-earned.tooltip'>
                    <IconInformation name='info' size='small' color={SemanticColors.muted} />
                  </TooltipHost>
                </Flex>
              </Padding>
              {account ? (
                <>
                  <CoinDisplay coin={coin} color='grey800' size='18px' weight={600}>
                    {activeRewardsBalanceBase}
                  </CoinDisplay>
                  <FiatDisplay
                    color='grey600'
                    size='14px'
                    weight={500}
                    coin={coin}
                    style={{ marginTop: '5px' }}
                  >
                    {activeRewardsBalanceBase}
                  </FiatDisplay>
                </>
              ) : (
                <Text color={SemanticColors.body} variant='paragraph1'>
                  0 {coin}
                </Text>
              )}
            </Container>
          </Flex>
        </>
      )}
      {stepMetadata && stepMetadata.error && (
        <StatusWrapper>
          <StatusIconWrapper color='red000'>
            <Icon color='red600' name='forbidden' size='24px' />
          </StatusIconWrapper>
          <div>
            <Text color={SemanticColors.error} variant='paragraph1'>
              <FormattedMessage
                id='modals.interest.deposit.failure'
                defaultMessage='Something went wrong. Please try again later or contact support if the issue persists.'
              />
            </Text>
            <Padding bottom={0.5}>
              <Text color={SemanticColors.error} variant='paragraph1'>
                <FormattedMessage
                  id='modals.interest.deposit.failurereason'
                  defaultMessage='Error: {error}'
                  values={{ error: stepMetadata.error }}
                />
              </Text>
            </Padding>
          </div>
        </StatusWrapper>
      )}
      <DetailsWrapper>
        <Padding bottom={0.375}>
          <Text color={SemanticColors.title} variant='body2'>
            <FormattedMessage id='modals.interest.summary' defaultMessage='Summary' />
          </Text>
        </Padding>
        <Detail
          text={
            <FormattedMessage
              defaultMessage='Est. annual rate'
              id='modals.active-rewards.accountsummary.annual-rate'
            />
          }
          textTooltipId='modals.active-rewards.summary.annual-rate.tooltip'
          value={`${rate}%`}
        />
        {triggerPrice && (
          <Detail
            text={
              <FormattedMessage
                defaultMessage='Trigger price'
                id='modals.active-rewards.accountsummary.trigger-price'
              />
            }
            textTooltipId='modals.active-rewards.summary.trigger-price.tooltip'
            value={
              <FiatDisplay color='grey900' size='14px' weight={500} coin='USD'>
                {triggerPrice}
              </FiatDisplay>
            }
          />
        )}
        <Detail
          subText={
            <FormattedMessage
              defaultMessage='Payments, subscriptions and withdrawals'
              id='modals.active-rewards.accountsummary.paymentfrequency.subtext'
            />
          }
          subValue={
            <FormattedMessage
              defaultMessage='Fridays at 8:00AM UTC'
              id='modals.active-rewards.accountsummary.paymentfrequency.subvalue'
            />
          }
          text={
            <FormattedMessage
              defaultMessage='Frequency'
              id='modals.active-rewards.accountsummary.paymentfrequency'
            />
          }
          value={
            <FormattedMessage
              defaultMessage='Weekly'
              id='modals.active-rewards.accountsummary.paymentfrequency.weekly'
            />
          }
        />
        {pendingTransactions.length > 0 && (
          <>
            <Detail
              handleClick={handleTransactionsToggled}
              text={
                <FormattedMessage
                  defaultMessage='Transactions in progress ({totalPendingTransactions})'
                  id='modals.active-rewards.accountsummary.transactionsprogress'
                  values={{ totalPendingTransactions: pendingTransactions.length }}
                />
              }
              value={
                isTransactionsToggled ? (
                  <IconChevronUpV2 color={SemanticColors.muted} size='medium' />
                ) : (
                  <IconChevronDownV2 color={SemanticColors.muted} size='medium' />
                )
              }
            />
            {isTransactionsToggled &&
              pendingTransactions.map(({ amount, date }) => {
                return (
                  <Detail
                    key={date}
                    subText={<FormattedMessage defaultMessage='On hold' id='copy.on-hold' />}
                    subTextTooltipId='modals.active-rewards.bonding.pending.tooltip'
                    subValue={
                      <FormattedMessage
                        defaultMessage='Next Friday 08:00AM UTC'
                        id='modals.active-rewards.accountsummary.bondingperiod'
                      />
                    }
                    text={
                      <Flex gap={4}>
                        <FormattedMessage
                          defaultMessage='Added'
                          id='modals.active-rewards.accountsummary.transactions.added'
                        />
                        <CoinDisplay
                          coin={coin}
                          color='grey900'
                          cursor='inherit'
                          size='14px'
                          weight={600}
                          data-e2e={`${coin}BondingDepositAmount`}
                        >
                          {amount}
                        </CoinDisplay>
                      </Flex>
                    }
                    value={format(new Date(date), "h:mm a 'on' MMM d yyyy")}
                  />
                )
              })}
          </>
        )}
        {isEDDRequired && (
          <EDDMessageContainer>
            <Text color={SemanticColors.warning} variant='paragraph2'>
              <FormattedMessage
                id='modals.active-rewards.account-summary.edd_need.title'
                defaultMessage='Additional Information Required'
              />
            </Text>
            <Text color={SemanticColors.title} variant='caption1'>
              <FormattedMessage
                id='modals.active-rewards.account-summary.edd_need.description'
                defaultMessage='You’ve transferred an amount that requires further verification for legal and compliance reasons. {br}{br} Your funds are safe with us and have started accruing interest already. To avoid delays when you decide to withdraw your funds, submit your information now. '
                values={{ br: <br /> }}
              />
            </Text>
            <ConstellationButton
              onClick={handleEDDSubmitInfo}
              size='small'
              text={
                <FormattedMessage
                  defaultMessage='Submit Information'
                  id='scenes.interest.submit_information'
                />
              }
              type='button'
              variant='secondary'
            />
          </EDDMessageContainer>
        )}
      </DetailsWrapper>
    </Top>
    {!showSupply && (
      <Bottom>
        {!isWithdrawalEnabled && (
          <WarningContainer>
            <Text color={SemanticColors.title} variant='paragraph2'>
              <FormattedMessage defaultMessage='Important' id='copy.important' />
            </Text>
            <Text color={SemanticColors.title} variant='caption1'>
              <FormattedMessage
                defaultMessage="Withdrawals for Active Rewards are not yet enabled. Weekly withdrawal functionality is being finalized and will be enabled in approximately end of January 2023. Until then, BTC assets in Active Rewards Accounts will be re-subscribed to each week's strategy."
                id='modals.active-rewards.account-summary.withdrawals-warning'
              />
            </Text>
          </WarningContainer>
        )}
        <Button
          disabled={!isDepositEnabled}
          data-e2e='activeRewardsDeposit'
          fullwidth
          height='48px'
          nature='primary'
          onClick={handleDepositClick}
        >
          <Text color={SemanticColors.background} variant='body2'>
            <FormattedMessage id='buttons.add-balance' defaultMessage='Add balance' />
          </Text>
        </Button>
        {isWithdrawalEnabled && (
          <ConstellationButton
            onClick={handleWithdrawal}
            size='default'
            text={
              <Text color={SemanticColors.background} variant='body2'>
                <FormattedMessage
                  id='buttons.request-withdrawal'
                  defaultMessage='Request Withdrawal'
                />
              </Text>
            }
            variant='secondary'
            width='full'
          />
        )}
      </Bottom>
    )}
  </Wrapper>
)

export default AccountSummary
