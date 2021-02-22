import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { BankDepositStepType } from 'data/types'
import { FlyoutWrapper } from 'components/Flyout'

import { FormattedBank, LineItemText } from './model'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const FlyoutBody = styled(FlyoutWrapper)`
  margin: 0;
  padding: 0;
`

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`

const Row = styled.div`
  padding: 18px 40px;
  border-bottom: 1px solid ${p => p.theme.grey000};
`

const Success = props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.brokerageActions.setStep({
                step: BankDepositStepType.ENTER_AMOUNT
              })
            }
          />
          <FormattedMessage
            id='modals.brokerage.confirm_deposit'
            defaultMessage='Confirm Deposit'
          />
        </TopText>
      </FlyoutWrapper>
      <FlyoutBody>
        <Row>
          <Text color='grey800' size='32px' weight={600}>
            {props.formValues?.amount}
          </Text>
        </Row>
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </Text>
          {FormattedBank(props.defaultMethod)}
        </Row>
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Text>
          <LineItemText>
            <FormattedMessage
              id='modals.brokerage.my_currency_wallet'
              defaultMessage='My {currency} Wallet'
              values={{ currency: props.defaultMethod.currency }}
            />
          </LineItemText>
        </Row>
      </FlyoutBody>
    </Wrapper>
  )
}

export default Success
