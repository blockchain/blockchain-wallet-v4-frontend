import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import {
  AddBankStepType,
  BankDWStepType,
  BrokerageModalOriginType
} from 'data/types'
import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Image, Text } from 'blockchain-info-components'
import {
  SBPaymentMethodsType,
  SBPaymentMethodType,
  WalletFiatType
} from 'core/types'

import { Props as _P, mapDispatchToProps } from '.'
import BankTransfer from './BankTransfer'
// TODO: move to somewhere more generic
import BankWire from '../../../../SimpleBuy/PaymentMethods/Methods/BankWire'

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
  brokerageActions,
  close,
  fiatCurrency,
  paymentMethods,
  withdrawActions
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
              id='modals.brokerage.add_a_bank_account'
              defaultMessage='Add a Bank Account'
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
          <BankTransfer
            icon={getIcon(bankTransfer)}
            onClick={() => {
              brokerageActions.showModal(
                BrokerageModalOriginType.ADD_BANK,
                'ADD_BANK_MODAL'
              )
              brokerageActions.setAddBankStep({
                addBankStep: AddBankStepType.ADD_BANK
              })
              withdrawActions.setStep({
                fiatCurrency,
                step: 'ENTER_AMOUNT'
              })
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
  fiatCurrency: WalletFiatType,
  paymentMethods: SBPaymentMethodsType
} & ReturnType<typeof mapDispatchToProps> &
  _P

export default Success
