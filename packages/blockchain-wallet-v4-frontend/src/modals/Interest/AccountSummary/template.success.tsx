import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { InterestStepMetadata } from 'data/types'
import FiatDisplay from 'components/Display/FiatDisplay'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

import {
  Bottom,
  ButtonContainer,
  Container,
  DetailsItemContainer,
  DetailsWrapper,
  LineVector,
  LineVectorDetails,
  Row,
  SendStatusWrapper,
  Top,
  TopText,
  ViewStatusButton,
  Wrapper
} from './model'

import { LinkDispatchPropsType, OwnProps, State, SuccessStateType } from '.'

const DetailsBackground = styled.div`
  height: 105px;
  width: 400px;
  margin-top: 16px;
  background-color: ${props => props.theme.grey000};
`

const TextContainer = styled.div`
  padding: 16px;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const AccountSummary: React.FC<Props> = props => {
  const {
    accountBalances,
    coin,
    handleClose,
    handleDepositClick,
    handleSBClick,
    interestActions,
    interestRate,
    showMoreDetails,
    stepMetadata,
    supportedCoins,
    toggleMoreDetails
  } = props
  const displayName = supportedCoins[coin].displayName
  const account = accountBalances[coin]

  const MoreDetails = () => {
    return (
      <DetailsBackground>
        <TextContainer>
          <HeaderContainer>
            <Text
              size='14px'
              weight={600}
              color='grey800'
              style={{ marginBottom: '8px', lineHeight: '1.5' }}
            >
              <FormattedMessage
                id='modals.interest.moredetails.header'
                defaultMessage='Interest Details'
              />
            </Text>
            <Icon
              onClick={() => toggleMoreDetails()}
              cursor
              name='close'
              size='10px'
              color='grey600'
              data-e2e='closeMoreDetails'
            />
          </HeaderContainer>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ lineHeight: '1.5' }}
          >
            <FormattedMessage
              id='modals.interest.moredetails.body'
              defaultMessage='Interest accrues daily and is paid monthly. The interest rate may be periodically adjusted.'
            />
          </Text>
        </TextContainer>
      </DetailsBackground>
    )
  }

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
        <Row>
          <Container>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.detailsbalance'
                defaultMessage='Your {coin} Balance'
                values={{ coin }}
              />
            </Text>
            <FiatDisplay color='grey800' size='20px' weight={600} coin={coin}>
              {account.balance}
            </FiatDisplay>
          </Container>
          <Container>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.totalearned'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            <FiatDisplay color='grey800' size='20px' weight={600} coin={coin}>
              {account.totalInterest}
            </FiatDisplay>
          </Container>
        </Row>
        <LineVector />
        {stepMetadata && stepMetadata.sendSuccess ? (
          <SendStatusWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.success'
                defaultMessage='Your deposit has been sent to your Interest Account. Your balance will update once the transaction is confirmed by the network.  No further action is required.'
                values={{ displayName }}
              />
            </Text>
            <Link
              href={`${supportedCoins[coin].txExplorerBaseUrl}/${stepMetadata.depositTxHash}`}
              target='_blank'
            >
              <ViewStatusButton
                data-e2e='viewDepositStatus'
                nature='empty'
                width='100px'
              >
                <Text color='blue600' size='13px' weight={600}>
                  <FormattedMessage
                    id='buttons.viewstatus'
                    defaultMessage='View Status'
                  />
                </Text>
              </ViewStatusButton>
            </Link>
          </SendStatusWrapper>
        ) : (
          stepMetadata &&
          stepMetadata.error && (
            <SendStatusWrapper>
              <Text color='red600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.failure'
                  defaultMessage='Something went wrong when sending your deposit. Please try again later or contact support if the issue persists.'
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
            </SendStatusWrapper>
          )
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
            data-e2e='borrowCancel'
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
          <Text color='grey900' weight={600} style={{ marginBottom: '6px' }}>
            <FormattedMessage
              id='modals.borrow.summary'
              defaultMessage='Summary'
            />
          </Text>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.next'
                defaultMessage='Next interest payment'
              />
            </Text>
            <Text color='grey600' size='14px' weight={500}>
              {account.balance > 0 || (stepMetadata && stepMetadata.sendSuccess)
                ? moment()
                    .add(1, 'month')
                    .startOf('month')
                    .format('MMMM D, YYYY')
                : '---'}
            </Text>
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
            <FiatDisplay color='grey600' size='14px' weight={500} coin={coin}>
              {account.pendingInterest}
            </FiatDisplay>
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.lock'
                defaultMessage='Lock-up period'
              />
              <TooltipHost id='modals.interest.summary.lock.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.sevendays'
                defaultMessage='7 days'
              />
            </Text>
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.rate'
                defaultMessage='Interest rate'
              />
              {' - '}
              <Link
                size='14px'
                weight={500}
                onClick={() => toggleMoreDetails()}
                data-e2e='openMoreDetails'
              >
                <FormattedMessage
                  id='modals.interest.summary.moredetails'
                  defaultMessage='More details'
                />
              </Link>
            </Text>
            <Text color='grey600' size='14px' weight={500}>
              {interestRate[coin]}%
            </Text>
          </DetailsItemContainer>
          {showMoreDetails && <MoreDetails />}
        </DetailsWrapper>
      </Top>
      <Bottom>
        <ButtonContainer>
          <Button
            data-e2e='borrowCancel'
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
  toggleMoreDetails: () => void
}

export type Props = OwnProps &
  LinkDispatchPropsType &
  SuccessStateType &
  ParentProps &
  State
export default AccountSummary
