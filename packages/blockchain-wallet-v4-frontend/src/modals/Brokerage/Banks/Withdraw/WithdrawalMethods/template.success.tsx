import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import {
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBPaymentTypes,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import {
  AddBankStepType,
  BrokerageModalOriginType,
  UserDataType,
  WithdrawStepEnum
} from 'data/types'

// TODO: move to somewhere more generic
import BankWire from '../../../../SimpleBuy/PaymentMethods/Methods/BankWire'
import { mapDispatchToProps, Props as _P } from '.'
import BankTransfer from './BankTransfer'

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

const getIcon = (value: SBPaymentMethodType): ReactElement => {
  switch (value.type) {
    case SBPaymentTypes.BANK_TRANSFER:
    case SBPaymentTypes.LINK_BANK:
    default:
      return <Image name='bank' height='48px' />
    case SBPaymentTypes.BANK_ACCOUNT:
      return (
        <IconContainer>
          <Icon size='18px' color='blue600' name='arrow-down' />
        </IconContainer>
      )
  }
}

const getType = (value: SBPaymentMethodType) => {
  switch (value.type) {
    case SBPaymentTypes.BANK_TRANSFER:
    case SBPaymentTypes.LINK_BANK:
    default:
      return <FormattedMessage id='modals.simplebuy.banklink' defaultMessage='Link a Bank' />
    case SBPaymentTypes.BANK_ACCOUNT:
      return <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
  }
}

const Success = ({
  brokerageActions,
  close,
  fiatCurrency,
  paymentMethods,
  simpleBuyActions,
  userData,
  withdrawActions
}: Props) => {
  const bankTransfer = paymentMethods.methods.find(
    (method) => method.type === SBPaymentTypes.BANK_TRANSFER
  )
  const bankWire = paymentMethods.methods.find(
    (method) => method.type === SBPaymentTypes.BANK_ACCOUNT
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
              brokerageActions.showModal(BrokerageModalOriginType.ADD_BANK, 'ADD_BANK_YODLEE_MODAL')
              brokerageActions.setAddBankStep({
                addBankStep: AddBankStepType.ADD_BANK
              })
              withdrawActions.setStep({
                fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }}
            text={getType(bankTransfer)}
            value={bankTransfer}
          />
        )}

        {bankWire && (
          <BankWire
            icon={getIcon(bankWire)}
            onClick={() => {
              simpleBuyActions.showModal('WithdrawModal')
              if (userData.tiers.current === 2) {
                simpleBuyActions.setStep({
                  addBank: true,
                  displayBack: false,
                  fiatCurrency,
                  step: 'BANK_WIRE_DETAILS'
                })
              } else {
                simpleBuyActions.setStep({
                  step: 'KYC_REQUIRED'
                })
              }

              withdrawActions.setStep({
                fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
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
  fiatCurrency: WalletFiatType
  paymentMethods: SBPaymentMethodsType
  userData: UserDataType
} & ReturnType<typeof mapDispatchToProps> &
  _P

export default Success
