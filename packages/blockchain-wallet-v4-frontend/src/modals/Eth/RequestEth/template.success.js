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
  SelectBoxEthAddresses
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

const RequestEth = props => {
  const {
    address,
    coin,
    excludeLockbox,
    handleSubmit,
    handleOpenLockbox,
    type
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
              id='modals.requesteth.coin'
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
              id='modals.requesteth.firststep.receive'
              defaultMessage='Receive To:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxEthAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
            coin={coin}
          />
        </FormItem>
      </FormGroup>
      {isLockboxAcct && (
        <BannerContainer>
          <Banner type='info'>
            {warnLockboxReceive ? (
              <Text color='warning' size='12px'>
                <FormattedHTMLMessage
                  id='modals.requesteth.firststep.lockbox.confirm.warnbrowser'
                  defaultMessage='Unsupported browser to confirm the receive address on your Lockbox.  Please use the Brave, Chrome, Firefox or Opera browsers to confirm or continue without confirming the address at your own risk.'
                />
              </Text>
            ) : (
              <TextGroup inline>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requesteth.firststep.lockbox.confirm1'
                    defaultMessage='Please confirm the address above on your Lockbox by opening your Ethereum app now.'
                  />
                </Text>
                <Text size='12px' onClick={handleOpenLockbox}>
                  <span className='link'>
                    <FormattedHTMLMessage
                      id='modals.requesteth.firststep.lockbox.clickhere'
                      defaultMessage='Click here'
                    />
                  </span>
                </Text>
                <Text color='warning' size='12px'>
                  <FormattedHTMLMessage
                    id='modals.requesteth.firststep.lockbox.confirm2'
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
          value={address}
          size={125}
          data-e2e='requestEthAddressQrCode'
        />
      </QRCodeContainer>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requesteth.address'
              defaultMessage='Address:'
            />
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} data-e2e='requestEth' coin={coin} />
        </AddressContainer>
      </FormGroup>
      <Button
        type='submit'
        nature='primary'
        data-e2e='requestEthDoneButton'
        fullwidth
      >
        <FormattedMessage id='buttons.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestEth.propTypes = {
  address: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestEth', destroyOnUnmount: false })(
  RequestEth
)
