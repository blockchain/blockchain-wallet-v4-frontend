import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { CoinType, RemoteDataType, SupportedCoinsType } from 'core/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { RatesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}

export type SuccessStateType = {
  coin: CoinType
  minimumDeposit: number
  rates: RatesType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

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

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(InterestForm)
