import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { validBitcoinAddress } from 'services/FormHelper'
import { Banner } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin-top: 15px;
`
const Info = styled.div`
  font-size: 12px;
  margin-bottom: 15px;
`
const Message = styled.div`
  margin-bottom: 15px;
`
const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
`

class ImportExternalBitcoinAddress extends React.Component {
  render () {
    return (
      <Wrapper>
        <Info>
          <FormattedMessage id='modals.importbitcoinaddress.import.info' defaultMessage='Your wallet automatically creates new bitcoin addresses as it needs them. You can optionally import an existing address generated outside of this wallet and transfer the funds to your wallet if you have the corresponding Private Key.' />
        </Info>
        <Message>
          <Banner type='alert'>
            <FormattedMessage id='modals.importbitcoinaddress.import_external_bitcoin_address.message' defaultMessage='This is an advanced functionality and only suggested for advanced users.' />
          </Banner>
        </Message>
        <FormGroup>
          <FormItem>
            <Label for='address'>
              <FormattedMessage id='modals.importbitcoinaddress.import_external_bitcoin_address.pub_key' defaultMessage='Bitcoin Address' />
            </Label>
            <Field name='address' validate={[validBitcoinAddress]} component={TextBox} />
          </FormItem>
        </FormGroup>
        <FormGroup inline>
          <FormItem width={'60%'}>
            <Label for='private-key'>
              <FormattedMessage id='modals.importbitcoinaddress.import_external_bitcoin_address.prv_key' defaultMessage='Enter Private Key' />
            </Label>
            <Field name='prv' validate={[]} component={TextBox} />
          </FormItem>
          <FormItem width={'40%'}>
            <Label for='wallets'>
              <FormattedMessage id='modals.importbitcoinaddress.import_external_bitcoin_address.prv_key' defaultMessage='Add to an existing wallet (optional)' />
            </Label>
            <Field name='wallet' validate={[]} component={TextBox} />
          </FormItem>
        </FormGroup>
      </Wrapper>
    )
  }
}

export default ImportExternalBitcoinAddress
