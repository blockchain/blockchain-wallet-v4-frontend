import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validBitcoinAddress } from 'services/FormHelper'
import { Button, Icon, Link, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, FormGroup, FormItem, FormLabel, NumberBox, SelectBoxBitcoinAddresses, SelectBoxCoin, SelectBox, TextBox, TextArea } from 'components/Form'
import { minimumAmount, maximumAmount, emptyAmount } from './services'
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

// const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
//   if (initialRender) { return true }
//   return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
// }

const FirstStep = props => {
  const { invalid, submitting, ...rest } = props
  const { toToggled, feePerByteToggled, feePerByteElements, handleFeePerByteToggle, handleToToggle, handleSubmit } = rest

  // const renderFeeConfirmationTime = () => {
  //   if (parseInt(fee) === parseInt(regular)) {
  //     return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated' defaultMessage='Estimated confirmation time 1+ hour' />)
  //   } else return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated2' defaultMessage='Estimated confirmation time 0-60 minutes' />)
  // }

  return (
    <Form onSubmit={handleSubmit}>
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
            {toToggled
              ? <Field name='to' component={SelectBoxBitcoinAddresses} validate={[required]} />
              : <Field name='to' component={TextBox} validate={[required, validBitcoinAddress]} />
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
            <FormattedMessage id='modals.requestbitcoin.firststep.amount' defaultMessage='Enter Amount:' />
          </FormLabel>
          <Field name='amount' component={FiatConvertor} validate={[required, minimumAmount, maximumAmount, emptyAmount]} coin='BTC' />
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
            <FeeFormLabel flexEnd={feePerByteToggled}>
              <FormattedMessage id='modals.sendbitcoin.firststep.fee' defaultMessage='Transaction fee:' />
              { feePerByteToggled
                ? <Field name='feePerByte' component={NumberBox} validate={[required]} />
                : <Field name='feePerByte' component={SelectBox} elements={feePerByteElements} />
              }
              {/* {feeToggled
                ? <FeeContainer>
                  <RowFlexEnd>
                    <Link weight={300} size='12px' onClick={() => props.customFeeHandler(regular)}>Reg: {regular}</Link>
                    <Link weight={300} size='12px' onClick={() => props.customFeeHandler(priority)}>Priority: {priority}</Link>
                  </RowFlexEnd>
                </FeeContainer>
                : <Field name='fee' inline component={NativeSelect} validate={[required]}>
                   <option value={regular}>Regular</option>
                   <option value={priority}>Priority</option>
                </Field>
              } */}
            </FeeFormLabel>
          </FeeFormContainer>
          {/* {
            feeToggled && <FeeField name='fee' component={NumberBox} validate={[required]} hideErrors />
          }
          {
            !feeToggled && <Text size='12px' weight={300}>{renderFeeConfirmationTime()}</Text>
          }
          {
            feeToggled && fee < limits.min && <FeeError size='12px' weight={300} color={'error'} onClick={() => props.customFeeHandler(limits.min)}>
              <FormattedMessage id='modals.sendbitcoin.firststep.feebelowmin' defaultMessage='{min} sat/b or more is recommended' values={{min: limits.min}} />
            </FeeError>
          }
          {
            feeToggled && fee > limits.max && <FeeError size='12px' weight={300} color={'error'} onClick={() => props.customFeeHandler(limits.max)}>
              <FormattedMessage id='modals.sendbitcoin.firststep.feeabovemax' defaultMessage='{max} sat/b or less is recommended' values={{max: limits.max}} />
            </FeeError>
          } */}
        </ColLeft>
        <ColRight>
          <CustomizeFeeLink onClick={handleFeePerByteToggle} size='13px' weight={300} uppercase>
            {feePerByteToggled
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
  // invalid: PropTypes.bool.isRequired,
  // submitting: PropTypes.bool.isRequired,
  // addressSelectToggled: PropTypes.bool.isRequired,
  // addressSelectOpened: PropTypes.bool.isRequired,
  // feeEditToggled: PropTypes.bool.isRequired,
  // totalFee: PropTypes.number,
  // fee: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // handleClickAddressToggler: PropTypes.func.isRequired,
  // handleClickFeeToggler: PropTypes.func.isRequired
}

export default reduxForm({ form: 'sendBtc', destroyOnUnmount: false })(FirstStep)
