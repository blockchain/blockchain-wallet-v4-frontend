import React from 'react'
import { FormattedMessage } from 'react-intl'

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
import { EarnStepMetaData } from 'data/types'

import { OwnProps } from '.'
import Detail from './AccountSummary.detail.template'
import {
  Bottom,
  Container,
  DetailsItemContainer,
  DetailsWrapper,
  LineVectorDetails,
  LinkWrapper,
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
    handleUpLoadDocumentation,
    handleWithdrawalSupplyInformation,
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
        {showSupply &&
          stepMetadata &&
          (stepMetadata.withdrawSuccess || stepMetadata.depositSuccess) && (
            <StatusSupplyWrapper className={flagEDDInterestFileUpload ? 'new' : 'old'}>
              <Text color='grey900' size='16px' weight={600}>
                <FormattedMessage
                  id='modals.interest.withdrawal.supply_information_title'
                  defaultMessage='More Info Needed'
                />
              </Text>
              <Text color='grey600' size='12px' weight={500} style={{ marginTop: '16px' }}>
                {stepMetadata.withdrawSuccess ? (
                  flagEDDInterestFileUpload ? (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_1_new'
                      defaultMessage='Your recent withdrawal of {amount} requires further verification for legal and compliance reasons.'
                      values={{
                        amount: `${currencySymbol}${formatFiat(stepMetadata.withdrawalAmount)}`
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_1'
                      defaultMessage="You've requested a withdrawal for an amount that requires further verification for legal and compliance reasons."
                    />
                  )
                ) : (
                  <FormattedMessage
                    id='modals.interest.deposit.supply_information_description_1'
                    defaultMessage="You've transferred an amount that requires further verification for legal and compliance reasons."
                  />
                )}
              </Text>
              <Text color='grey600' size='12px' weight={500} style={{ marginTop: '16px' }}>
                {stepMetadata.withdrawSuccess ? (
                  flagEDDInterestFileUpload ? (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_2_new'
                      defaultMessage='Please submit the additional information so we can start processing your withdrawal.'
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_2'
                      defaultMessage="You've requested a withdrawal for an amount that requires further verification for legal and compliance reasons."
                    />
                  )
                ) : (
                  <FormattedMessage
                    id='modals.interest.deposit.supply_information_description_2'
                    defaultMessage='Your funds are safe with us and have started accruing rewards already. To avoid delays when you decide to withdraw your funds, submit your information now.'
                  />
                )}
              </Text>

              <LinkWrapper>
                {flagEDDInterestFileUpload ? (
                  <Button
                    data-e2e='earnInterestSupplyMoreInformation'
                    fullwidth
                    nature='primary'
                    onClick={handleUpLoadDocumentation}
                  >
                    <FormattedMessage
                      id='scenes.interest.submit_information'
                      defaultMessage='Submit Information'
                    />
                  </Button>
                ) : (
                  <Link
                    href='https://share.hsforms.com/1DS4i94fURdutr8OXYOxfrg2qt44'
                    style={{ width: '100%' }}
                    target='_blank'
                  >
                    <Button
                      data-e2e='earnStakingSupplyMoreInformation'
                      fullwidth
                      nature='primary'
                      onClick={handleWithdrawalSupplyInformation}
                    >
                      <FormattedMessage
                        id='scenes.interest.submit_information'
                        defaultMessage='Submit Information'
                      />
                    </Button>
                  </Link>
                )}
              </LinkWrapper>
            </StatusSupplyWrapper>
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
          {stepMetadata && (stepMetadata.depositSuccess || stepMetadata.withdrawSuccess) && (
            <>
              <DetailsItemContainer>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedMessage id='modals.interest.status' defaultMessage='Status' />
                </Text>
                <Text data-e2e='statusText' color='orange600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.interest.statuspending'
                    defaultMessage='Pending {action}'
                    values={{
                      action: stepMetadata.withdrawSuccess ? 'Withdrawal' : 'Transfer'
                    }}
                  />
                </Text>
              </DetailsItemContainer>
              <LineVectorDetails />
            </>
          )}
          <Detail
            text={
              <FormattedMessage
                defaultMessage='Current rate'
                id='staking.modals.accountsummary.currentrate'
              />
            }
            subText={
              <FormattedMessage
                defaultMessage='Blockchain.com fee'
                id='staking.modals.accountsummary.fee'
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
                id='staking.modals.accountsummary.paymentfrequency'
              />
            }
            value={<FormattedMessage defaultMessage='Daily' id='copy.daily' />}
          />
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

type ParentProps = {
  accountBalances: EarnAccountBalanceResponseType
  coin: CoinType
  flagEDDInterestFileUpload: boolean
  handleBSClick: (string) => void
  handleDepositClick: () => void
  handleUpLoadDocumentation: () => void
  handleWithdrawalSupplyInformation: () => void
  stakingEligible: EarnEligibleType
  stakingRates: StakingRatesType['rates']
  stepMetadata: EarnStepMetaData
  walletCurrency: FiatType
}

export type Props = OwnProps & ParentProps
export default AccountSummary
