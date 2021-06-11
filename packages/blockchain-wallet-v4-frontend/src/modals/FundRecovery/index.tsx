import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { BlockchainLoader, Modal, ModalHeader, Text } from 'blockchain-info-components'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'

class FundRecoveryModal extends PureComponent<Props> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fundRecoveryActions.searchChain(this.props.accountIndex, this.props.coin, 'bech32')
  }

  render() {
    return (
      <Modal>
        <ModalHeader>Fund Recovery</ModalHeader>
        {this.props.data.cata({
          Failure: (e) => (
            <Text weight={600} color='red600'>
              Error: {e}
            </Text>
          ),
          Loading: () => <BlockchainLoader />,
          NotAsked: () => <BlockchainLoader />,
          Success: (val) => {
            return <div>{val.recoverableValue}</div>
          }
        })}
      </Modal>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fundRecoveryActions: bindActionCreators(actions.components.fundRecovery, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  accountIndex: number
  coin: string
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default compose<any, any, any>(
  modalEnhancer('FUND_RECOVERY_MODAL'),
  connector
)(FundRecoveryModal)
