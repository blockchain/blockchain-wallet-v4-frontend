import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, SelectBoxCoin, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/ComboDisplay'

const Currency = styled.div`
  width: 30%;
`
const ButtonRow = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  & > button:first-child { width: 100%; }
  & > button:last-child: { width: 200px; }
`
const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return (
    initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance
  )
}

const validAmount = (value, allValues, props) => parseFloat(value) <= props.effectiveBalance ? undefined : `Invalid amount. Available : ${props.effectiveBalance}`

const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = (props) => {
  const { invalid, submitting, position, total, closeAll, fee, onSubmit } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='send' onClose={closeAll}>
        <FormattedMessage id='modals.sendethereum.firststep.title' defaultMessage='Send Ethereum' />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <Currency>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.sendethereum.firststep.coin' defaultMessage='Currency:' />
            </Text>
            <Field name='coin' component={SelectBoxCoin} validate={[required]} />
          </Currency>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendethereum.firststep.to' defaultMessage='To:' />
          </Text>
          <Field name='to' component={TextBox} validate={[required]} />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendethereum.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          <Field name='amount' component={FiatConvertor} validate={[required, validAmount, emptyAmount]} coin='ETH' />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendethereum.firststep.description' defaultMessage='Description:' />
            <Tooltip>
              <FormattedMessage id='modals.sendethereum.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
              <FormattedMessage id='modals.sendethereum.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
            </Tooltip>
          </Text>
          <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendethereum.firststep.fee' defaultMessage='Transaction fee :' />
          </Text>
          { fee &&
            <Text weight={300}>
              <ComboDisplay coin='ETH'>{fee}</ComboDisplay>
            </Text>
          }
          <ButtonRow>
            <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
              <FormattedMessage id='modals.sendethereum.firststep.continue' defaultMessage='Continue' />
            </Button>
          </ButtonRow>
        </Form>
      </ModalBody>
    </Modal>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired,
  fee: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  handleClickQrCodeCapture: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendEthereum', destroyOnUnmount: false, shouldValidate: shouldValidate })(FirstStep)
