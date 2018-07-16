import React from 'react'
import { isNil } from 'ramda'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import {
  SelectBoxBitcoinAddresses,
  FormGroup,
  FormItem,
  TextBox
} from 'components/Form'
import {
  optional,
  validBitcoinAddress,
  validBitcoinPrivateKey
} from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { Banner } from 'blockchain-info-components'

const Label = styled.label`
  font-size: 12px;
  margin-bottom: 5px;
`

const validBitcoinPrivateKeyOptional = optional(validBitcoinPrivateKey)

class ImportExternalBitcoinAddress extends React.PureComponent {
  render () {
    return (
      <div>
        <div style={spacing('mb-15')}>
          <Banner type='alert'>
            <FormattedMessage
              id='modals.importbtcaddress.importexternalbitcoinaddress.advanced.message'
              defaultMessage='This is advanced functionality and only suggested for advanced users.'
            />
          </Banner>
        </div>
        <FormGroup>
          <FormItem>
            <Label for='from'>
              <FormattedMessage
                id='modals.importbtcaddress.importexternalbitcoinaddress.bitcoinaddress'
                defaultMessage='Bitcoin Address'
              />
            </Label>
            <Field
              name='address'
              validate={[validBitcoinAddress]}
              component={TextBox}
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem width={'100%'}>
            <Label for='private-key'>
              <FormattedMessage
                id='modals.importbtcaddress.importexternalbitcoinaddress.prvkey'
                defaultMessage='Enter Private Key'
              />
            </Label>
            <Field
              name='priv'
              validate={[validBitcoinPrivateKeyOptional]}
              component={TextBox}
            />
          </FormItem>
          <FormItem style={spacing('mt-10')} width={'50%'}>
            <Label for='wallets'>
              <FormattedMessage
                id='modals.importbtcaddress.importexternalbitcoinaddress.transfer'
                defaultMessage='Transfer funds to an existing wallet (optional)'
              />
            </Label>
            <Field
              name='to'
              component={SelectBoxBitcoinAddresses}
              optional
              excludeImported
              disabled={isNil(this.props.priv)}
            />
          </FormItem>
        </FormGroup>
      </div>
    )
  }
}

export default ImportExternalBitcoinAddress
