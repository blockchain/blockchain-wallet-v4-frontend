import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { add, compose } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Icon,
  Image,
  Modal,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { displayCoinToCoin } from 'blockchain-wallet-v4/src/exchange'
import { ExtractSuccess, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
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
  text-align: center;
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
    this.props.fundRecoveryActions.searchChain(this.props.accountIndex, this.props.coin)
  }

  componentWillUnmount() {
    this.props.fundRecoveryActions.resetFundRecovery()
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
              return val.searchChain.selection.inputs.length ? (
                <SuccessContainer>
                  <Text size='16px' weight={600}>
                    We found{' '}
                    <b>
                      {displayCoinToCoin(
                        val.searchChain.selection.inputs.map(({ value }) => value).reduce(add),
                        this.props.coin as WalletCurrencyType
                      )}{' '}
                    </b>
                    that is available for recovery.
                  </Text>
                  <Text
                    size='14px'
                    weight={500}
                    style={{ marginBottom: '12px', marginTop: '12px' }}
                  >
                    You can use the recover funds mechanism in order to transfer crypto that is
                    sitting on your {this.props.coin} Wallet but is not currently visible on your
                    balance. This is in place in order to access funds that were potentially stuck
                    due to bugs.
                  </Text>
                  <Text size='16px' weight={600} style={{ textAlign: 'center' }}>
                    By pressing Recover Now, you will initiate a transfer to your Wallet.
                  </Text>
                  <Button
                    onClick={() =>
                      this.props.fundRecoveryActions.recoverFunds(val.searchChain.coin)
                    }
                    disabled={Remote.Loading.is(val.fundRecoveryStatusR)}
                    data-e2e={`${this.props.coin}recoverNow`}
                    nature='primary'
                  >
                    Recover Now
                  </Button>
                </SuccessContainer>
              ) : (
                <SuccessContainer>
                  <Image name='empty-search' width='240px' />
                  <Text size='16px' weight={600} style={{ marginTop: '12px' }}>
                    You have no {this.props.coin} balances to recover.
                  </Text>
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
