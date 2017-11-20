import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
// import ui from 'redux-ui'
import { take, map, sortBy, prop, range } from 'ramda'
import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    // Submit exchange
  }

  render () {
    const { ...rest } = this.props

    return (
      <SecondStep {...rest} onSubmit={this.onSubmit} />
    )
  }
}

const mapStateToProps = (state) => ({
  order: selectors.core.data.shapeShift.getOrder(state)
})

// const mapDispatchToProps = (dispatch) => ({
//   walletActions: bindActionCreators(actions.wallet, dispatch)
// })

export default connect(mapStateToProps)(SecondStepContainer)
