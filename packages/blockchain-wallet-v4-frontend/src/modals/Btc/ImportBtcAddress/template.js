import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { Form, RadioButton } from 'components/Form'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import ImportExternalBtcAddress from './ImportExternalBtcAddress'
import ImportInternalBtcAddress from './ImportInternalBtcAddress'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
`
const RadioContainer = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
  label > span > span {
    font-weight: 500;
  }
`

const ImportBtcAddress = props => {
  const {
    position,
    close,
    submitting,
    invalid,
    isAddressInternal,
    isAddressExternal,
    priv,
    handleSubmit
  } = props

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='arrow-up-circle' onClose={close}>
            <FormattedMessage
              id='modals.importbtcaddress.title'
              defaultMessage='Import Existing Bitcoin Address'
            />
          </ModalHeader>
          <ModalBody>
            <Title>
              <FormattedMessage
                id='modals.importbtcaddress.importtype'
                defaultMessage='What do you want to import?'
              />
            </Title>
            <RadioContainer>
              <Field
                name='address-type'
                value='internal'
                props={{ id: 'internal', value: 'internal' }}
                validate={[]}
                component={RadioButton}
              >
                <FormattedHTMLMessage
                  id='modals.importbtcaddress.generated_in_wallet'
                  defaultMessage='Existing address generated in <span>this wallet</span>.'
                />
              </Field>
            </RadioContainer>
            <RadioContainer>
              <Field
                name='address-type'
                value='external'
                props={{ id: 'external', value: 'external' }}
                validate={[]}
                component={RadioButton}
              >
                <FormattedHTMLMessage
                  id='modals.importbtcaddress.generated_outside_wallet'
                  defaultMessage='Existing address generated <span>outside this wallet</span>.'
                />
              </Field>
            </RadioContainer>
            {isAddressInternal && <ImportInternalBtcAddress />}
            {isAddressExternal && <ImportExternalBtcAddress priv={priv} />}
          </ModalBody>
          {isAddressExternal && (
            <ModalFooter align='right'>
              <Button
                type='submit'
                nature='primary'
                capitalize
                disabled={submitting || invalid}
                data-e2e='importButton'
              >
                <FormattedMessage
                  id='modals.importbtcaddress.button'
                  defaultMessage='Import'
                />
              </Button>
            </ModalFooter>
          )}
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({
  form: 'importBtcAddress',
  initialValues: { 'address-type': '' }
})(ImportBtcAddress)
