import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import {
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { OfferType } from 'core/types'
import { Props } from '../template.success'
import CollateralizationBar from '../CollateralizationBar'
import CollateralWarning from '../CollateralWarning'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

const Wrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 64px;
`
const Item = styled.div`
  margin-bottom: 24px;
  display: flex;
`
const IconWrapper = styled.div<{ bgColor?: keyof DefaultTheme }>`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 20px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.bgColor ? props.theme[props.bgColor] : props.theme.grey000};
`

const AmountsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  > div {
    width: 50%;
  }
`
const AmountsHeader = styled(Text)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${props => props.theme.grey600};
`

const Info: React.FC<Props & { offer: OfferType }> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].currency].displayName
  const collateralSatoshi = Exchange.convertBtcToBtc({
    value: Number(props.loan.collateral.amounts[0].amount),
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value

  switch (props.loan.status) {
    case 'PENDING_COLLATERAL_DEPOSIT':
    case 'PENDING_EXECUTION': {
      return (
        <Wrapper>
          <Item>
            <IconWrapper bgColor='green600'>
              <Icon name='check' size='12px' color='white' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.details.newloan.created'
                defaultMessage='Loan has been created. Once your {symbol} deposit has been confirmed you will receive the loan amount in your wallet.'
                values={{ symbol: props.loan.collateral.amounts[0].currency }}
              />
            </Text>
          </Item>
          <Item>
            <IconWrapper>
              <Icon name='timer' size='18px' color='grey600' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.details.newloan.waiting'
                defaultMessage="Waiting on your deposit to be confirmed by the network. You don't need to take any action at this point."
              />
            </Text>
          </Item>
          <Item>
            <IconWrapper>
              <Icon name='wallet' size='18px' color='grey600' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.details.newloan.receive'
                defaultMessage='You will receive {value} {symbol} to your Blockchain Wallet once we’ve received your deposit.'
                values={{
                  value: props.loan.principal.amount[0].amount,
                  symbol: principalDisplayName
                }}
              />
            </Text>
          </Item>
        </Wrapper>
      )
    }
    case 'PENDING_CLOSE':
      return (
        <Wrapper>
          <Item>
            <IconWrapper bgColor='orange600'>
              <Icon name='timer' size='18px' color='white' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.details.info.repayment'
                defaultMessage='Repayment of your loan is in-progress and is being reviewed by our team.'
              />
            </Text>
          </Item>
          <Item>
            <IconWrapper>
              <Icon name='wallet' size='18px' color='grey600' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.details.info.clearance'
                defaultMessage='Once your principal deposit is cleared by the network and our team, you will receive your collateral.'
              />
            </Text>
          </Item>
        </Wrapper>
      )
    default:
      return (
        <>
          <AmountsContainer>
            <div>
              <AmountsHeader>
                <FormattedMessage
                  id='scenes.borrow.details.info.amount'
                  defaultMessage='Borrow Amount'
                />
              </AmountsHeader>
              <Text color='grey800' size='20px' weight={600}>
                {props.loan.principal.amount[0].amount} {principalDisplayName}
              </Text>
            </div>
            <div>
              <AmountsHeader>
                <FormattedMessage
                  id='scenes.borrow.details.info.collateral'
                  defaultMessage='Collateral Value'
                />
              </AmountsHeader>
              <FiatDisplay
                color='grey800'
                size='20px'
                weight={600}
                currency='USD'
                coin={props.loan.collateral.amounts[0].currency}
              >
                {collateralSatoshi}
              </FiatDisplay>
            </div>
          </AmountsContainer>
          {props.loan.financials && (
            <AmountsContainer>
              <div>
                <AmountsHeader>
                  <FormattedMessage
                    id='scenes.borrow.details.info.outstanding'
                    defaultMessage='Outstanding'
                  />
                  <TooltipHost id='borrow.interest.tooltip'>
                    <TooltipIcon name='info' size='14px' />
                  </TooltipHost>
                </AmountsHeader>
                <Text
                  color='grey800'
                  size='14px'
                  weight={600}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {props.loan.financials.owedInterest[0] &&
                  props.loan.financials.collateralForInterest[0]
                    ? props.loan.financials.owedInterest[0].amount +
                      ' ' +
                      principalDisplayName +
                      ` (${props.loan.financials.collateralForInterest[0]
                        .amount +
                        ' ' +
                        props.loan.financials.collateralForInterest[0]
                          .currency})`
                    : '-'}
                </Text>
              </div>
            </AmountsContainer>
          )}
          <Text size='16px' color='grey600' weight={600}>
            <FormattedMessage
              id='scenes.borrow.details.info.collateralization'
              defaultMessage='Collateralization'
            />
          </Text>
          <CollateralizationBar {...props} showPercentages />
          <CollateralWarning {...props} />
        </>
      )
  }
}

export default Info
