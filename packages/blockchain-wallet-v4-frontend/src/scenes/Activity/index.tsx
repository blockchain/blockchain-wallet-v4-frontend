import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { BlockchainLoader, Text } from 'blockchain-info-components'
import { ExtractSuccess } from 'core/types'
import { getData } from './selectors'
import { SceneWrapper } from 'components/Layout'

const TEMPHeader = styled(Text)`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 20px;
  color: ${props => props.theme.black};
`

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
          Success: () => (
            <TEMPHeader>✅&nbsp;Finished Loading Everything</TEMPHeader>
          ),
          Loading: () => (
            <TEMPHeader>
              <BlockchainLoader height='28px' width='28px' />
              &nbsp;Loading
            </TEMPHeader>
          ),
          NotAsked: () => (
            <TEMPHeader>
              <BlockchainLoader height='28px' width='28px' />
              &nbsp;Loading
            </TEMPHeader>
          ),
          Failure: e => <TEMPHeader>A Failure Occurred: {e}</TEMPHeader>
        })}
        {this.props.data.activity.map(value => {
          return (
            <code
              style={{
                display: 'block',
                wordBreak: 'break-all',
                marginBottom: '20px'
              }}
              key={'id' in value ? value.id : value.hash}
            >
              {JSON.stringify(value)}
            </code>
          )
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
