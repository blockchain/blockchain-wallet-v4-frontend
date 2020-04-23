import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, RemoteDataType, SupportedCoinsType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RatesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class InterestForm extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.interestActions.initializeInterest('BTC')
  }

  handleRefresh = () => {
    this.props.interestActions.initializeInterest('BTC')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  handleClose: () => void
}
export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}
export type SuccessStateType = {
  coin: CoinType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InterestForm)
