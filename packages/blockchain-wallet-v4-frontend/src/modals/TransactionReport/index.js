import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getBtcData, getBchData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import TransactionReport from './template'

class TransactionReportContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    return <TransactionReport
      coin={this.props.coin}
      csvData={this.props.csvData}
      onSubmit={() => this.props.actions.submitClicked(this.props.coin)}
      closeAll={this.props.closeAll}
      position={this.props.position}
      total={this.props.total}
    />
  }
}

TransactionReportContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH'])
}

TransactionReportContainer.defaultProps = {
  coin: 'BTC'
}

const mapStateToProps = (state, ownProps) => ({
  csvData: ownProps.coin === 'BTC' ? getBtcData(state) : getBchData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.transactionReport, dispatch)
})

const enhance = compose(
  modalEnhancer('TransactionReport'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransactionReportContainer)
