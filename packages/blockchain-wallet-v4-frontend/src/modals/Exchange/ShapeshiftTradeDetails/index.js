import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import Success from './template.success'

class ShapeshiftTradeDetailsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.modalInitialized(this.props.depositAddress)
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

ShapeshiftTradeDetailsContainer.propTypes = {
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
  modalEnhancer('ShapeshiftTradeDetails'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ShapeshiftTradeDetailsContainer)
