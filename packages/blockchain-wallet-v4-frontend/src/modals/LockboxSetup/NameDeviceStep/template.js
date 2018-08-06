import React from 'react'

import styled from 'styled-components'
import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'
import { any, equals } from 'ramda'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * {
    width: 150px;
  }
  & > :last-child {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
`
const Label = styled(Text)`
  display: block;
  margin-bottom: 5px;
`

const requireUnique = (value, allValues, { deviceNames }) => {
  return any(equals(value))(deviceNames)
    ? 'Device name is already taken.'
    : undefined
}

const NameDeviceStep = props => {
  const { handleSubmit, invalid } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.labelstep.nameintro'
            defaultMessage='Please name your Lockbox. The device can be renamed later.'
          />
        </Text>
      </Row>
      <Row>
        <FormItem>
          <Label for='deviceName' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.labelstep.devicename'
              defaultMessage='Device Name'
            />
          </Label>
          <Field
            name='newDeviceName'
            autoFocus
            validate={[required, requireUnique]}
            component={TextBox}
          />
        </FormItem>
      </Row>
      <Row>
        <FormGroup>
          <Button type='submit' nature='primary' uppercase disabled={invalid}>
            <FormattedMessage
              id='modals.lockboxsetup.labelstep.continue'
              defaultMessage='Continue'
            />
          </Button>
        </FormGroup>
      </Row>
    </Form>
  )
}

export default reduxForm({ form: 'lockboxNameDevice' })(NameDeviceStep)
