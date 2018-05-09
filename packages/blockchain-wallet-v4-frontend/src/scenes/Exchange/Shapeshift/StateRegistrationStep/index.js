import React from 'react'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
//
// import { actions } from 'data'

class StateRegistrationStep extends React.Component {
  componentWillUnmount () {
    //this.props.actions.destroyed()
  }

  render () {
    return (<div>Registration Needed</div>)
    // return this.props.data.cata({
    //   Success: (value) => <div>Registration Needed</div>,
    //   Failure: () => <div />,
    //   Loading: () => <div />,
    //   NotAsked: () => <div />
    // })
  }
}

// const mapStateToProps = state => ({
//   data: getData(state)
// })
//
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(actions.components.exchange, dispatch)
// })

export default StateRegistrationStep
