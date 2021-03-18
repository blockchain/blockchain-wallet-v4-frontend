import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Text } from 'blockchain-info-components'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class TotalRow extends PureComponent<Props> {
  render() {
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

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

export type SuccessStateType = {
  totalBalance: string
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = LinkStatePropsType

export default connector(TotalRow)
