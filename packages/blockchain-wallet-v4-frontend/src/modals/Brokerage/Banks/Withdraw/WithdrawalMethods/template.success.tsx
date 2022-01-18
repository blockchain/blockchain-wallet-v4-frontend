import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  BSPaymentMethodsType,
  BSPaymentMethodType,
  BSPaymentTypes,
  WalletFiatType
} from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import {
  AddBankStepType,
  BrokerageModalOriginType,
  UserDataType,
  WithdrawStepEnum
} from 'data/types'

// TODO: move to somewhere more generic
import BankWire from '../../../../BuySell/PaymentMethods/Methods/BankWire'
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
      return value.currency === 'USD' ? (
        <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      ) : (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Regular Bank Transfer'
        />
      )
  }
}

const Success = ({
  brokerageActions,
  buySellActions,
  close,
  fiatCurrency,
  paymentMethods,
  userData,
  withdrawActions
}: Props) => {
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
              brokerageActions.showModal({
                modalType: 'ADD_BANK_YODLEE_MODAL',
                origin: BrokerageModalOriginType.ADD_BANK_WITHDRAW
              })
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
              buySellActions.showModal({ origin: 'WithdrawModal' })
              if (userData.tiers.current === 2) {
                buySellActions.setStep({
                  addBank: true,
                  displayBack: false,
                  fiatCurrency,
                  step: 'BANK_WIRE_DETAILS'
                })
              } else {
                buySellActions.setStep({
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
  paymentMethods: BSPaymentMethodsType
  userData: UserDataType
} & ReturnType<typeof mapDispatchToProps> &
  _P

export default Success
