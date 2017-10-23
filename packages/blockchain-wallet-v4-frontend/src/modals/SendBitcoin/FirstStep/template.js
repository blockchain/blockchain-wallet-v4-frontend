import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, ButtonGroup, Icon, Image, Link, Modal, ModalHeader, ModalBody, Text, Tooltip } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBoxAddresses, SelectBoxFee, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/ComboDisplay'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 50%;
`
const AddressesToContainer = styled.div`
  display: flex;
  align-items: center;
`
const AddressesToButton = styled(Button)`
  width: 40px;
  min-width: 0;
  border-radius: 0;
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

// const emptyAmount = (value, allValues, props) => props.coins ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = (props) => {
  const { invalid, submitting, position, total, closeAll, ...rest } = props
  const { addressSelectToggled, addressSelectOpened, feeEditToggled, selection, ...rest2 } = rest
  const { onSubmit, handleClickQrCodeCapture, handleClickAddressToggler, handleClickFeeToggler } = rest2

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='send' onClose={closeAll}>
        <FormattedMessage id='modals.sendbitcoin.firststep.title' defaultMessage='Send' />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.from' defaultMessage='From:' />
          </Text>
          <Field name='from' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.to' defaultMessage='To:' />
          </Text>
          { addressSelectToggled &&
            <AddressesToContainer>
              <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false }} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><Image name='qr-code' height='18px' /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><Icon name='pencil' /></AddressesToButton>
            </AddressesToContainer>
          }
          { !addressSelectToggled &&
            <AddressesToContainer>
              <Field name='to2' component={TextBox} validate={[required]} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><Image name='qr-code' height='18px' /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><Icon name='down-arrow' size='10px' /></AddressesToButton>
            </AddressesToContainer>
          }
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          <Field name='amount' component={CoinConvertor} validate={[required, validAmount]} />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.description' defaultMessage='Description:' />
            <Tooltip>
              <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
              <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
            </Tooltip>
          </Text>
          <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.fee' defaultMessage='Transaction fee (sat/b) :' />
            <Tooltip>
              <FormattedMessage id='modals.sendbitcoin.firststep.fee_tooltip' defaultMessage='Estimated confirmation time 1+ hour.' />
            </Tooltip>
          </Text>
          <Row>
            <ColLeft>
              {feeEditToggled
                ? <Field name='fee' component={TextBox} validate={[required]} />
                : <Field name='fee' component={SelectBoxFee} validate={[required]} />
              }
            </ColLeft>
            <ColRight>
              {invalid ? <div /> : <ComboDisplay>{selection.fee}</ComboDisplay>}
              <Link onClick={handleClickFeeToggler} size='13px' weight={300} uppercase>
                {feeEditToggled
                  ? <FormattedMessage id='modals.sendbitcoin.firststep.cancel' defaultMessage='Cancel' />
                  : <FormattedMessage id='modals.sendbitcoin.firststep.edit' defaultMessage='Customize fee' />
                }
              </Link>
            </ColRight>
          </Row>
          <ButtonRow>
            <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
              <FormattedMessage id='modals.sendbitcoin.firststep.continue' defaultMessage='Continue' />
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
  addressSelectToggled: PropTypes.bool.isRequired,
  addressSelectOpened: PropTypes.bool.isRequired,
  feeEditToggled: PropTypes.bool.isRequired,
  selection: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleClickQrCodeCapture: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired,
  handleClickFeeToggler: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBitcoin', destroyOnUnmount: false, shouldValidate: shouldValidate })(FirstStep)
