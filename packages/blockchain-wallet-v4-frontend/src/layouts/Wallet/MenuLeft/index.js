import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import MenuLeft from './template.success'
import Loading from './template.loading'
import Failure from './template.failure'

class MenuLeftContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => <MenuLeft {...val} {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: msg => <Failure msg={msg} />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuLeftContainer)
