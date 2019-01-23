import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeWrapper from 'components/QRCodeWrapper'

import { required } from 'services/FormHelper'
import {
  Banner,
  Button,
  Separator,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin
} from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 5px;
  width: 100%;
`
const ScanMessage = styled.div`
  padding-bottom: 20px;
`
const BannerContainer = styled.div`
  margin-top: 5px;
  .link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme['brrand-primary']};
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

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
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
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.requestbch.firststep.to'
              defaultMessage='Receive to:'
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
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestbch.share'
              defaultMessage='Copy & Share Address: '
            />
            <TooltipHost id='reqBchShare'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} data-e2e='requestBch' />
          </AddressContainer>
        </FormItem>
      </FormGroup>
      {type === 'LOCKBOX' && (
        <BannerContainer onClick={handleOpenLockbox}>
          <Banner type='alert'>
            <FormattedHTMLMessage
              id='modals.requestbch.firststep.lockbox'
              defaultMessage='Please confirm this address on your lockbox device by opening your Bitcoin Cash app. On your device the address will be displayed in the legacy format {legacyAddress}. <span class="link">Click here</span> once the Bitcoin Cash app has been opened.'
              values={{ legacyAddress }}
            />
          </Banner>
        </BannerContainer>
      )}
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage id='modals.requestbch.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requestbch.scan'
              defaultMessage='Scan QR Code:'
            />
            <TooltipHost id='reqBchQR'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </ScanMessage>
        <QRCodeWrapper value={receiveAddress} size={150} />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        disabled={submitting || invalid}
        data-e2e='requestBchDoneButton'
      >
        <FormattedMessage id='modals.requestbch.done' defaultMessage='Done' />
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
