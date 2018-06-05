import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getBtcData, getBchData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  componentWillMount () {
    this.props.actions.initialized()
  }

  render () {
    return <FirstStep csvData={this.props.csvData} onSubmit={() => this.props.actions.submitClicked(this.props.coin)} />
  }
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

export default enhance(FirstStepContainer)
