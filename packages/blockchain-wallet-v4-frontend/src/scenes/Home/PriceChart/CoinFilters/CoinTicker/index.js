import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class CoinTickerContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized(this.props.coin)
  }

  render () {
    const { data, selected, handleClick } = this.props

    return data.cata({
      Success: value => <Success {...value} selected={selected} handleClick={handleClick} />,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: selectors.components.priceTicker.getData(ownProps.coin, state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceTicker, dispatch)
})

CoinTickerContainer.propTypes = {
  coin: PropTypes.oneOf(['BCH', 'BTC', 'ETH']).isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinTickerContainer)
