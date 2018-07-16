import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
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
    const { position, total, closeAll, coin, csvData, isValidStartDate, isValidEndDate } = this.props

    return <TransactionReport
      coin={coin}
      csvData={csvData}
      isValidStartDate={isValidStartDate}
      isValidEndDate={isValidEndDate}
      onSubmit={() => this.props.actions.submitClicked(coin)}
      closeAll={closeAll}
      position={position}
      total={total}
    />
  }
}

TransactionReportContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH'])
}

TransactionReportContainer.defaultProps = {
  coin: 'BTC'
}

const mapStateToProps = (state, ownProps) => getData(ownProps.coin, state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.transactionReport, dispatch)
})

const enhance = compose(
  modalEnhancer('TransactionReport'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransactionReportContainer)
