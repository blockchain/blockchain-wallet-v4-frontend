import React from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { TextBox, SelectBoxBankAccountType, Form } from 'components/Form'
import { required } from 'services/FormHelper'
import { Button, Modal, ModalHeader, ModalBody, Image, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

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
const CheckImage = styled(Image)`
  width: 100%;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  close,
  pristine,
  invalid,
  busy }) => (
  <Modal size='small' position={position} total={total}>
    <ModalHeader onClose={close}>
      <Text size='20px' weight={500}>
        <FormattedMessage id='sfoxexchangedata.link.addmanually.header' defaultMessage="Enter Bank Details" />
      </Text>
    </ModalHeader>
    <ModalBody>
      <Form onSubmit={handleSubmit}>
        <Container>
          <InputContainer>
            <Text size='14px' weight={500} style={spacing('mb-10')}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.accountholdername' defaultMessage="Full Name of Primary Account Holder" />
            </Text>
            <Field name='fullName' component={TextBox} validate={[required]} onChange={(e) => handleFullName(e)} placeholder='John Doe' />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500} style={spacing('mb-10')}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.bankaccountinformation' defaultMessage="Bank Account Information" />
            </Text>
            <CheckImage name='check-helper' />
            <Field name='routingNumber' component={TextBox} validate={[required]} onChange={(e) => handleRoutingNumber(e)} placeholder='Routing Number' />
            <Field name='accountNumber' component={TextBox} validate={[required]} onChange={(e) => handleAccountNumber(e)} placeholder='Account Number' />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500} style={spacing('mb-10')}>
              <FormattedMessage id='sfoxexchangedata.link.addmanually.accounttype' defaultMessage="Account Type" />
            </Text>
            <Field name='type' component={SelectBoxBankAccountType} validate={[required]} onChange={(e, val) => handleAccountType(e, val)} />
          </InputContainer>
        </Container>
        <ButtonGroup>
          <Button onClick={close}>
            <FormattedMessage id='sfoxexchangedata.link.addmanually.cancel' defaultMessage="Cancel" />
          </Button>
          <Button nature='primary' type='submit' disabled={pristine || invalid || busy} >
            <FormattedMessage id='sfoxexchangedata.link.addmanually.addaccount' defaultMessage="Add Account" />
          </Button>
        </ButtonGroup>
      </Form>
    </ModalBody>
  </Modal>
)

export default reduxForm({ form: 'sfoxAddBankManually' })(SfoxAddBankManually)
