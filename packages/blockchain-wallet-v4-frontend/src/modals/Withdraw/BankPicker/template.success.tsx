import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { Col, FlyoutWrapper, Title, Value } from 'components/Flyout'
import {
  Content,
  DisplayContainer,
  DisplayPaymentIcon
} from 'components/SimpleBuy'
import { Props as OwnProps, SuccessStateType } from '.'

const Top = styled.div`
  display: flex;
  align-items: center;
`
const ColBetween = styled(Col)`
  width: 100%;
  justify-content: space-between;
`

const Success: React.FC<Props> = props => {
  return (
    <div>
      <FlyoutWrapper>
        <Top>
          <Icon
            cursor
            data-e2e='withdrawBack'
            name='arrow-left'
            size='20px'
            color='grey600'
            role='button'
            style={{ marginRight: '8px' }}
            onClick={() =>
              props.withdrawActions.setStep({
                step: 'ENTER_AMOUNT',
                fiatCurrency: props.fiatCurrency
              })
            }
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='scenes.settings.linked_banks'
              defaultMessage='Linked Banks'
            />
          </Text>
        </Top>
      </FlyoutWrapper>
      {props.beneficiaries.map(beneficiary => {
        return (
          <DisplayContainer
            onClick={() => {
              props.withdrawActions.setStep({
                beneficiary,
                fiatCurrency: props.fiatCurrency,
                step: 'ENTER_AMOUNT'
              })
            }}
          >
            <Col>
              <DisplayPaymentIcon showBackground>
                <Icon name='bank-filled' color='blue600' size='16px' />
              </DisplayPaymentIcon>
            </Col>
            <Col>
              <Content>
                <Value asTitle>{beneficiary.name}</Value>
                <Title asValue>{beneficiary.agent.account}</Title>
              </Content>
            </Col>
          </DisplayContainer>
        )
      })}
      <DisplayContainer
        onClick={() => {
          props.simpleBuyActions.showModal('WithdrawModal')
          props.simpleBuyActions.setStep({
            step: 'BANK_WIRE_DETAILS',
            fiatCurrency: props.fiatCurrency,
            displayBack: false,
            addBank: true
          })
        }}
      >
        <Col>
          <DisplayPaymentIcon showBackground>
            <Icon name='bank-filled' color='blue600' size='16px' />
          </DisplayPaymentIcon>
        </Col>
        <ColBetween>
          <Content>
            <Value asTitle>
              <FormattedMessage
                id='buttons.add_bank'
                defaultMessage='Add a Bank'
              />
            </Value>
          </Content>
          <Icon name='plus-in-circle-filled' color='fiat' size='20px' />
        </ColBetween>
      </DisplayContainer>
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
