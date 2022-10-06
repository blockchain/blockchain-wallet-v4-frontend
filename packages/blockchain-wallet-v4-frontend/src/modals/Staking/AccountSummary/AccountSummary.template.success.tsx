import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  IconChevronDownV2,
  IconChevronUpV2,
  Padding,
  SemanticColors
} from '@blockchain-com/constellation'
import { format } from 'date-fns'

import { Exchange } from '@core'
import { formatFiat } from '@core/exchange/utils'
import {
  CoinType,
  EarnAccountBalanceResponseType,
  EarnEligibleType,
  FiatType,
  StakingRatesType
} from '@core/types'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { EarnStepMetaData, PendingTransactionType } from 'data/types'

import { EDDMessageContainer } from '../Staking.model'
import { OwnProps as ParentProps } from '.'
import Detail from './AccountSummary.detail.template'
import {
  Bottom,
  Container,
  DetailsWrapper,
  Row,
  StatusIconWrapper,
  StatusSupplyWrapper,
  StatusWrapper,
  Top,
  TopText,
  WarningContainer,
  Wrapper
} from './AccountSummary.model'

const AccountSummary: React.FC<Props> = (props) => {
  const {
    accountBalances,
    coin,
    flagEDDInterestFileUpload,
    handleClose,
    handleDepositClick,
    handleEDDSubmitInfo,
    handleTransactionsToggled,
    handleUpLoadDocumentation,
    handleWithdrawalSupplyInformation,
    isEDDRequired,
    isTransactionsToggled,
    pendingTransactions,
    showSupply,
    stakingEligible,
    stakingRates,
    stepMetadata,
    walletCurrency
  } = props

  const { coinfig } = window.coins[coin]
  const account = accountBalances && accountBalances[coin]
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string

  const accountBalanceBase = account && account.balance
  const stakingBalanceBase = account && account.totalRewards

  const isDepositEnabled = stakingEligible[coin] ? stakingEligible[coin]?.eligible : false
  const { commission, rate } = stakingRates[coin]

  return (
    <Wrapper>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <Row>
            <Icon name={coin} color={coin} size='24px' style={{ marginRight: '16px' }} />
            <FormattedMessage
              id='modals.staking.detailstitle'
              defaultMessage='{displayName} Staking'
              values={{ displayName: coinfig.name }}
            />
          </Row>
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
            <Row>
              <Container>
                <Text color='grey600' size='14px' weight={500} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='modals.staking.balance2'
                    defaultMessage='Staked {coin}'
                    values={{ coin }}
                  />
                </Text>
                {account ? (
                  <>
                    <CoinDisplay coin={coin} color='grey800' size='18px' weight={600}>
                      {accountBalanceBase}
                    </CoinDisplay>
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
                  <Text color='grey800' size='18px' weight={600}>
                    0 {coinfig.displaySymbol}
                  </Text>
                )}
              </Container>
              <Container>
                <Text color='grey600' size='14px' weight={500} style={{ marginBottom: '5px' }}>
                  <FormattedMessage id='modals.staking.totalearned' defaultMessage='Total Earned' />
                </Text>
                {account ? (
                  <>
                    <CoinDisplay coin={coin} color='grey800' size='18px' weight={600}>
                      {stakingBalanceBase}
                    </CoinDisplay>
                    <FiatDisplay
                      color='grey600'
                      size='14px'
                      weight={500}
                      coin={coin}
                      style={{ marginTop: '5px' }}
                    >
                      {stakingBalanceBase}
                    </FiatDisplay>
                  </>
                ) : (
                  <Text color='grey800' size='18px' weight={600}>
                    0 {coinfig.displaySymbol}
                  </Text>
                )}
              </Container>
            </Row>
          </>
        )}
        {stepMetadata && stepMetadata.error && (
          <StatusWrapper>
            <StatusIconWrapper color='red000'>
              <Icon color='red600' name='forbidden' size='24px' />
            </StatusIconWrapper>
            <div>
              <Text color='red600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.failure'
                  defaultMessage='Something went wrong. Please try again later or contact support if the issue persists.'
                />
              </Text>
              <Text color='red600' size='14px' style={{ marginTop: '8px' }} weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.failurereason'
                  defaultMessage='Error: {error}'
                  values={{ error: stepMetadata.error }}
                />
              </Text>
            </div>
          </StatusWrapper>
        )}
        <DetailsWrapper>
          <Text color='grey800' weight={600} style={{ marginBottom: '6px' }}>
            <FormattedMessage id='modals.interest.summary' defaultMessage='Summary' />
          </Text>
          <Detail
            text={
              <FormattedMessage
                defaultMessage='Current rate'
                id='modals.staking.accountsummary.currentrate'
              />
            }
            subText={
              <FormattedMessage
                defaultMessage='Blockchain.com fee'
                id='modals.staking.accountsummary.fee'
              />
            }
            tooltipId='modals.staking.summary.fee.tooltip'
            value={`${rate}%`}
            subValue={`${commission}%`}
          />
          <Detail
            text={
              <FormattedMessage
                defaultMessage='Payment frequency'
                id='modals.staking.accountsummary.paymentfrequency'
              />
            }
            value={<FormattedMessage defaultMessage='Daily' id='copy.daily' />}
          />
          {pendingTransactions.length > 0 && (
            <>
              <Detail
                handleClick={handleTransactionsToggled}
                text={
                  <FormattedMessage
                    defaultMessage='Transactions in progress ({totalPendingTransactions})'
                    id='modals.staking.accountsummary.transactionsprogress'
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
                pendingTransactions.map(({ amount, bondingDays, date, type }) => {
                  const isBonding = type === 'BONDING'

                  return (
                    <Detail
                      key={date}
                      subText={
                        isBonding ? (
                          <FormattedMessage defaultMessage='Bonding' id='copy.bonding' />
                        ) : (
                          <FormattedMessage defaultMessage='Pending' id='copy.pending' />
                        )
                      }
                      subValue={
                        bondingDays ? (
                          <FormattedMessage
                            defaultMessage='Bonding Period: {bondingDays} {days}'
                            id='modals.staking.accountsummary.bondingperiod'
                            values={{
                              bondingDays,
                              days:
                                bondingDays > 1 ? (
                                  <FormattedMessage
                                    defaultMessage='days'
                                    id='modals.staking.warning.content.subtitle.days'
                                  />
                                ) : (
                                  <FormattedMessage
                                    defaultMessage='day'
                                    id='modals.staking.warning.content.subtitle.day'
                                  />
                                )
                            }}
                          />
                        ) : null
                      }
                      text={
                        <Flex gap={4}>
                          {isBonding ? (
                            <FormattedMessage defaultMessage='Stake' id='copy.stake' />
                          ) : (
                            <FormattedMessage defaultMessage='Transfer' id='copy.transfer' />
                          )}
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
                      tooltipId={isBonding ? 'modals.staking.bonding.pending.tooltip' : undefined}
                      value={format(new Date(date), "h:mm a 'on' MMM d yyyy")}
                    />
                  )
                })}
            </>
          )}
          {isEDDRequired && (
            <EDDMessageContainer>
              <Text color='orange700' size='14px' weight={600}>
                <FormattedMessage
                  id='modals.staking.account-summary.edd_need.title'
                  defaultMessage='Additional Information Required'
                />
              </Text>
              <Text color='grey900' size='12px' weight={500}>
                <FormattedMessage
                  id='modals.staking.account-summary.edd_need.description'
                  defaultMessage='You’ve transferred an amount that requires further verification for legal and compliance reasons. {br}{br} Your funds are safe with us and have started accruing interest already. To avoid delays when you decide to withdraw your funds, submit your information now. '
                  values={{ br: <br /> }}
                />
              </Text>
              <Button
                data-e2e='eddInformationSubmitted'
                nature='dark-grey'
                onClick={handleEDDSubmitInfo}
                size='14px'
                width='154px'
              >
                <FormattedMessage
                  defaultMessage='Submit Information'
                  id='scenes.interest.submit_information'
                />
              </Button>
            </EDDMessageContainer>
          )}
        </DetailsWrapper>
      </Top>
      {!showSupply && (
        <Bottom>
          <WarningContainer>
            <Text color='grey900' size='12px' weight={500}>
              <FormattedMessage
                defaultMessage='Once staked, ETH assets can’t be unstaked or transferred for an unknown period of time.'
                id='modals.staking.bottom.warning'
              />
            </Text>
          </WarningContainer>
          <Button
            disabled={!isDepositEnabled}
            data-e2e='stakingDeposit'
            fullwidth
            height='48px'
            nature='primary'
            onClick={handleDepositClick}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='buttons.stake' defaultMessage='Stake' />
            </Text>
          </Button>
          <Button disabled data-e2e='stakingWithdrawal' fullwidth height='48px' nature='grey800'>
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='buttons.unstake' defaultMessage='Unstake' />
            </Text>
          </Button>
        </Bottom>
      )}
    </Wrapper>
  )
}

type OwnProps = {
  accountBalances: EarnAccountBalanceResponseType
  coin: CoinType
  flagEDDInterestFileUpload: boolean
  handleBSClick: (string) => void
  handleDepositClick: () => void
  handleEDDSubmitInfo: () => void
  handleTransactionsToggled: () => void
  handleUpLoadDocumentation: () => void
  handleWithdrawalSupplyInformation: () => void
  isEDDRequired: boolean
  isTransactionsToggled: boolean
  pendingTransactions: Array<PendingTransactionType>
  stakingEligible: EarnEligibleType
  stakingRates: StakingRatesType['rates']
  stepMetadata: EarnStepMetaData
  walletCurrency: FiatType
}

export type Props = OwnProps & ParentProps
export default AccountSummary
