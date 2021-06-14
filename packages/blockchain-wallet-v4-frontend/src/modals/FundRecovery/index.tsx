import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { BlockchainLoader, Button, Modal, ModalHeader, Text } from 'blockchain-info-components'
import { displayCoinToCoin } from 'blockchain-wallet-v4/src/exchange'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import { getData } from './selectors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    margin-top: 16px;
  }
`

class FundRecoveryModal extends PureComponent<Props> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fundRecoveryActions.searchChain(this.props.accountIndex, this.props.coin, 'bech32')
  }

  componentWillUnmount() {
    // this.props.fundRecoveryActions.resetComponent()
  }

  render() {
    return (
      <Modal>
        <ModalHeader onClose={this.props.closeAll}>{this.props.coin} Fund Recovery</ModalHeader>
        <Container>
          {this.props.data.cata({
            Failure: (e) => (
              <Text weight={600} color='red600'>
                Error: {e}
              </Text>
            ),
            Loading: () => <BlockchainLoader />,
            NotAsked: () => <BlockchainLoader />,
            Success: (val) => {
              return (
                <SuccessContainer>
                  <Text size='16px' weight={500}>
                    We found {displayCoinToCoin(val.recoverableValue, 'BCH')} that can be recovered.
                  </Text>
                  <Button
                    onClick={() =>
                      this.props.fundRecoveryActions.recoverFunds(
                        val.searchChain.accountIndex,
                        val.searchChain.data,
                        val.searchChain.coin,
                        'bech32',
                        'legacy',
                        val.searchChain.badChange
                      )
                    }
                    data-e2e={`${this.props.coin}recoverNow`}
                    nature='primary'
                  >
                    Recover Now
                  </Button>
                </SuccessContainer>
              )
            }
          })}
        </Container>
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
} & ModalPropsType
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

// eslint-disable-next-line
export default compose<any, any, any>(
  modalEnhancer('FUND_RECOVERY_MODAL'),
  connector
)(FundRecoveryModal)
