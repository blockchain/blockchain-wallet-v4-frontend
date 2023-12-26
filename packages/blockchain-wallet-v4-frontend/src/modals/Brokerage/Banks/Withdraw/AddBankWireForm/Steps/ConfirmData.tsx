import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { change, Field, getFormValues, reduxForm } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import FlyoutFooter from 'components/Flyout/Footer'
import CheckBox from 'components/Form/CheckBox'
import { getUserData } from 'data/modules/profile/selectors'

import { Header } from '../Header'
import { BANK_INFO_ROWS, INTERMEDIARY_INFO_ROWS, WIRE_BANK_FORM } from './constants'
import { Entries, Entry, FieldsWrapper } from './StepsStyles'
import { StepProps, WireBankFormType } from './StepsTypes'

const ConfirmData = ({ onClickBack, onNextStep }: StepProps) => {
  const formValues = useSelector(getFormValues(WIRE_BANK_FORM)) as WireBankFormType

  const dispatch = useDispatch()

  const {
    data: { address, firstName, lastName }
  } = useSelector(getUserData)

  const resetAcceptDetails = () => {
    dispatch(change(WIRE_BANK_FORM, 'acceptDetails', false))
    onClickBack()
  }

  return (
    <>
      <FieldsWrapper>
        <Header onClickBack={resetAcceptDetails} />
        <div>
          <Text size='16px' color='grey600' weight={600} style={{ marginBottom: '8px' }}>
            Bank Info
          </Text>

          <Entries>
            {BANK_INFO_ROWS.map((item) => (
              <Entry key={item.key}>
                <Text size='16px' color='grey900' weight={600}>
                  {item.key}
                </Text>
                <Text size='16px' color='grey600' weight={600}>
                  {formValues[item.prop]}
                </Text>
              </Entry>
            ))}
          </Entries>
        </div>

        {formValues.hasIntermediaryBank === 'YES' && (
          <div>
            <Text size='16px' color='grey600' weight={600} style={{ marginBottom: '8px' }}>
              Intermediary Bank
            </Text>
            <Entries>
              {INTERMEDIARY_INFO_ROWS.map((item) => (
                <Entry key={item.key}>
                  <Text size='16px' color='grey900' weight={600}>
                    {item.key}
                  </Text>
                  <Text size='16px' color='grey600' weight={600}>
                    {formValues[item.prop]}
                  </Text>
                </Entry>
              ))}
            </Entries>
          </div>
        )}

        <div>
          <Text size='16px' color='grey600' weight={600} style={{ marginBottom: '8px' }}>
            Your Info
          </Text>

          <Entries>
            <Entry>
              <Text size='16px' color='grey900' weight={600}>
                Name
              </Text>
              <Text size='16px' color='grey600' weight={600}>
                {firstName} {lastName}
              </Text>
            </Entry>
            <Entry>
              <Text size='16px' color='grey900' weight={600}>
                Address
              </Text>
              <div>
                <Text size='16px' color='grey600' weight={600}>
                  {address?.line1}
                </Text>
                <Text size='16px' color='grey600' weight={600}>
                  {address?.city} {address?.state}
                </Text>
                <Text size='16px' color='grey600' weight={600}>
                  {address?.postCode}
                </Text>
              </div>
            </Entry>
          </Entries>
        </div>

        <Field name='acceptDetails' component={CheckBox}>
          <Text size='12px' color='grey600' weight={500}>
            <FormattedMessage
              id='modals.addWireTransfer.agreeDataMatches'
              defaultMessage='I’ve ensured that details entered here exactly match my bank account. Any inaccurate information will result in loss of funds.'
            />
          </Text>
        </Field>
      </FieldsWrapper>
      <FlyoutFooter collapsed>
        <Button
          data-e2e='addWireBankUserData'
          fullwidth
          nature='primary'
          onClick={onNextStep}
          disabled={!formValues.acceptDetails}
        >
          Next
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default reduxForm<{}, StepProps>({ destroyOnUnmount: false, form: WIRE_BANK_FORM })(
  ConfirmData
)
