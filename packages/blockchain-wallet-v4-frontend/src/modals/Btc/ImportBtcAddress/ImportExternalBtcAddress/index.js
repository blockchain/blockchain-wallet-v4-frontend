import { Banner } from 'blockchain-info-components'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import {
  FormGroup,
  FormItem,
  SelectBoxBtcAddresses,
  TextBox
} from 'components/Form'
import {
  isSegwitAddress,
  required,
  validBtcAddressOrPrivateKey
} from 'services/FormHelper'
import { removeWhitespace } from 'services/FormHelper/normalizers'
import { spacing } from 'services/StyleService'
import QRCodeCapture from 'components/QRCodeCapture'
import React from 'react'
import styled from 'styled-components'

const Label = styled.label`
  font-size: 12px;
  margin-bottom: 5px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`

class ImportExternalBtcAddress extends React.PureComponent {
  render () {
    return (
      <div>
        <div style={spacing('mb-15')}>
          <Banner type='alert' data-e2e='advancedFunctionalityBadge'>
            <FormattedMessage
              id='modals.importbtcaddress.importexternalbitcoinaddress.advanced.message'
              defaultMessage='This is advanced functionality and only suggested for advanced users.'
            />
          </Banner>
        </div>
        <FormGroup>
          <FormItem width={'100%'}>
            <Label for='addrOrPriv'>
              <FormattedMessage
                id='modals.importbtcaddress.importexternalbitcoinaddress.bitcoineither'
                defaultMessage='Enter bitcoin address or private key'
              />
            </Label>
            <Row>
              <Field
                name='addrOrPriv'
                validate={[
                  validBtcAddressOrPrivateKey,
                  required,
                  isSegwitAddress
                ]}
                normalize={removeWhitespace}
                component={TextBox}
                data-e2e='addressOrPrKeyInput'
              />
              <QRCodeCapture
                scanType='btcPrivOrAddress'
                border={['top', 'bottom', 'right']}
              />
            </Row>
          </FormItem>
          <FormItem width={'100%'}>
            <Label for='addrOrPriv'>
              <FormattedMessage
                id='modals.importbtcaddress.importexternalbitcoinaddress.label'
                defaultMessage='Enter a label (optional)'
              />
            </Label>
            <Row>
              <Field
                name='label'
                validate={[]}
                normalize={removeWhitespace}
                component={TextBox}
                data-e2e='labelInput'
              />
            </Row>
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
              component={SelectBoxBtcAddresses}
              optional
              excludeImported
              includeAll={false}
              disabled={!this.props.priv}
            />
          </FormItem>
        </FormGroup>
      </div>
    )
  }
}

export default ImportExternalBtcAddress
