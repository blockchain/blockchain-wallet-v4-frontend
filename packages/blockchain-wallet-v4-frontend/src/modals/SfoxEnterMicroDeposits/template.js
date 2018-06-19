import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Modal, ModalHeader, ModalBody, Text, Button, Link, HeartbeatLoader } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, NumberBox } from 'components/Form'
import { required } from 'services/FormHelper'
import PropTypes from 'prop-types'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`
const ErrorText = styled(Text)`
  width: 250px;
  a {
    display: inline;
  }
`

const MicroDeposits = (props) => {
  const { handleSubmit, close, position, total, invalid, status, tryAgain } = props

  if (status === 'success') {
    return (
      <Modal size='medium' position={position} total={total}>
        {/* <ModalHeader onClose={close}>
          <Text>
            <FormattedMessage id='sfoxmicrodeposits.header' defaultMessage='Verify Bank Deposits' />
          </Text>
        </ModalHeader> */}
        <ModalBody>
          <Text size='28px' weight={300}>
            <FormattedMessage id='sfoxmicrodeposits.success' defaultMessage='YOU ARE NOW READY TO BUY & SELL' />
          </Text>
        </ModalBody>
      </Modal>
    )
  }

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader onClose={close}>
        <Text>
          <FormattedMessage id='sfoxmicrodeposits.header' defaultMessage='Verify Bank Deposits' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormItem>
              <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='sfoxmicrodeposits.deposit1' defaultMessage='Deposit 1' />
              </Text>
              <Field name='deposit1' validate={[required]} component={NumberBox} placeholder='0.00' />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='sfoxmicrodeposits.deposit2' defaultMessage='Deposit 2' />
              </Text>
              <Field name='deposit2' validate={[required]} component={NumberBox} placeholder='0.00' />
            </FormItem>
          </FormGroup>
        </Form>
        <ButtonRow>
          <Button onClick={close} >
            <FormattedMessage id='cancel' defaultMessage='Cancel' />
          </Button>
          {
            status instanceof Error
              ? <ErrorText size='13px' weight={300}>
                <FormattedMessage id='sfoxmicrodeposits.error' defaultMessage='The amounts entered do not match the deposits. {tryAgain}' values={{ tryAgain: <Link size='13px' weight={300} onClick={tryAgain}><FormattedMessage id='try_again' defaultMessage='Try again.' /></Link> }} />
              </ErrorText>
              : <Button type='submit' nature='primary' onClick={handleSubmit} disabled={invalid}>
                {
                  status === 'loading'
                    ? <HeartbeatLoader height='20px' width='20px' color='white' />
                    : <FormattedMessage id='verify' defaultMessage='Verify' />
                }
              </Button>
          }
        </ButtonRow>
      </ModalBody>
    </Modal>
  )
}

MicroDeposits.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sfoxMicroDeposits' })(MicroDeposits)
