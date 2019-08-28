import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { Success } from './template.success'
import { Loading } from './template.loading'

class JumioStatusContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onOpen = this.onOpen.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }

  componentDidMount () {
    this.props.sfoxActions.initializeJumio()
  }

  onOpen () {
    this.props.sfoxActions.nextStep('jumio')
    this.props.modalActions.showModal('SfoxExchangeData', { step: 'jumio' })
  }

  onRefresh () {
    this.props.sfoxActions.fetchJumioStatus()
  }

  render () {
    return this.props.data.cata({
      Success: value => (
        <Success
          handleOpen={this.onOpen}
          handleRefresh={this.onRefresh}
          jumioStatus={value.jumioStatus}
          jumioToken={value.jumioToken}
          profile={value.profile}
        />
      ),
      Loading: () => <Loading />,
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
