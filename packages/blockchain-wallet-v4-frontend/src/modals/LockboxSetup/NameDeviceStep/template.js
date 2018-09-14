import React from 'react'

import styled from 'styled-components'
import { required, requireUniqueDeviceName } from 'services/FormHelper'
import { Button, Image, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Content = styled.div`
  margin-bottom: 10px;
`

const ImageContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
`

const NameDeviceStep = props => {
  const { handleSubmit, invalid, usedDeviceNames } = props
  const uniqueName = requireUniqueDeviceName(usedDeviceNames)

  return (
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.labelstep.title'
            defaultMessage='Name Your Lockbox'
          />
        </Text>
      </Title>
      <Content>
        <ImageContainer>
          <Image width='100px' name='lockbox-usb' />
        </ImageContainer>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.labelstep.body'
            defaultMessage='Personally, we like the name Lockbox but you should name your device something that’s a little more you.'
          />
        </Text>
      </Content>
      <Form onSubmit={handleSubmit}>
        <Row>
          <FormItem>
            <Field
              name='newDeviceName'
              autoFocus
              validate={[required, uniqueName]}
              component={TextBox}
              maxLength={30}
            />
          </FormItem>
        </Row>
        <FormGroup>
          <Button type='submit' nature='primary' disabled={invalid}>
            <FormattedMessage
              id='modals.lockboxsetup.labelstep.finish'
              defaultMessage='Finish Set Up'
            />
          </Button>
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'lockboxNameDevice' })(NameDeviceStep)
