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
              return val.searchChain.data.length ? (
                <SuccessContainer>
                  <Text size='16px' weight={500}>
                    We found{' '}
                    <b>
                      {displayCoinToCoin(
                        val.searchChain.data.map(({ value }) => value).reduce(add),
                        this.props.coin as WalletCurrencyType
                      )}{' '}
                    </b>
                    that can be recovered.
                  </Text>
                  <Icon name='arrow-down' size='36px' />
                  <Text size='16px' weight={600} color='green600' style={{ textAlign: 'center' }}>
                    Recover Funds to {val.searchChain.recoveryAddress}
                  </Text>
                  <Button
                    onClick={() =>
                      this.props.fundRecoveryActions.recoverFunds(
                        val.searchChain.accountIndex,
                        val.searchChain.data,
                        val.searchChain.coin,
                        'bech32',
                        'legacy',
                        val.searchChain.recoveryAddress,
                        val.searchChain.badChange
                      )
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
                    We could not find any missing funds to recover.
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
