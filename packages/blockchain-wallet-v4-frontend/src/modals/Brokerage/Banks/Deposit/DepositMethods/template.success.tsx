import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { BSPaymentMethodsType, BSPaymentMethodType, BSPaymentTypes, FiatType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { actions } from 'data'
import { BankDWStepType } from 'data/types'

// TODO: move to somewhere more generic
import BankWire from '../../../../BuySell/PaymentMethods/Methods/BankWire'
import BankDeposit from './BankDeposit'

const currenciesForBankTransferLabel: FiatType[] = ['EUR', 'GBP', 'ARS']

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
      if (currenciesForBankTransferLabel.includes(value.currency)) {
        text = <FormattedMessage id='buttons.transfer' defaultMessage='Bank Transfer' />
      } else {
        text = <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      }
      return text
  }
}

const Success = ({ addBankCallback, handleClose, paymentMethods }: Props) => {
  const dispatch = useDispatch()
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
            onClick={handleClose}
          />
        </TopText>
      </WrapperHeader>
      <MethodList>
        {bankTransfer && (
          <BankDeposit
            icon={getIcon(bankTransfer)}
            onClick={addBankCallback}
            value={bankTransfer}
          />
        )}
        {bankWire && (
          <BankWire
            icon={getIcon(bankWire)}
            onClick={() => {
              dispatch(
                actions.components.brokerage.setDWStep({
                  dwStep: BankDWStepType.WIRE_INSTRUCTIONS
                })
              )
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
  addBankCallback: () => void
  handleClose: () => void
  paymentMethods: BSPaymentMethodsType
}

export default Success
