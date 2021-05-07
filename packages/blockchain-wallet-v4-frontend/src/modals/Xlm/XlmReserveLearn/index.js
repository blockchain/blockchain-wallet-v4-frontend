import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Title = styled(Text)`
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 16px;
`
const Paragraph = styled(Text)`
  font-size: 14px;
  font-weight: 400;
`
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
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
  font-weight: 500;
`
class XlmReserveLearn extends React.PureComponent {
  onClose = () => {
    this.props.closeAll()
    this.props.modalActions.showModal('SEND_XLM_MODAL', {
      origin: '@SEND.XLM.RESERVE_LEARN_MODAL'
    })
  }

  render() {
    const {
      currencySymbol,
      effectiveBalanceMinusFeeFiat,
      effectiveBalanceMinusFeeXlm,
      feeFiat,
      feeXlm,
      position,
      reserveFiat,
      reserveXlm,
      total,
      totalAmountFiat,
      totalAmountXlm
    } = this.props

    return (
      <Modal
        size='medium'
        position={position}
        total={total}
        closeAll={this.onClose}
        data-e2e='xlmMinimumModal'
      >
        <ModalHeader onClose={this.onClose}>
          <Header onClick={this.onClose}>
            <BackIcon
              name='arrow-left'
              data-e2e='xlmMinimumModalBack'
              size='20px'
            />
            <FormattedMessage id='buttons.back' defaultMessage='Back' />
          </Header>
        </ModalHeader>
        <ModalBody>
          <Title>
            <FormattedMessage
              id='modal.reservelearn.title1'
              defaultMessage='Stellar minimum balance requirement.'
            />
          </Title>
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info1'
              defaultMessage='Stellar requires that all Stellar accounts hold a minimum balance of lumens, or XLM. This means you cannot send a balance out of your Stellar Wallet that would leave your Stellar Wallet with less than the minimum balance. This also means that in order to send XLM to new Stellar account, you must send enough XLM to meet the minimum balance requirement.'
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info2'
              defaultMessage='The current minimum balance requirement is 1 XLM.'
              values={{ reserveXlm }}
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.reservelearn.info3'
              defaultMessage='You can read more information on the'
            />{' '}
            <StyledLink
              href='https://www.stellar.org/developers/guides/concepts/fees.html#minimum-account-balance'
              target='_blank'
            >
              <FormattedMessage
                id='modal.reservelearn.link'
                defaultMessage='Stellar (XLM) balance requirements in the official documentation.'
              />
            </StyledLink>
          </Paragraph>
          <br />
          <Row>
            <Paragraph>
              <FormattedMessage
                id='modal.reservelearn.totalfunds'
                defaultMessage='Total funds'
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
                defaultMessage='Minimum Balance Requirement'
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

XlmReserveLearn.propTypes = {
  currency: PropTypes.string.isRequired,
  effectiveBalanceXlm: PropTypes.string.isRequired,
  reserveXlm: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  rates: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendXlm.RESERVE_LEARN_MODAL),
  connect(getData, mapDispatchToProps)
)

export default enhance(XlmReserveLearn)
