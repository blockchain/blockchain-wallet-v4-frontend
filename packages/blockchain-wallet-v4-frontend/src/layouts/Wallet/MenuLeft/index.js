import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import MenuLeft from './template.success'

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
