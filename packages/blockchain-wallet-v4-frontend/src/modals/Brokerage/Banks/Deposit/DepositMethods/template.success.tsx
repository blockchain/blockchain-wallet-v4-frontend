import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import {
  SBPaymentMethodsType,
  SBPaymentMethodType
} from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import {
  AddBankStepType,
  BankDWStepType,
  BrokerageModalOriginType
} from 'data/types'

// TODO: move to somewhere more generic
import BankWire from '../../../../SimpleBuy/PaymentMethods/Methods/BankWire'
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
  border-top: 1px solid ${props => props.theme.grey000};
`

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

const getIcon = (value: SBPaymentMethodType): ReactElement => {
  switch (value.type) {
    case 'BANK_TRANSFER':
    case 'LINK_BANK':
    default:
      return <Image name='bank' height='48px' />
    case 'BANK_ACCOUNT':
      return (
        <IconContainer>
          <Icon size='18px' color='blue600' name='arrow-down' />
        </IconContainer>
      )
  }
}

const getType = (value: SBPaymentMethodType) => {
  switch (value.type) {
    case 'BANK_TRANSFER':
    case 'LINK_BANK':
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.banklink'
          defaultMessage='Link a Bank'
        />
      )
    case 'BANK_ACCOUNT':
      return (
        <FormattedMessage
          id='modals.simplebuy.bankwire'
          defaultMessage='Wire Transfer'
        />
      )
  }
}

const Success = ({
  addNew,
  brokerageActions,
  close,
  paymentMethods
}: Props) => {
  const bankTransfer = paymentMethods.methods.find(
    method => method.type === 'BANK_TRANSFER'
  )
  const bankWire = paymentMethods.methods.find(
    method => method.type === 'BANK_ACCOUNT'
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
                brokerageActions.showModal(
                  BrokerageModalOriginType.ADD_BANK,
                  'ADD_BANK_MODAL'
                )
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
            text={getType(bankTransfer)}
            value={bankTransfer}
          />
        )}

        {bankWire && (
          <BankWire
            icon={getIcon(bankWire)}
            onClick={() =>
              brokerageActions.setDWStep({
                dwStep: BankDWStepType.WIRE_INSTRUCTIONS
              })
            }
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
  paymentMethods: SBPaymentMethodsType
} & ReturnType<typeof mapDispatchToProps> &
  _P

export default Success
