import {
  Button,
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { InterestStepMetadata } from 'data/types'
import FiatDisplay from 'components/Display/FiatDisplay'
import moment from 'moment'
import React from 'react'

import {
  Bottom,
  ButtonContainer,
  Container,
  DetailsItemContainer,
  DetailsWrapper,
  LineVector,
  LineVectorDetails,
  Row,
  StatusIconWrapper,
  StatusWrapper,
  Top,
  TopText,
  Wrapper
} from './model'

import { Exchange } from 'core'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'

const AccountSummary: React.FC<Props> = props => {
  const {
    accountBalances,
    coin,
    handleClose,
    handleDepositClick,
    handleSBClick,
    interestActions,
    interestLimits,
    interestRate,
    stepMetadata,
    supportedCoins
  } = props
  const displayName = supportedCoins[coin].displayName
  const account = accountBalances && accountBalances[coin]
  const lockupPeriod = interestLimits[coin].lockUpDuration / 86400

  const availToWithdraw = account && account.balance - account.locked

  const accountBalanceStandard =
    account &&
    Exchange.convertCoinToCoin({
      value: account.balance || 0,
      coin: 'BTC',
      baseToStandard: true
    }).value

  const interestBalanceStandard =
    account &&
    Exchange.convertCoinToCoin({
      value: account.totalInterest || 0,
      coin: 'BTC',
      baseToStandard: true
    }).value
  return (
    <Wrapper>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <Row>
            <Icon
              name='btc-circle-filled'
              color='btc'
              size='24px'
              style={{ marginRight: '16px' }}
            />
            <FormattedMessage
              id='modals.interest.detailstitle'
              defaultMessage='{displayName} Interest Account'
              values={{ displayName }}
            />
          </Row>
          <Icon
            onClick={handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
          />
        </TopText>
        <Row style={{ paddingBottom: '8px' }}>
          <Container>
            <Text
              color='grey600'
              size='14px'
              weight={500}
              style={{ marginBottom: '5px' }}
            >
              <FormattedMessage
                id='modals.interest.detailsbalance'
                defaultMessage='Your {coin} Balance'
                values={{ coin }}
              />
            </Text>
            {account ? (
              <>
                <FiatDisplay
                  color='grey800'
                  size='20px'
                  weight={600}
                  coin={coin}
                >
                  {account.balance}
                </FiatDisplay>
                <Text
                  color='grey600'
                  size='14px'
                  weight={500}
                  style={{ marginTop: '5px' }}
                >
                  {accountBalanceStandard} {coin}
                </Text>
              </>
            ) : (
              <FiatDisplay color='grey800' size='20px' weight={600} coin={coin}>
                0
              </FiatDisplay>
            )}
          </Container>
          <Container>
            <Text
              color='grey600'
              size='14px'
              weight={500}
              style={{ marginBottom: '5px' }}
            >
              <FormattedMessage
                id='modals.interest.totalearned'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            {account ? (
              <>
                <FiatDisplay
                  color='grey800'
                  size='20px'
                  weight={600}
                  coin={coin}
                >
                  {account.totalInterest}
                </FiatDisplay>
                <Text
                  color='grey600'
                  size='14px'
                  weight={500}
                  style={{ marginTop: '5px' }}
                >
                  {interestBalanceStandard} {coin}
                </Text>
              </>
            ) : (
              <FiatDisplay color='grey800' size='20px' weight={600} coin={coin}>
                0
              </FiatDisplay>
            )}
          </Container>
        </Row>
        <LineVector />
        {stepMetadata && stepMetadata.depositSuccess && (
          <>
            <StatusWrapper>
              <StatusIconWrapper color='orange000'>
                <Icon color='orange600' name='timer' size='24px' />
              </StatusIconWrapper>
              <Text
                data-e2e='waitingConfirmation'
                color='grey600'
                size='14px'
                weight={500}
              >
                <FormattedMessage
                  id='modals.interest.deposit.success.confirm'
                  defaultMessage='Waiting on your deposit to be confirmed by the network. Once it has a confirmation and our team has reviewed it, it will be displayed in Interest Account History. No action is required at this time.'
                />
              </Text>
            </StatusWrapper>
            <StatusWrapper>
              <StatusIconWrapper color='grey000'>
                <Icon color='grey600' name='check' size='14px' />
              </StatusIconWrapper>
              <Text color='grey600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.clears'
                  defaultMessage='Once the deposit clears, your balance will update and you’ll start earning interest.'
                />
              </Text>
            </StatusWrapper>
          </>
        )}
        {stepMetadata && stepMetadata.withdrawSuccess && (
          <StatusWrapper>
            <StatusIconWrapper color='orange000'>
              <Icon color='orange600' name='timer' size='24px' />
            </StatusIconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.withdrawal.success'
                defaultMessage='Waiting on your withdrawal to be confirmed by our team. It may take a few moments to show in your Interest Account History. No action is required at this time.'
              />
            </Text>
          </StatusWrapper>
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
              <Text
                color='red600'
                size='14px'
                style={{ marginTop: '8px' }}
                weight={500}
              >
                <FormattedMessage
                  id='modals.interest.deposit.failurereason'
                  defaultMessage='Error: {error}'
                  values={{ error: stepMetadata.error }}
                />
              </Text>
            </div>
          </StatusWrapper>
        )}
        <ButtonContainer>
          <Button
            data-e2e='interestDeposit'
            height='48px'
            nature='primary'
            onClick={handleDepositClick}
            width='192px'
          >
            <Text weight={600} color='white'>
              <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />
            </Text>
          </Button>
          <Button
            data-e2e='interestDeposit'
            height='48px'
            nature='empty'
            onClick={handleSBClick}
            width='192px'
          >
            <Text size='16px' weight={600} color='blue600'>
              <FormattedMessage
                id='buttons.buycoin'
                defaultMessage='Buy {displayName}'
                values={{ displayName }}
              />
            </Text>
          </Button>
        </ButtonContainer>
        <DetailsWrapper>
          <Text color='grey800' weight={600} style={{ marginBottom: '6px' }}>
            <FormattedMessage
              id='modals.interest.summary'
              defaultMessage='Summary'
            />
          </Text>
          <LineVectorDetails />
          {stepMetadata &&
            (stepMetadata.depositSuccess || stepMetadata.withdrawSuccess) && (
              <>
                <DetailsItemContainer>
                  <Text color='grey600' size='14px' weight={500}>
                    <FormattedMessage
                      id='modals.interest.status'
                      defaultMessage='Status'
                    />
                  </Text>
                  <Text
                    data-e2e='statusText'
                    color='orange600'
                    size='14px'
                    weight={500}
                  >
                    <FormattedMessage
                      id='modals.interest.statuspending'
                      defaultMessage='Pending {action}'
                      values={{
                        action: stepMetadata.withdrawSuccess
                          ? 'Withdrawal'
                          : 'Deposit'
                      }}
                    />
                  </Text>
                </DetailsItemContainer>
                <LineVectorDetails />
              </>
            )}
          <DetailsItemContainer>
            <Text
              data-e2e='nextPayment'
              color='grey600'
              size='14px'
              weight={500}
            >
              <FormattedMessage
                id='modals.interest.summary.next'
                defaultMessage='Next interest payment'
              />
            </Text>
            {account ? (
              <Text color='grey600' size='14px' weight={500}>
                {account.balance > 0 ||
                (stepMetadata && stepMetadata.depositSuccess)
                  ? moment()
                      .add(1, 'month')
                      .startOf('month')
                      .format('MMMM D, YYYY')
                  : '---'}
              </Text>
            ) : (
              <Text color='grey600' size='14px' weight={500}>
                --
              </Text>
            )}
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.accrued'
                defaultMessage='Accrued interest this month'
              />
              <TooltipHost id='modals.interest.summary.accrued.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            {account ? (
              <FiatDisplay color='grey600' size='14px' weight={500} coin={coin}>
                {account.pendingInterest}
              </FiatDisplay>
            ) : (
              <Text color='grey600' size='14px' weight={500}>
                --
              </Text>
            )}
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.hold'
                defaultMessage='Initial hold period'
              />
              <TooltipHost id='modals.interest.summary.lock.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            <Text
              data-e2e='holdPeriod'
              color='grey600'
              size='14px'
              weight={500}
            >
              {lockupPeriod === 1 ? (
                <FormattedMessage
                  id='modals.interest.summary.lockup.one'
                  defaultMessage='1 Day'
                  values={{ lockupPeriod }}
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.summary.lockup'
                  defaultMessage='{lockupPeriod} Days'
                  values={{ lockupPeriod }}
                />
              )}
            </Text>
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.rate'
                defaultMessage='Interest rate'
              />
              <TooltipHost id='modals.interest.summary.moreinterestdetails.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            <Text
              data-e2e='interestRate'
              color='grey600'
              size='14px'
              weight={500}
            >
              {interestRate[coin]}%
            </Text>
          </DetailsItemContainer>
        </DetailsWrapper>
      </Top>
      <Bottom>
        <ButtonContainer>
          <Button
            disabled={!account || !availToWithdraw}
            data-e2e='interestWithdraw'
            fullwidth
            height='48px'
            nature='grey800'
            onClick={() => interestActions.showInterestModal('WITHDRAWAL')}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='buttons.withdraw'
                defaultMessage='Withdraw'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </Wrapper>
  )
}

type ParentProps = {
  handleDepositClick: () => void
  handleSBClick: () => void
  stepMetadata: InterestStepMetadata
}

export type Props = OwnProps &
  LinkDispatchPropsType &
  SuccessStateType &
  ParentProps
export default AccountSummary
