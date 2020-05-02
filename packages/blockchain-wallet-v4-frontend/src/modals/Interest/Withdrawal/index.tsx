import { CoinType, RemoteDataType, SupportedCoinsType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class Withdrawal extends PureComponent<Props> {
  render () {
    const { data } = this.props
    return data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  handleClose: () => void
}

export type SuccessStateType = {
  coin: CoinType
  formValues: { withdrawalAmount: number }
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Withdrawal)
