import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validBitcoinAddress } from 'services/FormHelper'
import { Button, Icon, Link, NativeSelect, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, FormGroup, FormItem, FormLabel, NumberBox, SelectBoxBitcoinAddresses, SelectBoxCoin, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import QRCodeCapture from 'components/QRCodeCapture'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const ColLeft = styled.div`
  width: 50%;
  position: relative;
`
const ColRight = ColLeft.extend`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const FeeContainer = styled.div`
  display: flex;  
  flex-direction: column;
  width: 150px;
`
const RowFlexEnd = Row.extend`
  justify-content: flex-end;
  a:first-child {
    padding-right: 8px;
  }
`
const CustomizeFeeLink = styled(Link)`
  margin-top: 5px;
  font-size: 12px;
`
const FeeFormLabel = styled(FormLabel)`
  width: 100%;
  display: flex;
  white-space: nowrap;
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: ${props => props.flexEnd ? 'flex-end' : 'center'};
  }
`
const FeeField = styled(Field)`
  margin-top: 5px;
`
const FeeError = styled(Text)`
  bottom: -18px;
  cursor: pointer;
  position: absolute;
`

const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}

const validAmount = (value, allValues, props) => parseFloat(value) <= props.effectiveBalance ? undefined : `Use total available minus fee: ${props.effectiveBalance}`

const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'

const FirstStep = props => {
  const { invalid, submitting, addressSelectToggled, addressSelectOpened, feeEditToggled, selection, fee, totalFee, ...rest } = props
  const { handleSubmit, handleClickAddressToggler, handleClickFeeToggler } = rest
  const limits = props.fees.limits.data
  const regular = props.fees.regular.data
  const priority = props.fees.priority.data

  const renderFeeConfirmationTime = () => {
    if (parseInt(fee) === parseInt(regular)) {
      return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated' defaultMessage='Estimated confirmation time 1+ hour' />)
    } else return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated' defaultMessage='Estimated confirmation time 0-60 minutes' />)
  }

  return (
    <Form override onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage id='modals.sendbitcoin.firststep.coin' defaultMessage='Currency:' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage id='modals.sendbitcoin.firststep.from' defaultMessage='From:' />
          </FormLabel>
          <Field name='from' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false }} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage id='modals.sendbitcoin.firststep.to' defaultMessage='To:' />
          </FormLabel>
          <Row>
            {addressSelectToggled
              ? <Field name='to' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ opened: addressSelectOpened, includeAll: false }} />
              : <Field name='to2' component={TextBox} validate={[required, validBitcoinAddress]} />
            }
            <QRCodeCapture coin='BTC' />
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
            <FormattedMessage id='modals.requestbitcoin.firststep.amount' defaultMessage='Enter Amount:' />
          </FormLabel>
          <Field name='amount' component={FiatConvertor} validate={[required, validAmount, emptyAmount]} coin='BTC' maxAvailable={props.effectiveBalance} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage id='modals.sendbitcoin.firststep.description' defaultMessage='Description:&nbsp;' />
            <Tooltip>
              <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
              <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
            </Tooltip>
          </FormLabel>
          <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        </FormItem>
      </FormGroup>
      <FormGroup inline margin={'30px'}>
        <ColLeft>
          <FeeFormContainer>
            <FeeFormLabel flexEnd={feeEditToggled}>
              <FormattedMessage id='modals.sendbitcoin.firststep.fee' defaultMessage='Transaction fee:' />
              {feeEditToggled
                ? <FeeContainer>
                  <RowFlexEnd>
                    <Link weight={300} size={'12px'} onClick={() => props.customFeeHandler(regular)}>Reg: {regular}</Link>
                    <Link weight={300} size={'12px'} onClick={() => props.customFeeHandler(priority)}>Priority: {priority}</Link>
                  </RowFlexEnd>
                </FeeContainer>
                : <Field name='fee' inline component={NativeSelect} validate={[required]}>
                  <option value={regular}>Regular</option>
                  <option value={priority}>Priority</option>
                </Field>
              }
            </FeeFormLabel>
          </FeeFormContainer>
          {
            feeEditToggled && <FeeField name='fee' component={NumberBox} validate={[required]} />
          }
          {
            !feeEditToggled && <Text size={'12px'} weight={300}>{renderFeeConfirmationTime()}</Text>
          }
          {
            feeEditToggled && fee < limits.min && <FeeError size={'12px'} weight={300} color={'error'} onClick={() => props.customFeeHandler(limits.min)}>
              <FormattedMessage id='modals.sendbitcoin.firststep.feebelowmin' defaultMessage='{min} sat/b or more is recommended' values={{min: limits.min}} />
            </FeeError>
          }
          {
            feeEditToggled && fee > limits.max && <FeeError size={'12px'} weight={300} color={'error'} onClick={() => props.customFeeHandler(limits.max)}>
              <FormattedMessage id='modals.sendbitcoin.firststep.feeabovemax' defaultMessage='{max} sat/b or less is recommended' values={{max: limits.max}} />
            </FeeError>
          }
        </ColLeft>
        <ColRight>
          <ComboDisplay coin='BTC'>{totalFee}</ComboDisplay>
          <CustomizeFeeLink onClick={handleClickFeeToggler} size='13px' weight={300} uppercase>
            {feeEditToggled
              ? <FormattedMessage id='modals.sendbitcoin.firststep.cancel' defaultMessage='Cancel' />
              : <FormattedMessage id='modals.sendbitcoin.firststep.edit' defaultMessage='Customize fee' />
            }
          </CustomizeFeeLink>
        </ColRight>
      </FormGroup>
      <FormGroup>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbitcoin.firststep.continue' defaultMessage='Continue' />
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
  feeEditToggled: PropTypes.bool.isRequired,
  totalFee: PropTypes.number,
  fee: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClickAddressToggler: PropTypes.func.isRequired,
  handleClickFeeToggler: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBitcoin', shouldValidate, destroyOnUnmount: false })(FirstStep)
