import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { ExtractSuccess } from 'core/types'
import { getData } from './selectors'
import React from 'react'
import Template from './template'

class Table extends React.PureComponent<Props> {
  render () {
    return this.props.data.cata({
      Success: val => <Template {...this.props} {...val} />,
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  viewType: 'Total' | 'Wallet' | 'Hardware'
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Table)
