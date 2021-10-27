import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import getData from './selectors'
import LockTime from './template'

class LockTimeContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { sendActions } = this.props
    sendActions.getLockRule()
  }

  render() {
    const { data } = this.props

    return data.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => <LockTime {...val} />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(LockTimeContainer)
