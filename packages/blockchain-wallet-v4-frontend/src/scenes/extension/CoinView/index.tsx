import React from 'react'
import styled from 'styled-components'

import CoinsList from './CoinsList'
import { getCoinsSortedByBalance } from "components/Balances/selectors";
import { actions, selectors } from "data";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators } from "redux";

const Wrapper = styled.div`
  height: 400px;
`

const CoinView = () => {
  return (
    <Wrapper>
      <CoinsList />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  coins: getCoinsSortedByBalance(state).getOrElse([]),
  totalBalancesDropdown: selectors.preferences.getTotalBalancesDropdown(state)
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinView)
