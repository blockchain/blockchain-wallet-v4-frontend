import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { destroy } from 'redux-form'

import { WalletFiatType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import { components, modals } from 'data/actions'
import { getModals } from 'data/modals/selectors'
import { ModalName, WithdrawStepEnum } from 'data/types'

import { Header } from '../Header'
import { WIRE_BANK_FORM } from './constants'
import { FinalStatusWrapper } from './StepsStyles'

type Props = { bankName: string; fiatCurrency: WalletFiatType }

const Success = ({ bankName, fiatCurrency }: Props) => {
  const dispatch = useDispatch()
  const openModals = useSelector(getModals)

  const onConfirm = () => {
    dispatch(destroy(WIRE_BANK_FORM))
    dispatch(modals.closeModal(ModalName.BANK_DEPOSIT_MODAL))

    if (!openModals.find((m) => m.props.origin === 'AddBankModalSettings')) {
      dispatch(
        components.withdraw.setStep({
          fiatCurrency,
          step: WithdrawStepEnum.BANK_PICKER
        })
      )
    }
  }

  return (
    <>
      <FinalStatusWrapper>
        <Header />
        <Icon color='success' name='checkmark-circle-filled' size='3rem' />
        <Text size='20px' weight={600} color='grey900'>
          Your {bankName} wire account has been added
        </Text>
        <Text size='16px' weight={500} color='grey600'>
          You can now cash out funds from Blockchain.com via wire transfer. Funds typically arrive
          in 1-3 business days.
        </Text>
      </FinalStatusWrapper>
      <FlyoutFooter collapsed>
        <Button data-e2e='addWireBankSuccess' fullwidth nature='primary' onClick={onConfirm}>
          Done
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default Success
