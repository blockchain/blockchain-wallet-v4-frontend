import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import MenuLeft from './template.success'

class MenuLeftContainer extends React.PureComponent<Props> {
  render() {
    const { data } = this.props

    return data.cata({
      Failure: () => <Failure />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <MenuLeft {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  lockboxDevices: Array<any>
}

export type Props = ConnectedProps<typeof connector> & {
  domains?: any
  menuOpened?: boolean
}

export default connector(MenuLeftContainer)
