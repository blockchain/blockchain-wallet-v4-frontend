import { connect } from 'react-redux'
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
  totalBalance: string
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
      Failure: () => (
        <Text
          size='14px'
          weight={600}
          color='red600'
          style={{ marginBottom: '24px', paddingBottom: '12px' }}
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

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TotalRow)
