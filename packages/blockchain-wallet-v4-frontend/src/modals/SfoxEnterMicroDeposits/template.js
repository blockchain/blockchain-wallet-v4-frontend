import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Modal, ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, NumberBox } from 'components/Form'
import { required } from 'services/FormHelper'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`

const MicroDeposits = (props) => {
  const { handleSubmit, close, position, total, invalid } = props

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader onClose={close}>
        <Text>
          <FormattedMessage id='sfox_micro_deposits.header' defaultMessage='Verify Bank Deposits' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItem>
              <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='sfox_micro_deposits.deposit1' defaultMessage='Deposit 1' />
              </Text>
              <Field name='deposit1' validate={[required]} component={NumberBox} placeholder='0.00' />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='sfox_micro_deposits.deposit2' defaultMessage='Deposit 2' />
              </Text>
              <Field name='deposit2' validate={[required]} component={NumberBox} placeholder='0.00' />
            </FormItem>
          </FormGroup>
        </Form>
        <ButtonRow>
          <Button onClick={close} >
            <FormattedMessage id='cancel' defaultMessage='Cancel' />
          </Button>
          <Button type='submit' nature='primary' onClick={handleSubmit} disabled={invalid}>
            <FormattedMessage id='verify' defaultMessage='Verify' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Modal>
  )
}

export default reduxForm({ form: 'sfoxMicroDeposits' })(MicroDeposits)
