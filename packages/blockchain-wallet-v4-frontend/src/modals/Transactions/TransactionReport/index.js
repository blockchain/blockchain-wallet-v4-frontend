import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import TransactionReport from './template'

class TransactionReportContainer extends React.PureComponent {
  state = { generating: false }

  componentDidMount () {
    this.props.actions.initialized()
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  generateCSV = coin => {
    const startDate = this.props.formValues.start.format('YYYY-MM-DD')
    const endDate = this.props.formValues.end.format('YYYY-MM-DD')
    const filename = `${coin}_${startDate}_${endDate}.csv`
    this.setState({ generating: true, filename })
    this.props.actions.submitClicked(coin)
  }

  render () {
    const {
      position,
      total,
      closeAll,
      coin,
      csvData,
      isValidStartDate,
      isValidEndDate
    } = this.props

    return (
      <TransactionReport
        closeAll={closeAll}
        coin={coin}
        csvData={csvData}
        filename={this.state.filename}
        generating={this.state.generating}
        isValidEndDate={isValidEndDate}
        isValidStartDate={isValidStartDate}
        onDownload={() => this.setState({ generating: false })}
        onSubmit={() => this.generateCSV(coin)}
        position={position}
        total={total}
      />
    )
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(TransactionReportContainer)
