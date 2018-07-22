import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { Success } from './template.success'

class JumioStatusContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.openJumio = this.openJumio.bind(this)
  }

  componentDidMount () {
    this.props.sfoxActions.initializeJumio()
  }

  openJumio () {
    this.props.sfoxActions.nextStep('jumio')
    this.props.modalActions.showModal('SfoxExchangeData', { step: 'jumio' })
  }

  render () {
    return this.props.data.cata({
      Success: value => (
        <Success
          profile={value.profile}
          onClick={this.openJumio}
          jumioStatus={value.jumioStatus}
        />
      ),
      Loading: () => <div />,
      NotAsked: () => <div />,
      Failure: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default enhance(JumioStatusContainer)
