import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Template from './template'

class ConnectDeviceStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.changeDeviceSetupStep = this.changeDeviceSetupStep.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.initializeNewDeviceSetup()
  }

  changeDeviceSetupStep () {
    this.props.lockboxActions.changeDeviceSetupStep('open-btc-app')
  }

  render () {
    const authenticity = this.props.authenticity.cata({
      Success: resp => ({ isLoading: false, isSuccess: resp.isAuthentic }),
      Failure: () => ({ isLoading: false, isSuccess: false }),
      Loading: () => ({ isLoading: true }),
      NotAsked: () => ({ isLoading: true })
    })

    return (
      <Template
        authenticity={authenticity}
        handleStepChange={this.changeDeviceSetupStep}
      />
    )
  }
}

const mapStateToProps = state => ({
  authenticity: selectors.components.lockbox.getNewDeviceAuthenticity(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDeviceStepContainer)
