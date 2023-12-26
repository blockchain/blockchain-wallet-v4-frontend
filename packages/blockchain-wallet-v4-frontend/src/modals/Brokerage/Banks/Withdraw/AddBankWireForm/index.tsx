import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { destroy, formValueSelector, reduxForm } from 'redux-form'

import { getDomains } from '@core/redux/walletOptions/selectors'
import FlyoutContainer from 'components/Flyout/Container'
import { actions } from 'data'
import { getFiatCurrency } from 'data/components/withdraw/selectors'
import { getUserApiToken } from 'data/modules/profile/selectors'
import { BankDWStepType } from 'data/types'

import Loading from '../EnterAmount/template.loading'
import ConfirmData from './Steps/ConfirmData'
import { WIRE_BANK_FORM } from './Steps/constants'
import EnterIntermediaryBank from './Steps/EnterIntermediaryData'
import EnterUserData from './Steps/EnterUserData'
import Failure from './Steps/Failure'
import { ADD_WIRE_BANK_STEPS, WireBankFormType } from './Steps/StepsTypes'
import Success from './Steps/Success'

const AddWireBank = () => {
  const [step, setStep] = useState<ADD_WIRE_BANK_STEPS>('USER_INFO')

  const dispatch = useDispatch()

  const formValues = useSelector((state) =>
    formValueSelector('addWireBank')(
      state,
      'accountNumber',
      'bankName',
      'hasIntermediaryBank',
      'intermediaryAccountNumber',
      'intermediaryBankName',
      'intermediaryRoutingNumber',
      'routingNumber'
    )
  ) as WireBankFormType

  const currency = useSelector(getFiatCurrency)
  const nabuToken = useSelector(getUserApiToken)

  const {
    data: { api }
  } = useSelector(getDomains)

  const resetForm = () => {
    dispatch(destroy('addWireBank'))
    dispatch(actions.components.brokerage.setDWStep({ dwStep: BankDWStepType.DEPOSIT_METHODS }))
  }

  const onSubmit = async () => {
    const {
      accountNumber,
      bankName,
      hasIntermediaryBank,
      intermediaryAccountNumber,
      intermediaryBankName,
      intermediaryRoutingNumber,
      routingNumber
    } = formValues

    const payload = {
      accountNumber,
      bankName,
      currency,
      routingNumber
    }

    if (hasIntermediaryBank === 'YES') {
      payload.intermediaryBankInfo = {
        bankAccount: intermediaryAccountNumber,
        bankName: intermediaryBankName,
        bankRoutingNumber: intermediaryRoutingNumber
      }
    }

    setStep('LOADING')
    try {
      await axios.post(`${api}/nabu-gateway/payments/beneficiaries/bank_account`, payload, {
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${nabuToken}` }
      })
      setStep('SUCCESS')
    } catch (error) {
      setStep('FAILURE')
    }
  }

  const getStepComponent = () => {
    switch (step) {
      case 'INTERMEDIARY_INFO':
        return (
          <EnterIntermediaryBank
            onNextStep={() => setStep('CONFIRM_DATA')}
            onClickBack={() => setStep('USER_INFO')}
          />
        )
      case 'CONFIRM_DATA':
        const prevStep =
          formValues.hasIntermediaryBank === 'YES' ? 'INTERMEDIARY_INFO' : 'USER_INFO'
        return <ConfirmData onNextStep={() => onSubmit()} onClickBack={() => setStep(prevStep)} />
      case 'LOADING':
        return <Loading />
      case 'SUCCESS':
        return <Success bankName={formValues?.bankName ?? ''} />
      case 'FAILURE':
        return <Failure />
      case 'USER_INFO':
      default:
        const nextStep =
          formValues.hasIntermediaryBank === 'YES' ? 'INTERMEDIARY_INFO' : 'CONFIRM_DATA'
        return <EnterUserData onNextStep={() => setStep(nextStep)} onClickBack={resetForm} />
    }
  }

  return <FlyoutContainer>{getStepComponent()}</FlyoutContainer>
}

export default reduxForm({ destroyOnUnmount: false, form: WIRE_BANK_FORM })(AddWireBank)
