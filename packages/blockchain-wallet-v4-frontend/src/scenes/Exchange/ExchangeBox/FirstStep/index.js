import React from 'react'
// import { connect } from 'react-redux'
// import { compose } from 'redux'
// import ui from 'redux-ui'
// import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  render () {
    const { ...rest } = this.props

    return (
      <FirstStep {...rest} />
    )
  }
}

// const mapDispatchToProps = (dispatch) => ({
//   walletActions: bindActionCreators(actions.wallet, dispatch)
// })

export default FirstStepContainer
