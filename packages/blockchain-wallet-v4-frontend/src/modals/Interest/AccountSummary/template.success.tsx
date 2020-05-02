import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import FiatDisplay from 'components/Display/FiatDisplay'

import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`
const Row = styled.div`
  display: flex;
`
const Container = styled(Row)`
  flex-direction: column;
  height: 48px;
  justify-content: space-between;

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.grey000};
    width: 199px;
  }

  &:last-child {
    margin-left: 32px;
  }
`

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
`
const DetailsItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const LineVectorDetails = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.grey000};
  margin: 10px 0;
`
const LineVector = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.grey000};
  margin: 40px 0 8px 0;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  margin-top: 56px;
`
const ButtonContainer = styled.div<{ isOpacityApplied?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
  > button {
    padding: 15px !important;
  }
`

const AccountSummary: React.FC<Props> = props => {
  const {
    coin,
    handleClose,
    handleDepositClick,
    handleSBClick,
    interestActions,
    interestAccountBalance,
    interestRate,
    supportedCoins
  } = props

  const displayName = supportedCoins[coin].displayName
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
              {interestAccountBalance[coin].balance}
            </FiatDisplay>
          </Container>
          <Container>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.totalearned'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            <FiatDisplay
              Text
              color='grey800'
              size='20px'
              weight={600}
              coin={coin}
            >
              {interestAccountBalance[coin].totalInterest}
            </FiatDisplay>
          </Container>
        </Row>
        <LineVector />
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
              {moment()
                .add(1, 'month')
                .startOf('month')
                .format('MMMM D, YYYY')}
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
              {interestAccountBalance[coin].pendingInterest}
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
                id='modals.interest.summary.thirtydays'
                defaultMessage='30 days'
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
              <Link href='#' target='_blank' size='14px' weight={500}>
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
}

export type Props = OwnProps &
  LinkDispatchPropsType &
  SuccessStateType &
  ParentProps

export default AccountSummary
