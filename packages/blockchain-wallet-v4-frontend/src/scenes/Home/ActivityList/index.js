import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ActivityListContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRequest = this.handleRequest.bind(this)
  }

  componentDidMount () {
    this.props.actions.initialized()
  }

  handleRequest () {
    this.props.modalActions.showModal('RequestBitcoin')
  }

  render () {
    const { data, canBuy } = this.props
    const partner = canBuy.cata({ Success: (val) => val, Loading: () => false, Failure: () => false, NotAsked: () => false })

    return data.cata({
      Success: (value) => <Success activities={value} partner={partner} handleRequest={this.handleRequest} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  canBuy: selectors.exchange.getCanTrade(state, 'Buy')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  actions: bindActionCreators(actions.components.activityList, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListContainer)
