import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const { VIEW_ORDER_DETAILS } = model.analytics.SWAP_EVENTS
class ExchangeDetailsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.modalInitialized(this.props.depositAddress)
    this.props.analyticsActions.logEvent(VIEW_ORDER_DETAILS)
  }

  componentWillUnmount () {
    this.props.actions.modalDestroyed()
  }

  render () {
    const { data, position, total, close } = this.props

    return data.cata({
      Success: value => (
        <Success {...value} position={position} total={total} close={close} />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

ExchangeDetailsContainer.propTypes = {
  depositAddress: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(ownProps.depositAddress, state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

const enhance = compose(
  modalEnhancer('ExchangeDetails'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ExchangeDetailsContainer)
