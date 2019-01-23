import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { model } from 'data'
import { required, validBitcoinCashAddress } from 'services/FormHelper'
import { removeWhitespace } from 'services/FormHelper/normalizers'
import {
  Button,
  Icon,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBsvAddresses,
  TextBox,
  TextAreaDebounced
} from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  shouldError,
  insufficientFunds,
  maximumAmount,
  invalidAmount
} from './validation'
import { Row, AddressButton } from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'

const FirstStep = props => {
  const {
    from,
    enableToggle,
    destination,
    invalid,
    submitting,
    toToggled,
    handleToToggle,
    handleSubmit,
    totalFee,
    pristine,
    excludeHDWallets
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'100%'}>
          <FormLabel for='from'>
            <FormattedMessage
              id='modals.sendBsv.firststep.from'
              defaultMessage='From:'
            />
          </FormLabel>
          <Field
            name='from'
            coin='BSV'
            includeAll={false}
            validate={[required]}
            component={SelectBoxBsvAddresses}
            excludeHDWallets={excludeHDWallets}
            excludeWatchOnly
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendBsv.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            {toToggled && (
              <Field
                name='to'
                coin='BSV'
                component={SelectBoxBsvAddresses}
                menuIsOpen={!destination}
                exclude={[from.label]}
                validate={[required]}
                includeAll={false}
                hideIndicator
                hideErrors
              />
            )}
            {!toToggled && (
              <Field
                name='to'
                placeholder='Paste or scan an address, or select a destination'
                component={TextBox}
                normalize={removeWhitespace}
                validate={[required, validBitcoinCashAddress]}
                autoFocus
              />
            )}
            <QRCodeCapture
              scanType='bsvAddress'
              border={
                enableToggle ? ['top', 'bottom'] : ['top', 'bottom', 'right']
              }
            />
            {enableToggle ? (
              !toToggled ? (
                <AddressButton onClick={() => handleToToggle()}>
                  <Icon name='down-arrow' size='11px' cursor />
                </AddressButton>
              ) : (
                <AddressButton onClick={() => handleToToggle()}>
                  <Icon name='pencil' size='13px' cursor />
                </AddressButton>
              )
            ) : null}
          </Row>
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage
              id='modals.sendbsv.firststep.amount'
              defaultMessage='Enter Amount:'
            />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConvertor}
            validate={[
              required,
              invalidAmount,
              insufficientFunds,
              maximumAmount
            ]}
            coin='BSV'
            data-e2e='sendBsv'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendBsv.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendBsv.firststep.share_tooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)"
            data-e2e='sendBsvDescription'
            fullwidth
          />
        </FormItem>
      </FormGroup>
      <FormGroup inline margin={'30px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendBsv.firststep.fee'
              defaultMessage='Transaction Fee:'
            />
          </FormLabel>
          <ComboDisplay coin='BSV'>{totalFee}</ComboDisplay>
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          disabled={submitting || invalid || pristine}
        >
          <FormattedMessage
            id='modals.sendBsv.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </FormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  toToggled: PropTypes.bool.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalFee: PropTypes.string.isRequired
}

export default reduxForm({
  form: model.components.sendBsv.FORM,
  destroyOnUnmount: false,
  shouldError
})(FirstStep)
