import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getData } from './selectors'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { Text } from 'blockchain-info-components'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  currentTab: 'wallet' | 'hardware' | 'total'
}
export type SuccessStateType = {
  bchBalance: number
  btcBalance: number
  ethBalance: number
  paxBalance: number
  totalBalance: { path: string; totalBalance: string }
  xlmBalance: number
}
type LinkDispatchPropsType = {}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class TotalRow extends PureComponent<Props, State> {
  state = {}

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: e => (
        <Text
          size='12px'
          weight={600}
          color='red600'
          style={{ marginBottom: '24px' }}
        >
          Error Fetching Balance
        </Text>
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps): LinkStatePropsType => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TotalRow)
