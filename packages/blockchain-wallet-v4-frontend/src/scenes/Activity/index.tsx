import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { ExtractSuccess } from 'core/types'
import { getData } from './selectors'
import { SceneWrapper } from 'components/Layout'

class Activity extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    // add a check here to reconsider fetching activity again
    // if all the data has been fetched recently
    this.props.activityActions.fetchActivity()
  }

  render () {
    return (
      <SceneWrapper>
        {this.props.data.status.cata({
          Success: () => <div>done loading</div>,
          Loading: () => <div>loading something</div>,
          NotAsked: () => <div>not asked</div>,
          Failure: e => <div>something failed: {e}</div>
        })}
        {this.props.data.activity.map(value => {
          return <div key={value.id}>{JSON.stringify(value)}</div>
        })}
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  activityActions: bindActionCreators(actions.core.data.activity, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Activity)
