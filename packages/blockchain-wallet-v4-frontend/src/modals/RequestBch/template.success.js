import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeReact from 'qrcode.react'

import { required } from 'services/FormHelper'
import {
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
  SelectBoxBitcoinAddresses,
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

const RequestBch = props => {
  const { submitting, invalid, handleSubmit, receiveAddress } = props

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
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.requestbitcoin.firststep.to'
              defaultMessage='Receive to:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxBitcoinAddresses}
            includeAll={false}
            validate={[required]}
            coin='BCH'
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
            <CopyClipboard address={receiveAddress} />
          </AddressContainer>
        </FormItem>
      </FormGroup>
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
        <QRCodeReact value={receiveAddress} size={150} />
      </QRCodeContainer>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        uppercase
        disabled={submitting || invalid}
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
