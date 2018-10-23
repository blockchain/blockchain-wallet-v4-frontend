import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { currencySymbolMap } from 'services/CoinifyService'
import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import { BigNumber } from 'bignumber.js'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Text,
  Icon,
  Link
} from 'blockchain-info-components'

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Title = styled(Text)`
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 16px;
`
const Paragraph = styled(Text)`
  font-size: 14px;
  font-weight: 200;
`
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 200;
`
const BackIcon = styled(Icon)`
  font-size: 20px;
  font-weight: 800;
  margin-right: 16px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Bold = styled.b`
  font-weight: 400;
`

const convertXlmToFiat = (rates, currency) => amount =>
  Exchange.convertXlmToFiat({
    value: amount,
    fromUnit: 'XLM',
    toCurrency: currency,
    rates: rates
  }).value

class XlmCreateAccountLearn extends React.PureComponent {
  render () {
    const {
      position,
      total,
      close,
      reserveXlm,
      rates,
      effectiveBalanceXlm,
      currency,
      fee
    } = this.props
    const convertToFiat = convertXlmToFiat(rates, currency)
    const totalAmountXlm = new BigNumber(effectiveBalanceXlm)
      .add(reserveXlm)
      .toString()
    const totalAmountFiat = convertToFiat(totalAmountXlm)
    const reserveFiat = convertToFiat(reserveXlm)
    const feeXlm = Exchange.convertXlmToXlm({
      value: fee,
      fromUnit: 'STROOP',
      toUnit: 'XLM'
    }).value
    const feeFiat = convertToFiat(feeXlm)
    const effectiveBalanceMinusFeeXlm = new BigNumber(effectiveBalanceXlm)
      .minus(feeXlm)
      .toString()
    const effectiveBalanceMinusFeeFiat = convertToFiat(
      effectiveBalanceMinusFeeXlm
    )
    const currencySymbol = currencySymbolMap[currency]
    return (
      <Modal size='medium' position={position} total={total} closeAll={close}>
        <ModalHeader onClose={close}>
          <Header onClick={close}>
            <BackIcon name='left-arrow' />
            <FormattedMessage
              id='modal.reservelearn.back'
              defaultMessage='Back.'
            />
          </Header>
        </ModalHeader>
        <ModalBody>
          <Title>
            <FormattedMessage
              id='modal.reservelearn.title'
              defaultMessage='Stellar mimimum balance requirement.'
            />
          </Title>
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info1'
              defaultMessage='To submit transactions, an address must hold a minimum amount of XLM in the shared global ledger. You cannot send this XLM to other addresses. To fund a new address, you must send enough XLM to meet the reserve requirement.'
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info2'
              defaultMessage='The current minimum reserve requirement is {reserveXlm} XLM; this is the cost of an address that owns no other objects in the ledger.'
              values={{ reserveXlm }}
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info3'
              defaultMessage='You can read more information on the'
            />
            {': '}
            <StyledLink href='' target='_blank'>
              <FormattedMessage
                id='modal.reservelearn.link'
                defaultMessage='Stellar (XLM) reserve requirements in the official documentation.'
              />
            </StyledLink>
          </Paragraph>
          <br />
          <Row>
            <Paragraph>
              <FormattedMessage
                id='modal.reservelearn.totalfunds'
                defaultMessage='Total funds.'
              />
            </Paragraph>
            <Paragraph>
              {`${totalAmountXlm} XLM (${currencySymbol}${totalAmountFiat})`}
            </Paragraph>
          </Row>
          <br />
          <Row>
            <Paragraph>
              <FormattedMessage
                id='modal.reservelearn.reservexlm'
                defaultMessage='XLM Reserve Requirement'
              />
            </Paragraph>
            <Paragraph>
              {`${reserveXlm} XLM (${currencySymbol}${reserveFiat})`}
            </Paragraph>
          </Row>
          <br />
          <Row>
            <Paragraph>
              <FormattedMessage
                id='modal.reservelearn.fee'
                defaultMessage='Transaction fee'
              />
            </Paragraph>
            <Paragraph>
              {`${feeXlm} XLM (${currencySymbol}${feeFiat})`}
            </Paragraph>
          </Row>
          <br />
          <Row>
            <Paragraph>
              <Bold>
                <FormattedMessage
                  id='modal.reservelearn.availablefunds'
                  defaultMessage='Available to withdraw or send'
                />
              </Bold>
            </Paragraph>
            <Paragraph>
              <Bold>{`${effectiveBalanceMinusFeeXlm} XLM`}</Bold>
              {` (${currencySymbol}${effectiveBalanceMinusFeeFiat})`}
            </Paragraph>
          </Row>
          <br />
        </ModalBody>
      </Modal>
    )
  }
}

XlmCreateAccountLearn.propTypes = {
  currency: PropTypes.string.isRequired,
  effectiveBalanceXlm: PropTypes.string.isRequired,
  reserveXlm: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  rates: PropTypes.object.isRequired
}

export default modalEnhancer(model.components.sendXlm.RESERVE_LEARN_MODAL)(
  XlmCreateAccountLearn
)
