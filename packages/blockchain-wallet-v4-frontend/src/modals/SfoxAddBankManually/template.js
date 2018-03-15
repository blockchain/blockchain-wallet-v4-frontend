import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { TextBox, SelectBoxBankAccountType, Form } from 'components/Form'
import { Text } from 'blockchain-info-components'
import { required } from 'services/FormHelper'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 25px;
  button {
    margin-top: 20px;
  }
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  button {
    margin-top: 0px;
  }
`

const SfoxAddBankManually = ({
  position,
  total,
  handleFullName,
  handleRoutingNumber,
  handleAccountNumber,
  handleAccountType,
  handleSubmit,
  handleClose,
  close }) => (
  <Modal size='large' position={0} total={total}>
    <ModalHeader>
      Modal header content
    </ModalHeader>
    <ModalBody>
      <Form onSubmit={handleSubmit}>
        <Container>
          <InputContainer>
            <Text size='14px' weight={500}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.accountholdername' defaultMessage="Full Name of Primary Account Holder" />
            </Text>
            <Field name='fullName' component={TextBox} validate={[required]} onChange={(e) => handleFullName(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.routingnumber' defaultMessage="Routing Number" />
            </Text>
            <Field name='routingNumber' component={TextBox} validate={[required]} onChange={(e) => handleRoutingNumber(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.accountnumber' defaultMessage="Account Number" />
            </Text>
            <Field name='accountNumber' component={TextBox} validate={[required]} onChange={(e) => handleAccountNumber(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.accounttype' defaultMessage="Account Type" />
            </Text>
            <Field name='type' component={SelectBoxBankAccountType} validate={[required]} onChange={(e, val) => handleAccountType(e, val)} />
          </InputContainer>
        </Container>
      </Form>
    </ModalBody>
    <ModalFooter>
      Modal Footer Content
    </ModalFooter>
  </Modal>
)

export default reduxForm({ form: 'sfoxAddBankManually' })(SfoxAddBankManually)
