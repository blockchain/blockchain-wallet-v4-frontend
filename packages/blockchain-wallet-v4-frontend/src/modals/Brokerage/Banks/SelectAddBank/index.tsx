import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import BankWire from 'blockchain-wallet-v4-frontend/src/modals/BuySell/PaymentMethods/Methods/BankWire'
import styled from 'styled-components'

import { getInvitations } from '@core/redux/settings/selectors'
import { BSPaymentMethodType, BSPaymentTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { brokerage, buySell, withdraw } from 'data/components/actions'
import { BankDWStepType, BrokerageModalOriginType, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import BankTransfer from '../Withdraw/WithdrawalMethods/BankTransfer'
import Loading from './Loading'
import getData from './selectors'

const Header = styled.div`
  display: flex;
  padding: 40px;
  justify-content: space-between;
  align-items: center;
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

const getType = (value: BSPaymentMethodType) => {
  switch (value.currency) {
    case 'USD':
      return <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
    case 'GBP':
    case 'EUR':
      return (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Bank Transfer'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.deposit.regular_bank_transfer'
          defaultMessage='Regular Bank Transfer'
        />
      )
  }
}

const SelectAddBank = (props) => {
  const dispatch = useDispatch()
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)
  const { openBanking } = useSelector(getInvitations).getOrElse({ openBanking: false })

  const onClose = () => {
    props.close(ModalName.SELECT_ADD_BANK_TYPE)
  }

  if (hasError) return <FlyoutOopsError action='close' data-e2e='closeAddBank' handler={onClose} />
  if (!data || isLoading || isNotAsked) return <Loading />

  const userPaymentMethods = !openBanking
    ? {
        ...data.paymentMethods,
        methods: data.paymentMethods.methods.filter(
          (m) => m.type === BSPaymentTypes.BANK_ACCOUNT || m.currency === 'USD'
        )
      }
    : data.paymentMethods

  const bankTransfer = userPaymentMethods.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_TRANSFER
  )
  const bankWire = userPaymentMethods.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_ACCOUNT
  )

  const onBankTransferClick = () => {
    const ACHProvider = data.plaidEnabled
      ? ModalName.ADD_BANK_PLAID_MODAL
      : ModalName.ADD_BANK_YODLEE_MODAL
    dispatch(brokerage.setupBankTransferProvider())
    dispatch(
      brokerage.showModal({
        modalType:
          data.userData.currencies.preferredFiatTradingCurrency === 'USD'
            ? ACHProvider
            : ModalName.ADD_BANK_YAPILY_MODAL,
        origin: BrokerageModalOriginType.ADD_BANK_SETTINGS
      })
    )
    onClose()
  }

  const onBankAccountClick = () => {
    if (data?.userData.tiers.current === 2) {
      dispatch(withdraw.setFiatCurrency(data.userData.currencies.preferredFiatTradingCurrency))
      dispatch(
        brokerage.showModal({
          modalType: ModalName.BANK_DEPOSIT_MODAL,
          origin: BrokerageModalOriginType.ADD_BANK_SETTINGS
        })
      )
      dispatch(
        brokerage.setDWStep({
          dwStep: BankDWStepType.ADD_WIRE_BANK
        })
      )
      onClose()
    } else {
      dispatch(buySell.setStep({ step: 'KYC_REQUIRED' }))
    }
  }

  return (
    <Flyout {...props} data-e2e='selectAddBank' onClose={onClose} isOpen>
      <FlyoutChild>
        <Header>
          <Text size='16px' weight={600}>
            <FormattedMessage
              id='modals.brokerage.add_a_bank_account'
              defaultMessage='Add a Bank Account'
            />
          </Text>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={onClose}
          />
        </Header>
        <MethodList>
          {bankTransfer && (
            <BankTransfer
              icon={
                <IconContainer>
                  <Icon color='blue600' name='bank-filled' size='18px' />
                </IconContainer>
              }
              onClick={onBankTransferClick}
              value={bankTransfer}
            />
          )}

          {bankWire && (
            <BankWire
              icon={
                <IconContainer>
                  <Icon color='blue600' name='arrow-down' size='18px' />
                </IconContainer>
              }
              onClick={onBankAccountClick}
              text={getType(bankWire)}
              value={bankWire}
            />
          )}
        </MethodList>
      </FlyoutChild>
    </Flyout>
  )
}

const enhance = ModalEnhancer(ModalName.SELECT_ADD_BANK_TYPE, { transition: duration })

export default enhance(SelectAddBank)
