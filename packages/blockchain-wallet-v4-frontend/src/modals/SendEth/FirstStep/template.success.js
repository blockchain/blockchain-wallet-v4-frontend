import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validEtherAddress } from 'services/FormHelper'
import {
  Button,
  Text,
  Icon,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxCoin,
  SelectBoxEtherAddresses,
  TextBox,
  TextAreaDebounced
} from 'components/Form'
import { invalidAmount, insufficientFunds, maximumAmount } from './validation'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'

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

  &:hover {
    background-color: ${props => props.theme['gray-1']};
  }
`
const FirstStep = props => {
  const {
    pristine,
    invalid,
    submitting,
    fee,
    handleSubmit,
    unconfirmedTx,
    destination,
    toToggled,
    enableToggle,
    handleToToggle,
    from,
    isContract
  } = props
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendether.firststep.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage
              id='modals.sendEther.firststep.from'
              defaultMessage='From:'
            />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxEtherAddresses}
            includeAll={false}
            validate={[required]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendether.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            {toToggled && (
              <Field
                name='to'
                component={SelectBoxEtherAddresses}
                disabled={unconfirmedTx}
                opened
                onFocus={() => handleToToggle()}
                includeAll={false}
                exclude={[from.label]}
                validate={[required]}
                hideErrors
              />
            )}
            {!toToggled && (
              <Field
                name='to'
                placeholder='Paste or scan an address, or select a destination'
                disabled={unconfirmedTx}
                component={TextBox}
                validate={[required, validEtherAddress]}
                autoFocus
              />
            )}
            {(!toToggled || destination) &&
              !unconfirmedTx && (
                <QRCodeCapture
                  scanType='ethAddress'
                  border={
                    enableToggle
                      ? ['top', 'bottom']
                      : ['top', 'bottom', 'right']
                  }
                />
              )}
            {enableToggle &&
              (!toToggled || destination) && (
                <AddressButton onClick={() => handleToToggle(true)}>
                  <Icon name='down-arrow' size='10px' cursor />
                </AddressButton>
              )}
          </Row>
          {unconfirmedTx && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendeth.unconfirmedtransactionmessage'
                defaultMessage='Please wait until your previous transaction confirms.'
              />
            </Text>
          )}
          {isContract && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendeth.contractaddr'
                defaultMessage='Sending to contract addresses is disabled.'
              />
            </Text>
          )}
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage
              id='modals.sendether.firststep.amount'
              defaultMessage='Enter amount:'
            />
          </FormLabel>
          <Field
            name='amount'
            disabled={unconfirmedTx}
            component={FiatConvertor}
            coin='ETH'
            validate={[invalidAmount, insufficientFunds, maximumAmount]}
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='description'>
            <FormattedMessage
              id='modals.sendether.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendether.firststep.sharetooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for?"
            fullwidth
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'30px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendether.firststep.fee'
              defaultMessage='Transaction Fee :'
            />
          </FormLabel>
          <ComboDisplay size='14px' coin='ETH'>
            {fee}
          </ComboDisplay>
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          uppercase
          disabled={pristine || submitting || invalid || isContract}
        >
          <FormattedMessage
            id='modals.sendether.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </FormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fee: PropTypes.string.isRequired,
  effectiveBalance: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  toToggled: PropTypes.bool.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  unconfirmedTx: PropTypes.bool
}

export default reduxForm({ form: 'sendEth', destroyOnUnmount: false })(
  FirstStep
)
