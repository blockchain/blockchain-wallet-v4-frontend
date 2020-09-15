import { Field, reduxForm } from 'redux-form'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import Bowser from 'bowser'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Banner, Button, Text, TextGroup } from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin
} from 'components/Form'
import { model } from 'data'
import { required } from 'services/FormHelper'
import CopyClipboard from 'components/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 25px;
  width: 100%;
`
const BannerContainer = styled.div`
  margin-top: 8px;
`
const LockboxInstructions = styled.div`
  & > :last-child {
    margin-top: 4px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
  }
`
const LockboxOpen = styled(TextGroup)`
  font-size: 12px;
  color: ${props => props.theme['warning']};
  *.link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme.blue900};
  }
`

const RequestBch = props => {
  const {
    submitting,
    invalid,
    handleSubmit,
    receiveAddress,
    handleOpenLockbox,
    legacyAddress,
    type,
    excludeLockbox
  } = props

  const isLockboxAcct = type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const warnLockboxReceive = !browser.satisfies(
    model.components.lockbox.supportedBrowsers
  )

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormItem data-e2e='currencySelectDropdown'>
          <FormLabel htmlFor='coin'>
            <FormattedMessage
              id='modals.sendbch.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field
            name='coin'
            component={SelectBoxCoin}
            type='request'
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem data-e2e='receiveToWalletDropdown'>
          <FormLabel htmlFor='to'>
            <FormattedMessage
              id='modals.requestbch.firststep.receive'
              defaultMessage='Receive To:'
            />
          </FormLabel>
          <Field
            name='to'
            coin='BCH'
            component={SelectBoxBchAddresses}
            excludeLockbox={excludeLockbox}
            includeAll={false}
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requestbch.firststep.lockbox.confirm.warnbrowser'
                  defaultMessage='Unsupported browser to confirm the receive address on your Lockbox.  Please use the Brave, Chrome, Firefox or Opera browsers to confirm or continue without confirming the address at your own risk.'
                />
              </Text>
            ) : (
              <LockboxInstructions>
                <LockboxOpen inline>
                  <Text color='warning' size='12px'>
                    <FormattedHTMLMessage
                      id='modals.requestbch.firststep.lockbox.confirmfirst'
                      defaultMessage='Please confirm the legacy address below on your Lockbox by opening your Bitcoin Cash app now.'
                    />
                  </Text>
                  <Text size='12px' onClick={handleOpenLockbox}>
                    <span className='link'>
                      <FormattedHTMLMessage
                        id='modals.requestbch.firststep.lockbox.clickhere'
                        defaultMessage='Click here'
                      />
                    </span>
                  </Text>
                  <Text color='warning' size='12px'>
                    <FormattedHTMLMessage
                      id='modals.requestbch.firststep.lockbox.confirm2'
                      defaultMessage='once the app has been opened.'
                    />
                  </Text>
                </LockboxOpen>
                <Text color='warning'>{legacyAddress}</Text>
              </LockboxInstructions>
            )}
          </Banner>
        </BannerContainer>
      )}
      <QRCodeContainer>
        <QRCodeWrapper
          value={receiveAddress}
          size={125}
          data-e2e='requestBchAddressQrCode'
        />
      </QRCodeContainer>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestbch.address'
              defaultMessage='Address:'
            />
          </FormLabel>
          <AddressContainer>
            <CopyClipboard
              address={receiveAddress}
              data-e2e='requestBch'
              coin='BCH'
            />
          </AddressContainer>
        </FormItem>
      </FormGroup>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        disabled={submitting || invalid}
        data-e2e='requestBchDoneButton'
      >
        <FormattedMessage id='buttons.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestBch.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBch', destroyOnUnmount: false })(
  RequestBch
)
