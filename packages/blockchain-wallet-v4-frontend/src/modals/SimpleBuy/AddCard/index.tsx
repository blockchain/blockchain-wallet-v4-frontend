import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  FiatType,
  RemoteDataType,
  SBCardType,
  SBProviderDetailsType
} from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class AddCard extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.fetchSBCard(this.props.cardId)
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCard()
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.setStep({ step: '3DS_HANDLER' })
    this.props.simpleBuyActions.fetchEverypay3DSDetails()
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export type OwnProps = {
  cardId?: string
  handleClose: () => void
}
export type SuccessStateType = {
  card: SBCardType
  fiatCurrency: FiatType
  providerDetails: SBProviderDetailsType
}
export type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCard)
