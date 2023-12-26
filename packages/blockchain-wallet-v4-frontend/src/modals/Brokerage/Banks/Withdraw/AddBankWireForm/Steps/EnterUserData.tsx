import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import FormLabel from 'components/Form/FormLabel'
import NumberBox from 'components/Form/NumberBox'
import TextBox from 'components/Form/TextBox'
import { required, validBankName, validRoutingNumber } from 'services/forms'

import { Header } from '../Header'
import { FieldsWrapper } from './StepsStyles'
import { StepProps, WireBankFormType } from './StepsTypes'

const EnterUserData = ({ onClickBack, onNextStep }: StepProps) => {
  const { accountNumber, bankName, hasIntermediaryBank, routingNumber } = useSelector((state) =>
    formValueSelector('addWireBank')(
      state,
      'routingNumber',
      'accountNumber',
      'bankName',
      'hasIntermediaryBank'
    )
  ) as WireBankFormType

  const hasBasicRoutingInfo = accountNumber?.length > 0 && routingNumber?.length === 9
  const missingData = [routingNumber, accountNumber, bankName, hasIntermediaryBank].some((e) => !e)

  const disabled =
    !hasBasicRoutingInfo ||
    missingData ||
    bankName.length === 0 ||
    bankName.length > 18 ||
    hasIntermediaryBank.length === 0

  const handleNext = () => {
    if (disabled) return undefined
    onNextStep()
  }

  return (
    <>
      <FieldsWrapper>
        <Header onClickBack={onClickBack} />
        <div>
          <Text size='20px' weight={600} lineHeight='30px'>
            Enter your routing and account numbers
          </Text>
          <Text size='16px' weight={500} lineHeight='24px'>
            Enter your 9-digit bank routing number (ABA) and account number so we can connect to
            your bank.
          </Text>
        </div>

        <div>
          <FormLabel>
            <FormattedMessage id='modals.addWireTransfer.bankName' defaultMessage='Bank name' />
          </FormLabel>
          <Field
            component={TextBox}
            placeholder='Enter bank name'
            data-e2e='bankName'
            name='bankName'
            validate={[required, validBankName]}
          />
        </div>

        <div>
          <FormLabel>
            <FormattedMessage
              id='modals.addWireTransfer.routingNumber'
              defaultMessage='Routing number'
            />
          </FormLabel>
          <Text size='12px' color='grey600' style={{ marginBottom: '0.5rem' }}>
            Make sure you use the correct routing number for wire transfers. It may differ from your
            bank&apos;s ACH routing number
          </Text>
          <Field
            component={NumberBox}
            placeholder='Enter 9-digit Routing Number'
            data-e2e='routingNumber'
            name='routingNumber'
            validate={[required, validRoutingNumber]}
          />
        </div>
        <div>
          <FormLabel>
            <FormattedMessage
              id='modals.addWireTransfer.accountNumber'
              defaultMessage='Account Number'
            />
          </FormLabel>
          <Field
            component={NumberBox}
            type='number'
            placeholder='Enter account number'
            data-e2e='accountNumber'
            name='accountNumber'
            noLastPass
            validate={[required]}
          />
        </div>

        <div>
          <Text size='16px' color='grey900' weight={600} style={{ marginBottom: '0.5rem' }}>
            <FormattedMessage
              id='modals.addWireTransfer.usingIntermediaryBank'
              defaultMessage='Are you using an intermediary bank?'
            />
          </Text>
          <Text size='14px' color='grey600' weight={500}>
            <FormattedMessage
              id='modals.addWireTransfer.usingIntermediaryBankDescription'
              defaultMessage="Most users select no. Intermediary banks are used by brokerages and small credit unions who provide 'For Further Credit' instructions."
            />
          </Text>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <FormLabel htmlFor='hasIntermediaryBankNo'>
              <Field
                component='input'
                type='radio'
                value='NO'
                name='hasIntermediaryBank'
                id='hasIntermediaryBankNo'
              />
              No
            </FormLabel>
            <FormLabel htmlFor='hasIntermediaryBankYes'>
              <Field
                component='input'
                type='radio'
                value='YES'
                name='hasIntermediaryBank'
                id='hasIntermediaryBankYes'
              />
              Yes
            </FormLabel>
          </div>
        </div>
      </FieldsWrapper>
      <FlyoutFooter collapsed>
        <Button
          data-e2e='addWireBankUserData'
          fullwidth
          nature='primary'
          onClick={handleNext}
          disabled={disabled}
        >
          Next
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default reduxForm<{}, StepProps>({ destroyOnUnmount: false, form: 'addWireBank' })(
  EnterUserData
)
