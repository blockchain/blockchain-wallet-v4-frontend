import React from 'react'

import styled from 'styled-components'
import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'

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
    padding-top: 0px;
  }
`
const Label = styled(Text)`
  display: block;
  margin-bottom: 5px;
`

const NameDeviceStep = props => {
  const { handleSubmit, invalid } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.labelstep.plugindevice'
            defaultMessage='Connection to device established. Please name your Lockbox.'
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
            name='deviceName'
            defaultValue={'My Lockbox 1'}
            validate={[required]}
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
