import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { take, map, sortBy, prop, range } from 'ramda'
import { actions } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { indexes: [] }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(
      take(4),
      map(prop(1)),
      randomize,
      pair
    )(range(0, 12))
    this.setState({ indexes })
  }

  onSubmit () {
    this.props.walletActions.verifyMnemonic()
  }

  render () {
    const { ...rest } = this.props

    return (
      <ThirdStep
        {...rest}
        indexes={this.state.indexes}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(ThirdStepContainer)
