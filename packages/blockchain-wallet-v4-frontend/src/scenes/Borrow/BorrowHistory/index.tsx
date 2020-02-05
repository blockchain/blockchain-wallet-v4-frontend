import { connect } from 'react-redux'
import { getData } from './selectors'
import { LoanType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { Text } from 'blockchain-info-components'
import { UserDataType } from 'data/types'
import React, { Component } from 'react'
import Success from './template.success'

export type SuccessStateType = {
  borrowHistory: Array<LoanType>
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}
type Props = LinkStatePropsType

class BorrowHistory extends Component<Props> {
  state = {}

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} />,
      Failure: e => <Text>{e.description}</Text>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowHistory)
