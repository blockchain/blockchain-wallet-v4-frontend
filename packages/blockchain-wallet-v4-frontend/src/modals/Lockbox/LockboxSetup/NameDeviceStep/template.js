import React from 'react'

import styled from 'styled-components'
import { required } from 'services/FormHelper'
import { Button, Image, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'

const Wrapper = styled.div``

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Content = styled.div`
  margin-bottom: 10px;
`
const ImageContainer = styled.div`
  margin: 20px 0;
  position: relative;
  padding-bottom: 57%;
  img {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const NameDeviceStep = props => {
  const { handleSubmit, invalid } = props

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
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.labelstep.body'
            defaultMessage='Personally, we like the name Lockbox but you should name your device something that’s a little more you.'
          />
        </Text>
      </Content>
      <Form onSubmit={handleSubmit}>
        <FormItem>
          <Field
            name='newDeviceName'
            autoFocus
            validate={[required]}
            component={TextBox}
            maxLength={30}
          />
        </FormItem>
        <ImageContainer>
          <Image
            name='lockbox-onboard-name'
            width='100%'
            srcset={{
              'lockbox-onboard-name2': '2x',
              'lockbox-onboard-name3': '3x'
            }}
          />
        </ImageContainer>
        <FormGroup>
          <Button type='submit' nature='primary' disabled={invalid}>
            <FormattedMessage
              id='modals.lockboxsetup.labelstep.finishsetup'
              defaultMessage='Finish Setup'
            />
          </Button>
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'lockboxNameDevice' })(NameDeviceStep)
