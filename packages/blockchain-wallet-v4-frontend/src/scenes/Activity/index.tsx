import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import {
  BlockchainLoader,
  Button,
  HeartbeatLoader,
  Text
} from 'blockchain-info-components'
import { ExtractSuccess } from 'core/types'
import { getData } from './selectors'
import { SceneWrapper, StickyHeader } from 'components/Layout'

import CustodialTx from '../Transactions/CustodialTx'
import NonCustodialTx from '../Transactions/NonCustodialTx'
import SBOrderTx from '../Transactions/SBOrderTx'

const TEMPHeader = styled(Text)`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 20px;
  color: ${props => props.theme.black};
`
const StyledSceneWrapper = styled(SceneWrapper)`
  height: auto;
  overflow: visible;
`
const Top = styled(StickyHeader)`
  width: 100%;
  display: flex;
  justify-content: center;
`
const Bottom = styled(StickyHeader)`
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`

class Activity extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    // add a check here to reconsider fetching activity again
    // if all the data has been fetched recently
    this.props.activityActions.fetchActivity()
  }

  render () {
    const { activity, currency, next, status } = this.props.data

    return (
      <StyledSceneWrapper>
        <Top>
          {status.cata({
            Success: () => (
              <TEMPHeader>✅&nbsp;Finished Loading Everything</TEMPHeader>
            ),
            Loading: () => (
              <TEMPHeader>
                <BlockchainLoader height='28px' width='28px' />
                &nbsp;Loading
              </TEMPHeader>
            ),
            NotAsked: () => (
              <TEMPHeader>
                <BlockchainLoader height='28px' width='28px' />
                &nbsp;Loading
              </TEMPHeader>
            ),
            Failure: e => <TEMPHeader>A Failure Occurred: {e}</TEMPHeader>
          })}
        </Top>
        {activity.map(tx => {
          return 'hash' in tx ? (
            <NonCustodialTx
              key={tx.hash}
              transaction={tx}
              coin={tx.coin}
              currency={currency}
            />
          ) : 'pair' in tx ? (
            <SBOrderTx order={tx} />
          ) : (
            <CustodialTx tx={tx} coin={tx.amount.symbol} currency={currency} />
          )
        })}
        <Bottom>
          {status.cata({
            Success: () =>
              next.length > 0 ? (
                <Button
                  nature='primary'
                  data-e2e='loadMore'
                  onClick={() => this.props.activityActions.fetchActivity()}
                >
                  Next
                </Button>
              ) : (
                <>📭 All loaded!</>
              ),
            Loading: () => <HeartbeatLoader />,
            NotAsked: () => <HeartbeatLoader />,
            Failure: e => <TEMPHeader>A Failure Occurred: {e}</TEMPHeader>
          })}
        </Bottom>
      </StyledSceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  activityActions: bindActionCreators(actions.core.data.activity, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Activity)
