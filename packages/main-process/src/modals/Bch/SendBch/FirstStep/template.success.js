import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { required, validBchAddress } from 'services/FormHelper'
import {
  Banner,
  Button,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin,
  TextAreaDebounced
} from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  shouldError,
  insufficientFunds,
  maximumAmount,
  invalidAmount
} from './validation'
import { Row } from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`

const FirstStep = props => {
  const {
    from,
    invalid,
    submitting,
    handleSubmit,
    totalFee,
    pristine,
    excludeLockbox,
    excludeHDWallets
  } = props
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isBrowserSupported = browser.satisfies(
    model.components.lockbox.supportedBrowsers
  )
  const disableLockboxSend = isFromLockbox && !isBrowserSupported

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendBch.firststep.currency'
              defaultMessage='Currency'
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
              id='modals.sendBch.firststep.fromwallet'
              defaultMessage='From'
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
      {isFromLockbox && !disableLockboxSend && (
        <WarningBanners type='info'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendbch.firststep.lockboxwarn'
              defaultMessage='You will need to connect your Lockbox to complete this transaction.'
            />
          </Text>
        </WarningBanners>
      )}
      {disableLockboxSend && (
        <WarningBanners type='warning'>
          <Text color='warning' size='12px'>
            <FormattedMessage
              id='modals.sendbch.firststep.blockbrowser'
              defaultMessage='Sending Bitcoin Cash from Lockbox can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
            />
          </Text>
        </WarningBanners>
      )}
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendBch.firststep.towallet'
              defaultMessage='To'
            />
          </FormLabel>
          <Row>
            <Field
              name='to'
              placeholder='Paste, scan, or select destination'
              component={SelectBoxBchAddresses}
              dataE2e='sendBchAddressInput'
              validate={[required, validBchAddress]}
              exclude={[from.label]}
              openMenuOnClick={false}
              includeAll={false}
              isCreatable
              noOptionsMessage={() => null}
              isValidNewOption={() => false}
            />
            <QRCodeCapture
              scanType='bchAddress'
              border={['top', 'bottom', 'right']}
            />
          </Row>
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage
              id='modals.sendbch.firststep.sendamount'
              defaultMessage='Amount'
            />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConverter}
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
              id='modals.sendBch.firststep.desc'
              defaultMessage='Description'
            />
            <TooltipHost id='sendBch.firststep.share_tooltip'>
              <TooltipIcon name='question-in-circle' size='12px' />
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
              id='modals.sendBch.firststep.networkfee'
              defaultMessage='Network Fee'
            />
          </FormLabel>
          <ComboDisplay size='13px' coin='BCH'>
            {totalFee}
          </ComboDisplay>
        </FormItem>
      </FormGroup>
      <SubmitFormGroup>
        <Button
          type='submit'
          nature='primary'
          height='56px'
          size='18px'
          disabled={submitting || invalid || pristine || disableLockboxSend}
          data-e2e='bchSendContinue'
        >
          <FormattedMessage
            id='modals.sendBch.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalFee: PropTypes.string.isRequired
}

export default reduxForm({
  form: model.components.sendBch.FORM,
  destroyOnUnmount: false,
  shouldError
})(FirstStep)
