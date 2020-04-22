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
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type SuccessStateType = {
  coin: CoinType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class InterestForm extends PureComponent<Props> {
  state = {}

  handleSimpleBuyClick = () => {
    this.props.simpleBuyActions.showModal('sideNav')
  }

  handleDepositClick = () => {
    this.props.interestActions.showInterestModal('deposit')
  }

  handleRefresh = () => {
    this.props.interestActions.showInterestModal('deposit')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
          handleDepositClick={this.handleDepositClick}
          handleSimpleBuyClick={this.handleSimpleBuyClick}
        />
      ),
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
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(InterestForm)
