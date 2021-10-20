import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../components'
import { getData } from './selectors'
import BankLinkError from './template.error.general'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  yapilyBankId?: string
}
type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
}

class LinkBankStatus extends PureComponent<Props> {
  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading text={LoadingTextEnum.PROCESSING} />,
      NotAsked: () => <Loading text={LoadingTextEnum.PROCESSING} />,
      Success: (val) =>
        val.bankStatus === 'ACTIVE' ? (
          <Success {...val} {...this.props} />
        ) : (
          <BankLinkError {...val} {...this.props} />
        )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & LinkDispatchPropsType & ConnectedProps<typeof connector>

export default connector(LinkBankStatus)
