import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { required, validBitcoinCashAddress } from 'services/FormHelper'
import { removeWhitespace } from 'services/FormHelper/normalizers'
import {
  Banner,
  Button,
  Icon,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin,
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

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
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
    excludeLockbox,
    excludeHDWallets
  } = props
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const disableLockboxSend =
    isFromLockbox && !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendBch.firststep.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field
            name='coin'
            component={SelectBoxCoin}
            type='send'
            validate={[required]}
          />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage
              id='modals.sendBch.firststep.from'
              defaultMessage='From:'
            />
          </FormLabel>
          <Field
            name='from'
            coin='BCH'
            includeAll={false}
            validate={[required]}
            component={SelectBoxBchAddresses}
            excludeHDWallets={excludeHDWallets}
            excludeLockbox={excludeLockbox}
            excludeWatchOnly
          />
        </FormItem>
      </FormGroup>
      {isFromLockbox && (
        <WarningBanners type='info'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendbch.firststep.warndevice'
              defaultMessage='You will need to connect your Lockbox to complete to this transaction.'
            />
          </Text>
        </WarningBanners>
      )}
      {disableLockboxSend && (
        <WarningBanners type='warning'>
          <Text color='warning' size='12px'>
            <FormattedMessage
              id='modals.sendbch.firststep.warnbrowswer'
              defaultMessage='Sending Bitcoin Cash from Lockbox can only be done while using the Chrome browser!'
            />
          </Text>
        </WarningBanners>
      )}
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendBch.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            {toToggled && (
              <Field
                name='to'
                coin='BCH'
                component={SelectBoxBchAddresses}
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
              scanType='bchAddress'
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
              id='modals.sendbch.firststep.amount'
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
            coin='BCH'
            data-e2e='sendBch'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendBch.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendBch.firststep.share_tooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)"
            data-e2e='sendBchDescription'
            fullwidth
          />
        </FormItem>
      </FormGroup>
      <FormGroup inline margin={'30px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendBch.firststep.txfee'
              defaultMessage='Transaction Fee:'
            />
          </FormLabel>
          <ComboDisplay coin='BCH'>{totalFee}</ComboDisplay>
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          disabled={submitting || invalid || pristine || disableLockboxSend}
        >
          <FormattedMessage
            id='modals.sendBch.firststep.continue'
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
  form: model.components.sendBch.FORM,
  destroyOnUnmount: false,
  shouldError
})(FirstStep)
