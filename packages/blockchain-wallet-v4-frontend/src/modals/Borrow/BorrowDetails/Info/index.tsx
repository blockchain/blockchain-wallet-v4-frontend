import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { DefaultTheme } from 'styled-components'

import {
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { OfferType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { model } from 'data'

import CollateralizationBar from '../CollateralizationBar'
import CollateralWarning from '../CollateralWarning'
import { Props } from '../template.success'

const { isLastTxStatus } = model.components.borrow

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
const InlineText = styled(Text)`
  * {
    display: inline;
  }
`

const Info: React.FC<Props & { offer: OfferType }> = props => {
  const lastFailedTx = isLastTxStatus(
    ['FAILED'],
    props.loan,
    props.loanTransactions
  )

  switch (props.loan.status) {
    case 'PENDING_COLLATERAL_DEPOSIT':
    case 'PENDING_EXECUTION': {
      return (
        <Wrapper>
          <Item>
            <IconWrapper bgColor={lastFailedTx ? 'red600' : 'green600'}>
              <Icon
                name={lastFailedTx ? 'alert-filled' : 'check'}
                size={lastFailedTx ? '18px' : '12px'}
                color='white'
              />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              {lastFailedTx ? (
                <FormattedMessage
                  id='scenes.borrow.details.newloan.failed'
                  defaultMessage="There was a problem depositing collateral to your loan. Please try again by clicking 'Add Collateral' below."
                />
              ) : (
                <FormattedMessage
                  id='scenes.borrow.details.newloan.created'
                  defaultMessage='Loan has been created. Once your {symbol} deposit has been confirmed you will receive the loan amount in your wallet.'
                  values={{ symbol: props.loan.collateral.amounts[0].currency }}
                />
              )}
            </Text>
          </Item>
          {!lastFailedTx && (
            <>
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
                <InlineText color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.borrow.details.newloan.receive'
                    defaultMessage='You will receive'
                  />{' '}
                  <CoinDisplay
                    coin={props.loan.principal.amount[0].currency}
                    color='grey600'
                    size='14px'
                    weight={500}
                  >
                    {props.loan.principal.amount[0].amount}
                  </CoinDisplay>{' '}
                  <FormattedMessage
                    id='scenes.borrow.newloan.receive2'
                    defaultMessage='to your Blockchain Wallet once we’ve received your deposit.'
                  />
                </InlineText>
              </Item>
            </>
          )}
        </Wrapper>
      )
    }
    case 'PENDING_CLOSE':
      return (
        <Wrapper>
          <Item>
            <IconWrapper bgColor={lastFailedTx ? 'red600' : 'orange600'}>
              <Icon name='timer' size='18px' color='white' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              {lastFailedTx ? (
                <FormattedMessage
                  id='scenes.borrow.details.info.repayment.failed'
                  defaultMessage='An error occurred while attempting to repay your loan. This could be because you do not have enough ETH to send USD-D, or because of a network connectivity issue. Please try again.'
                />
              ) : (
                <FormattedMessage
                  id='scenes.borrow.details.info.repayment'
                  defaultMessage='Repayment of your loan is in-progress and is being reviewed by our team.'
                />
              )}
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
              <CoinDisplay
                coin={props.loan.principal.amount[0].currency}
                color='grey800'
                size='20px'
                weight={600}
              >
                {props.loan.principal.amount[0].amount}
              </CoinDisplay>
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
                {props.loan.collateral.amounts[0].amount}
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
                  weight={600}
                  style={{ whiteSpace: 'nowrap', display: 'flex' }}
                >
                  {props.loan.financials.owedInterest[0] &&
                  props.loan.financials.collateralForInterest[0] ? (
                    <>
                      <CoinDisplay
                        coin={props.loan.financials.owedInterest[0].currency}
                        color='grey800'
                        size='14px'
                        weight={600}
                      >
                        {props.loan.financials.owedInterest[0].amount}
                      </CoinDisplay>
                      &nbsp;(
                      <CoinDisplay
                        coin={
                          props.loan.financials.collateralForInterest[0]
                            .currency
                        }
                        color='grey800'
                        size='14px'
                        weight={600}
                      >
                        {props.loan.financials.collateralForInterest[0].amount}
                      </CoinDisplay>
                      )
                    </>
                  ) : (
                    '-'
                  )}
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
