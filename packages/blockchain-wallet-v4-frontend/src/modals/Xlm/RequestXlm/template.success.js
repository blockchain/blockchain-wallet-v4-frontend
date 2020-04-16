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
  SelectBoxCoin,
  SelectBoxXlmAddresses
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
  *.link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme.blue900};
  }
`

const RequestXlm = ({
  excludeLockbox,
  handleSubmit,
  handleOpenLockbox,
  address,
  xlmURI,
  type
}) => {
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
              id='modals.requestxlm.coin'
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
              id='modals.requestxlm.firststep.receive'
              defaultMessage='Receive To:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxXlmAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
          />
        </FormItem>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requestxlm.lockbox.confirm.warnbrowser'
                  defaultMessage='Unsupported browser to confirm the receive address on your Lockbox.  Please use the Brave, Chrome, Firefox or Opera browsers to confirm or continue without confirming the address at your own risk.'
                />
              </Text>
            ) : (
              <TextGroup inline>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requestxlm.firststep.lockbox.confirm1'
                    defaultMessage='Please confirm the address above on your Lockbox by opening your Stellar app now.'
                  />
                </Text>
                <Text size='12px' onClick={handleOpenLockbox}>
                  <span className='link'>
                    <FormattedHTMLMessage
                      id='modals.requestxlm.firststep.lockbox.clickhere'
                      defaultMessage='Click here'
                    />
                  </span>
                </Text>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requestxlm.firststep.lockbox.confirm2'
                    defaultMessage='once the app has been opened.'
                  />
                </Text>
              </TextGroup>
            )}
          </Banner>
        </BannerContainer>
      )}
      <QRCodeContainer>
        <QRCodeWrapper
          value={xlmURI}
          size={125}
          data-e2e='requestXlmAddressQrCode'
        />
      </QRCodeContainer>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestxlm.address'
              defaultMessage='Address:'
            />
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} data-e2e='requestXlm' coin='XLM' />
        </AddressContainer>
      </FormGroup>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        data-e2e='requestXlmDoneButton'
      >
        <FormattedMessage id='buttons.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestXlm.propTypes = {
  address: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestXlm', destroyOnUnmount: false })(
  RequestXlm
)
