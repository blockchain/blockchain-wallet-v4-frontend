import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class PagesContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    const depositAddress = path(['quote', 'deposit'], this.props.trade)
    this.props.dataShapeshiftActions.fetchTradeStatus(depositAddress)
  }

  handleClick (address) {
    this.props.modalActions.showModal('ExchangeDetails', { address })
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success trade={value} handleClick={this.handleClick} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.trade)
})

const mapDispatchToProps = dispatch => ({
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PagesContainer)
