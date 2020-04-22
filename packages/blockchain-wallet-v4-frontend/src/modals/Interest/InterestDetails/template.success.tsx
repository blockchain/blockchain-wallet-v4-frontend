import { Button, Icon, Text } from 'blockchain-info-components'
import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { InterestFormValuesType } from 'data/components/interest/types'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import { selectors } from 'data'
import React, { useState } from 'react'
import styled from 'styled-components'

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
  height: 100%;
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

type ParentProps = {
  handleDepositClick: () => void
  handleSimpleBuyClick: () => void
}

type Props = OwnProps & LinkDispatchPropsType & SuccessStateType & ParentProps

const Success: React.FC<Props> = ({
  coin,
  handleClose,
  handleDepositClick,
  handleSimpleBuyClick,
  supportedCoins
}) => {
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
            <Text color='grey800' size='20px' weight={600}>
              {fiatToString({
                value: 6726.43,
                unit: 'USD'
              })}
            </Text>
          </Container>
          <Container>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.detailsbalance'
                defaultMessage='Your {coin} Balance'
                values={{ coin }}
              />
            </Text>
            <Text color='grey800' size='20px' weight={600}>
              {fiatToString({
                value: 6726.43,
                unit: 'USD'
              })}
            </Text>
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
            onClick={handleSimpleBuyClick}
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
      </Top>

      <Bottom>
        <ButtonContainer>
          <Button nature='empty' data-e2e='borrowCancel' onClick={handleClose}>
            <Text size='16px' weight={600} color='blue600'>
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </Wrapper>
  )
}
export default Success
