import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

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

const EnterIntermediaryBank = ({ invalid, onClickBack, onNextStep }: StepFormProps) => {
  const handleNext = () => {
    if (invalid) return
    onNextStep()
  }

  return (
    <>
      <FieldsWrapper>
        <Header onClickBack={onClickBack} />
        <Text size='20px' weight={600} lineHeight='30px'>
          Enter your intermediary bank&apos;s information
        </Text>

        <div>
          <FormLabel>
            <FormattedMessage
              id='modals.addWireTransfer.intermediaryBankName'
              defaultMessage='Intermediary Bank Name'
            />
          </FormLabel>
          <Field
            component={TextBox}
            autoFocus
            placeholder='Enter Bank Name'
            data-e2e='intermediaryBankName'
            name='intermediaryBankName'
            noLastPass
            validate={[required, validBankName]}
            errorBottom
          />
        </div>
        <div>
          <FormLabel>
            <FormattedMessage
              id='modals.addWireTransfer.intermediaryRoutingNumber'
              defaultMessage='Intermediary Bank Routing number'
            />
          </FormLabel>
          <Field
            component={TextBox}
            placeholder='Enter 9-digit routing number'
            data-e2e='intermediaryRoutingNumber'
            name='intermediaryRoutingNumber'
            noLastPass
            validate={[required, onlyNumbers, validRoutingNumber]}
            errorBottom
          />
        </div>
        <div>
          <FormLabel>
            <FormattedMessage
              id='modals.addWireTransfer.intermediaryAccountNumber'
              defaultMessage='Account Number (for further credit)'
            />
          </FormLabel>
          <Field
            component={TextBox}
            type='number'
            placeholder='Enter account number'
            data-e2e='intermediaryAccountNumber'
            name='intermediaryAccountNumber'
            noLastPass
            validate={[required, onlyNumbers]}
            errorBottom
          />
        </div>
      </FieldsWrapper>
      <FlyoutFooter collapsed>
        <Button
          data-e2e='addWireBankFirstStep'
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

export default reduxForm<{}, StepProps>({ destroyOnUnmount: false, form: WIRE_BANK_FORM })(
  EnterIntermediaryBank
)
