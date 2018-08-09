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
  SelectBoxCoin,
  SelectBoxEtherAddresses
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

const RequestEther = props => {
  const { handleSubmit, address } = props

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.requestether.coin'
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
            component={SelectBoxEtherAddresses}
            includeAll={false}
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.requestether.share'
              defaultMessage='Copy & Share Address:'
            />
            <TooltipHost id='reqEthShare'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
        </FormItem>
        <AddressContainer>
          <CopyClipboard address={address} />
        </AddressContainer>
      </FormGroup>
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage id='modals.requestether.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <QRCodeContainer>
        <ScanMessage>
          <Text size='14px'>
            <FormattedMessage
              id='modals.requestether.scan'
              defaultMessage='Scan QR Code:'
            />
            <TooltipHost id='reqEthScan'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </ScanMessage>
        <QRCodeReact value={address} size={150} />
      </QRCodeContainer>
      <Button type='submit' nature='primary' fullwidth uppercase>
        <FormattedMessage id='modals.requestether.done' defaultMessage='Done' />
      </Button>
    </Form>
  )
}

RequestEther.propTypes = {
  address: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestEther', destroyOnUnmount: false })(
  RequestEther
)
