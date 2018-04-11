import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { calculateMinimum, calculateMaximum, isBalanceBelowMin } from './services'
import MinimumMaximum from './template'

class MinimumMaximumContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  handleClickMinimum () {
    const minimum = calculateMinimum(this.props)
    this.props.formActions.change('exchange', 'amount', { source: `${minimum}`, target: 0 })
  }

  handleClickMaximum () {
    const maximum = calculateMaximum(this.props)
    this.props.formActions.change('exchange', 'amount', { source: `${maximum}`, target: 0 })
  }

  render () {
    const { sourceCoin } = this.props
    return <MinimumMaximum
      handleClickMinimum={this.handleClickMinimum}
      handleClickMaximum={this.handleClickMaximum}
      isBalanceBelowMin={isBalanceBelowMin(this.props)}
      minimum={calculateMinimum(this.props)}
      sourceCoin={sourceCoin} />
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MinimumMaximumContainer)
