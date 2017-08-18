import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, requiredNumber } from 'services/FormHelper'
import { Button, Icon, Image, Link, Modal, Tooltip } from 'blockchain-info-components'
import { CoinConvertor, Form, Hidden, SelectBoxAddresses, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/ComboDisplay'
import SelectBoxFee from './SelectBoxFee'

const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`
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
const AddressesSelectToggle = styled(Icon).attrs({ name: 'icon-down_arrow' })`font-size: 0.6rem;`
const AddressesEditToggle = styled(Icon).attrs({ name: 'ti-pencil' })`font-size: 1rem;`
const AddressesToButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin: 0;
  border-radius: 0;
`

const FirstStep = (props) => {
  const validateAmount = (value, allValues, props) => {
    return value <= allValues.effectiveBalance ? undefined : `Invalid amount. Available : ${allValues.effectiveBalance}`
  }
  const { addressSelectToggled, addressSelectOpened, feeEditToggled, selection, next, invalid, submitting,
    handleClickQrCodeCapture, handleClickAddressToggler, handleClickFeeToggler, ...rest } = props

  return (
    <Modal {...rest} icon='send' title='Send' size='large'>
      <Form>
        <FormattedMessage id='modals.sendbitcoin.firststep.from' defaultMessage='From:' />
        <Field name='from' component={SelectBoxAddresses} validate={[required]} props={{ includeAll: false }} />
        <FormattedMessage id='modals.sendbitcoin.firststep.to' defaultMessage='To:' />
        {addressSelectToggled
          ? (
            <AddressesToContainer>
              <Field name='to' component={SelectBoxAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false }} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><Image name='qr-code' height='18px' /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><AddressesEditToggle /></AddressesToButton>
            </AddressesToContainer>
          ) : (
            <AddressesToContainer>
              <Field name='to' component={TextBox} validate={[required]} />
              <AddressesToButton onClick={handleClickQrCodeCapture}><Image name='qr-code' height='18px' /></AddressesToButton>
              <AddressesToButton onClick={handleClickAddressToggler}><AddressesSelectToggle /></AddressesToButton>
            </AddressesToContainer>
            )
        }
        <FormattedMessage id='modals.sendbitcoin.firststep.amount' defaultMessage='Enter amount:' />
        <Field name='amount' component={CoinConvertor} validate={[requiredNumber, validateAmount]} />
        <Field name='effectiveBalance' component={Hidden} />
        <Aligned>
          <FormattedMessage id='modals.sendbitcoin.firststep.description' defaultMessage='Description:' />
          <Tooltip>
            <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
            <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
          </Tooltip>
        </Aligned>
        <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        <Aligned>
          <FormattedMessage id='modals.sendbitcoin.firststep.fee' defaultMessage='Transaction fee:' />
          <Tooltip>
            <FormattedMessage id='modals.sendbitcoin.firststep.fee_tooltip' defaultMessage='Estimated confirmation time 1+ hour.' />
          </Tooltip>
        </Aligned>
        <Row>
          <ColLeft>
            {feeEditToggled
              ? <Field name='fee' component={TextBox} validate={[required]} />
              : <Field name='fee' component={SelectBoxFee} validate={[required]} />
            }
          </ColLeft>
          <ColRight>
            { invalid ? <div /> : <ComboDisplay small light>{selection.fee}</ComboDisplay> }
            <Link onClick={handleClickFeeToggler} uppercase>
              {feeEditToggled
                ? <FormattedMessage id='modals.sendbitcoin.firststep.cancel' defaultMessage='Cancel' />
                : <FormattedMessage id='modals.sendbitcoin.firststep.edit' defaultMessage='Customize fee' />
              }
            </Link>
          </ColRight>
        </Row>
        <Button nature='secondary' fullwidth onClick={next} disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbitcoin.firststep.continue' defaultMessage='Continue' />
        </Button>
      </Form>
    </Modal>
  )
}

FirstStep.propTypes = {
  addressSelectToggled: PropTypes.bool.isRequired,
  feeEditToggled: PropTypes.bool.isRequired,
  handleClickQrCodeCapture: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired,
  handleClickFeeToggler: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
}

export default FirstStep
