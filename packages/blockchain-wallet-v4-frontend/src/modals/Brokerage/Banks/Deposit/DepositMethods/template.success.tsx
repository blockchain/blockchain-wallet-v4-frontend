import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSPaymentMethodsType, BSPaymentMethodType, BSPaymentTypes } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { AddBankStepType, BankDWStepType, BrokerageModalOriginType } from 'data/types'

// TODO: move to somewhere more generic
import BankWire from '../../../../BuySell/PaymentMethods/Methods/BankWire'
import { mapDispatchToProps, Props as _P } from '.'
import BankDeposit from './BankDeposit'

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`
const WrapperHeader = styled(FlyoutWrapper)`
  height: unset;
`
const TopText = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`
const MethodList = styled.section`
  border-top: 1px solid ${(props) => props.theme.grey000};
`
const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

const getIcon = (value: BSPaymentMethodType): ReactElement => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
    default:
      return <Image name='bank' height='48px' />
    case BSPaymentTypes.BANK_ACCOUNT:
      return (
        <IconContainer>
          <Icon size='18px' color='blue600' name='arrow-down' />
        </IconContainer>
      )
  }
}

const getType = (value: BSPaymentMethodType) => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      )
    case BSPaymentTypes.BANK_ACCOUNT:
      let text
      if (value.currency === 'EUR' || value.currency === 'GBP') {
        text = <FormattedMessage id='buttons.transfer' defaultMessage='Regular Bank Transfer' />
      } else {
        text = <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      }
      return text
  }
}

const Success = ({ addNew, brokerageActions, close, fiatCurrency, paymentMethods }: Props) => {
  const bankTransfer = paymentMethods.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_TRANSFER
  )
  const bankWire = paymentMethods.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_ACCOUNT
  )

  return (
    <Wrapper>
      <WrapperHeader>
        <TopText color='grey800' size='20px' weight={600}>
          <div>
            <FormattedMessage
              id='modals.brokerage.deposit_methods'
              defaultMessage='Select a Deposit Method'
            />
          </div>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={() => {
              close()
            }}
          />
        </TopText>
      </WrapperHeader>
      <MethodList>
        {bankTransfer && (
          <BankDeposit
            icon={getIcon(bankTransfer)}
            onClick={() => {
              /* If I'm on the deposit method screen and I came from the user
                 clicking the "add new" button I want to show the add bank 
                 modal else I want to go to the enter amount screen
              */
              if (addNew) {
                brokerageActions.showModal({
                  modalType:
                    fiatCurrency === 'USD' ? 'ADD_BANK_YODLEE_MODAL' : 'ADD_BANK_YAPILY_MODAL',
                  origin: BrokerageModalOriginType.ADD_BANK_DEPOSIT
                })
                brokerageActions.setAddBankStep({
                  addBankStep: AddBankStepType.ADD_BANK
                })
                brokerageActions.setDWStep({
                  dwStep: BankDWStepType.ENTER_AMOUNT
                })
              } else {
                brokerageActions.setDWStep({
                  dwStep: BankDWStepType.ENTER_AMOUNT
                })
              }
            }}
            value={bankTransfer}
          />
        )}
        {bankWire && (
          <BankWire
            icon={getIcon(bankWire)}
            onClick={() => {
              brokerageActions.setDWStep({
                dwStep: BankDWStepType.WIRE_INSTRUCTIONS
              })
            }}
            text={getType(bankWire)}
            value={bankWire}
          />
        )}
      </MethodList>
    </Wrapper>
  )
}

type Props = {
  close: () => void
  paymentMethods: BSPaymentMethodsType
} & ReturnType<typeof mapDispatchToProps> &
  _P

export default Success
