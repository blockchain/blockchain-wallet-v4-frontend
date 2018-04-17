import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Icon, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { MethodContainer } from 'components/BuySell/styled.js'
import { statusHelper } from 'services/SfoxService'
import { spacing } from 'services/StyleService'
import FundingSource from 'components/BuySell/FundingSource'

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={300}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)
const renderFirstRow = props => (
  props._outCurrency === 'BTC'
    ? `${props._receiveAmount} BTC ($${((+props._sendAmount / 1e8) - props._feeAmount).toFixed(2)})`
    // : `${q.quoteAmount / 100000000} BTC ($${(+q.baseAmount - +q.feeAmount).toFixed(2)})`
    : null
)
const renderTotal = props => props._outCurrency === 'BTC' ? `$${(+props._inAmount / 1e8).toFixed(2)}` : `$${props._baseAmount}`

class SfoxTradeDetails extends React.Component {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    this.props.modalActions.clickWelcomeContinue()
  }

  render () {
    const headerStatus = statusHelper(this.props._state)
    const { account } = this.props
    console.log('trade details modal', this.props)

    return (
      <Modal size='large' position={this.props.position} total={this.props.total}>
        <ModalHeader onClose={this.props.close}>
          <Text color={headerStatus.color}>
            Buy Order {headerStatus.text}
          </Text>
        </ModalHeader>
        <ModalBody>
          <div>Trade details modal</div>
          <MethodContainer>
            <Icon name='bank-filled' size='30px' />
            <FundingSource account={account[0]} />
          </MethodContainer>
          <OrderDetailsTable style={spacing('mt-10')}>
            {renderDetailsRow(
              'order_details.amount_to_purchase',
              'BTC Amount to Purchase',
              renderFirstRow(this.props))
            }
            {renderDetailsRow(
              'order_details.trading_fee',
              'Trading Fee',
              `$${(+this.props._feeAmount).toFixed(2)}`
            )}
            {renderDetailsRow(
              'order_details.total_cost',
              'Total Cost',
              renderTotal(this.props),
              'success'
            )}
          </OrderDetailsTable>
        </ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  account: selectors.core.data.sfox.getAccounts(state).data
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxTradeDetails'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SfoxTradeDetails)
