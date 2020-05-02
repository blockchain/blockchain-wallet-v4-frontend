import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'
import Summary from './Summary'

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

const Success: React.FC<Props> = props => {
  const {
    coin,
    handleClose,
    handleDepositClick,
    handleSBClick,
    interestAccountBalance,
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
              id='modals.interest.deposittitle'
              defaultMessage='Deposit {displayName}'
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
        <Summary {...props} />
      </Top>

      <Bottom>
        <ButtonContainer>
          <Button
            data-e2e='borrowCancel'
            fullwidth
            height='48px'
            nature='grey800'
            onClick={handleClose}
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

export default Success
