import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import FormLabel from 'components/Form/FormLabel'
import TextBox from 'components/Form/TextBox'
import { maxLength, onlyNumbers, required, validRoutingNumber } from 'services/forms'

import { Header } from '../Header'
import { WIRE_BANK_FORM } from './constants'
import { FieldsWrapper } from './StepsStyles'
import { StepFormProps, StepProps } from './StepsTypes'

const validBankName = maxLength(35)

const EnterUserData = ({ invalid, onClickBack, onNextStep }: StepFormProps) => {
  const handleNext = () => {
    if (invalid) return
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
            errorBottom
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
            component={TextBox}
            placeholder='Enter 9-digit Routing Number'
            data-e2e='routingNumber'
            name='routingNumber'
            validate={[required, onlyNumbers, validRoutingNumber]}
            errorBottom
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
            component={TextBox}
            type='number'
            placeholder='Enter account number'
            data-e2e='accountNumber'
            name='accountNumber'
            noLastPass
            validate={[required, onlyNumbers]}
            errorBottom
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
          disabled={invalid}
        >
          Next
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default reduxForm<{}, StepProps>({
  destroyOnUnmount: false,
  form: WIRE_BANK_FORM,
  initialValues: {
    hasIntermediaryBank: 'NO'
  }
})(EnterUserData)
