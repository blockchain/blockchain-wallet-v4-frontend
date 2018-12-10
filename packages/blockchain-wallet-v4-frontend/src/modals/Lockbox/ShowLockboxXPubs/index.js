import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import ShowLockboxXPubs from './template'

class ShowLockboxXPubsContainer extends React.PureComponent {
  state = {
    activeTab: 'btc'
  }
  setActive = tab => {
    this.setState({ activeTab: tab })
  }
  render () {
    return this.props.data.cata({
      Success: val => (
        <ShowLockboxXPubs
          activeTab={this.state.activeTab}
          setActive={this.setActive}
          coins={val}
          {...this.props}
        />
      ),
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.deviceIndex)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('ShowLockboxXPubs'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ShowLockboxXPubsContainer)
