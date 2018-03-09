import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validBitcoinAddress } from 'services/FormHelper'
import { Button, ButtonGroup, Icon, Link, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, SelectBoxBitcoinAddresses, SelectBoxCoin, SelectBoxFee, TextBox, TextArea } from 'components/Form'
import ComboDisplay from 'components/Display/ComboDisplay'
import QRCodeCapture from 'components/QRCodeCapture'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const ColOne = styled.div`
  width: 50%;
  margin-right: 5px;
  @media(min-width: 992px) { width: 30%; }
`
const ColTwo = styled.div`
  width: 50%;
  @media(min-width: 992px) { width: 70%; }
`
const ColLeft = styled.div`
  width: 50%;
  div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-contenet: space-between;
  }
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
const ButtonRow = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  & > button:first-child { width: 100%; }
  & > button:last-child: { width: 200px; }
`

const DescriptionText = styled.div`
  margin-top: 20px;
`

const AmountText = styled.div`
  margin-top: 20px;
`

const Unit = styled.span`
  position: absolute;
  padding: 0 15px;
  color: ${props => props.theme['gray-4']};
  bottom: 95px;
  left: 240px;
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

const SelectFeeContainer = styled.div`
  width: 150px;
`

const CustomizeFeeLink = styled(Link)`
  margin-top: 10px;
  font-size: 12px;
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
  const priority = props.fees.priority.data
  const regular = props.fees.regular.data

  const renderFeeConfirmationTime = () => {
    if (fee === regular) {
      return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated' defaultMessage='Estimated confirmation time 1+ hour' />)
    } else return (<FormattedMessage id='modals.sendbitcoin.firststep.estimated' defaultMessage='Estimated confirmation time 0-60 minutes' />)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <ColOne>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.coin' defaultMessage='Currency:' />
          </Text>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </ColOne>
        <ColTwo>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.firststep.from' defaultMessage='From:' />
          </Text>
          <Field name='from' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false }} />
        </ColTwo>
      </Row>
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.sendbitcoin.firststep.to' defaultMessage='To:' />
      </Text>
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
      <AmountText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendbitcoin.firststep.amount' defaultMessage='Enter amount:' />
        </Text>
      </AmountText>
      <Field name='amount' component={FiatConvertor} validate={[required, validAmount, emptyAmount]} coin='BTC' maxAvailable={props.effectiveBalance} />
      <DescriptionText>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendbitcoin.firststep.description' defaultMessage='Description:' />
          <Tooltip>
            <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip1' defaultMessage='Add a note to remind yourself what this transaction relates to.' />
            <FormattedMessage id='modals.sendbitcoin.firststep.share_tooltip2' defaultMessage='This note will be private and only seen by you.' />
          </Tooltip>
        </Text>
      </DescriptionText>
      <Field name='message' component={TextArea} placeholder="What's this transaction for?" fullwidth />
      <Row>
        <ColLeft>
          <div>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.sendbitcoin.firststep.fee' defaultMessage='Transaction fee:' />
            </Text>
            {feeEditToggled
              ? <FeeContainer>
                <RowFlexEnd>
                  <Link weight={300} size={'12px'} onClick={() => props.customFeeHandler(regular)}>Reg: {regular}</Link>
                  <Link weight={300} size={'12px'} onClick={() => props.customFeeHandler(priority)}>Priority: {priority}</Link>
                </RowFlexEnd>
                {/* TODO: high and low limits for fee input */}
                <Field name='fee' component={TextBox} validate={[required]} />
                <Unit>sat/b</Unit>
              </FeeContainer>
              : <SelectFeeContainer>
                <Field name='fee' component={SelectBoxFee} validate={[required]} />
              </SelectFeeContainer>
            }
          </div>
          {feeEditToggled
            ? ''
            : <Text size={'12px'} weight={300}>
              {renderFeeConfirmationTime()}
            </Text>}
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
      </Row>
      <ButtonRow>
        <Button type='submit' nature='primary' uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.sendbitcoin.firststep.continue' defaultMessage='Continue' />
        </Button>
      </ButtonRow>
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
