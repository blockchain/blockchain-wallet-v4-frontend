import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validBitcoinAddress } from 'services/FormHelper'
import { Button, Icon, Link, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, FormGroup, FormItem, FormLabel, NumberBox, SelectBoxBitcoinAddresses, SelectBoxCoin, SelectBox, TextBox, TextArea } from 'components/Form'
import { minimumAmount, maximumAmount, minimumFeePerByte, maximumFeePerByte } from './validation'
import QRCodeCapture from 'components/QRCodeCapture'
import RegularFeeLink from './RegularFeeLink'
import PriorityFeeLink from './PriorityFeeLink'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const ColLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 50%;
`
const ColRight = ColLeft.extend`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 50%;
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
const FeeFormContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.toggled ? 'column' : 'row'};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const FeeFormLabel = styled(FormLabel)`
  width: 100%;
  display: flex;
  white-space: nowrap;
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
const FeeOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const FeePerByteContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`

const FirstStep = props => {
  const { invalid, submitting, ...rest } = props
  const { toToggled, feePerByteToggled, feePerByteElements, regularFeePerByte, priorityFeePerByte, isPriorityFeePerByte, ...rest2 } = rest
  const { handleFeePerByteToggle, handleToToggle, handleSubmit } = rest2

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage id='modals.sendbtc.firststep.coin' defaultMessage='Currency:' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage id='modals.sendbtc.firststep.from' defaultMessage='From:' />
          </FormLabel>
          <Field name='from' component={SelectBoxBitcoinAddresses} validate={[required]} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage id='modals.sendbtc.firststep.to' defaultMessage='To:' />
          </FormLabel>
          <Row>
            {toToggled
              ? <Field name='to' placeholder="Paste or scan an address, or select a destination" component={SelectBoxBitcoinAddresses} validate={[required]} />
              : <Field name='to' placeholder="Paste or scan an address, or select a destination" component={TextBox} validate={[required, validBitcoinAddress]} />
            }
            <QRCodeCapture coin='BTC' />
            {toToggled
              ? <AddressButton onClick={handleToToggle}><Icon name='pencil' size='16px' cursor /></AddressButton>
              : <AddressButton onClick={handleToToggle}><Icon name='down-arrow' size='10px' cursor /></AddressButton>
            }
          </Row>
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage id='modals.sendbtc.firststep.amount' defaultMessage='Enter Amount:' />
          </FormLabel>
          <Field name='amount' component={FiatConvertor} validate={[required, minimumAmount, maximumAmount]} coin='BTC' />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage id='modals.sendbtc.firststep.description' defaultMessage='Description:&nbsp;' />
            <Tooltip>
              <FormattedMessage id='modals.sendbtc.firststep.share_tooltip' defaultMessage='Add a note to remind yourself what this transaction relates to. This note will be private and only seen by you.' />
            </Tooltip>
          </FormLabel>
          <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        </FormItem>
      </FormGroup>
      <FormGroup inline margin={'15px'}>
        <ColLeft>
          <FeeFormContainer toggled={feePerByteToggled}>
            <FeeFormLabel>
              <FormattedMessage id='modals.sendbtc.firststep.fee' defaultMessage='Transaction fee:' />
              {!feePerByteToggled && <Field name='feePerByte' component={SelectBox} elements={feePerByteElements} />}
              {feePerByteToggled &&
                <FeeOptionsContainer>
                  <RegularFeeLink fee={regularFeePerByte} />
                  <PriorityFeeLink fee={priorityFeePerByte} />
                </FeeOptionsContainer>
              }
            </FeeFormLabel>
            {feePerByteToggled &&
              <FeePerByteContainer>
                <Field name='feePerByte' component={NumberBox} validate={[required, minimumFeePerByte, maximumFeePerByte]} />
              </FeePerByteContainer>
            }
          </FeeFormContainer>
        </ColLeft>
        <ColRight>
          <Link size='13px' weight={300} capitalize onClick={handleFeePerByteToggle} >
            {feePerByteToggled
              ? <FormattedMessage id='modals.sendbtc.firststep.cancel' defaultMessage='Cancel' />
              : <FormattedMessage id='modals.sendbtc.firststep.edit' defaultMessage='Customize fee' />
            }
          </Link>
        </ColRight>
      </FormGroup>
      <FormGroup>
        <Text size='13px' weight={300}>
          {!isPriorityFeePerByte && <FormattedMessage id='modals.sendbtc.firststep.estimated' defaultMessage='Estimated confirmation time 1+ hour' />}
          {isPriorityFeePerByte && <FormattedMessage id='modals.sendbtc.firststep.estimated' defaultMessage='Estimated confirmation time 0-60 minutes' />}
        </Text>
      </FormGroup>
      <FormGroup>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbtc.firststep.continue' defaultMessage='Continue' />
        </Button>
      </FormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  toToggled: PropTypes.bool.isRequired,
  feePerByteToggled: PropTypes.bool.isRequired,
  feePerByteElements: PropTypes.array.isRequired,
  regularFeePerByte: PropTypes.number.isRequired,
  priorityFeePerByte: PropTypes.number.isRequired,
  isPriorityFeePerByte: PropTypes.bool.isRequired,
  handleFeePerByteToggle: PropTypes.func.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBtc', destroyOnUnmount: false })(FirstStep)
