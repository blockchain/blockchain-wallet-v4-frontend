import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validBitcoinCashAddress } from 'services/FormHelper'
import { Button, Icon, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, FormGroup, FormItem, FormLabel, SelectBoxBitcoinAddresses, SelectBoxCoin, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import QRCodeCapture from 'components/QRCodeCapture'
import { Exchange } from 'blockchain-wallet-v4/src'

const DUST = 546
const bchMinRequired = Exchange.convertBchToBch({ value: DUST, fromUnit: 'SAT', toUnit: 'BCH' })

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const AddressButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  &:hover { background-color: ${props => props.theme['gray-1']}; }
`

const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}

const minRequired = (value, allValues, props) => parseFloat(props.values.amount) >= bchMinRequired.value ? undefined : `The minimum amount required to send is ${bchMinRequired.value} ${bchMinRequired.unit.symbol}.`
const validAmount = (value, allValues, props) => parseFloat(value) <= props.effectiveBalance ? undefined : `Use total available minus fee: ${props.effectiveBalance} BCH.`
const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = props => {
  const { invalid, submitting, addressSelectToggled, addressSelectOpened, selection, fee, ...rest } = props
  const { handleSubmit, handleClickAddressToggler } = rest

  return (
    <Form override onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage id='modals.sendbch.firststep.coin' defaultMessage='Currency:' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage id='modals.sendbch.firststep.from' defaultMessage='From:' />
          </FormLabel>
          <Field name='from' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false, coin: 'BCH' }} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage id='modals.sendbch.firststep.to' defaultMessage='To:' />
          </FormLabel>
          <Row>
            {addressSelectToggled
              ? <Field name='to' placeholder="Paste or scan an address, or select a destination" component={SelectBoxBitcoinAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false, coin: 'BCH' }} />
              : <Field name='to2' placeholder="Paste or scan an address, or select a destination" component={TextBox} validate={[required, validBitcoinCashAddress]} />
            }
            <QRCodeCapture coin='BCH' />
            {addressSelectToggled
              ? <AddressButton onClick={handleClickAddressToggler}><Icon name='pencil' size='16px' cursor /></AddressButton>
              : <AddressButton onClick={handleClickAddressToggler}><Icon name='down-arrow' size='10px' cursor /></AddressButton>
            }
          </Row>
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage id='modals.sendbch.firststep.amount' defaultMessage='Enter amount:' />
          </FormLabel>
        </FormItem>
        <Field name='amount' component={FiatConvertor} validate={[required, minRequired, validAmount, emptyAmount]} coin='BCH' minRequired={bchMinRequired.value} maxAvailable={props.effectiveBalance} />
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='message'>
            <FormattedMessage id='modals.sendbch.firststep.description' defaultMessage='Description:&nbsp;' />
            <Tooltip>
              <FormattedMessage id='modals.sendbch.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
              <FormattedMessage id='modals.sendbch.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
            </Tooltip>
          </FormLabel>
          <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'30px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage id='modals.sendbch.firststep.fee' defaultMessage='Transaction Fee (sat/b):&nbsp;' />
            <Tooltip>
              <FormattedMessage id='modals.sendbch.firststep.fee_tooltip' defaultMessage='Estimated confirmation time 1+ hour.' />
            </Tooltip>
          </FormLabel>
          <ComboDisplay size={'14px'} coin='BCH'>{fee}</ComboDisplay>
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbch.firststep.continue' defaultMessage='Continue' />
        </Button>
      </FormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  addressSelectToggled: PropTypes.bool.isRequired,
  addressSelectOpened: PropTypes.bool.isRequired,
  // selection: PropTypes.object.isRequired,
  fee: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBch', shouldValidate, destroyOnUnmount: false })(FirstStep)
