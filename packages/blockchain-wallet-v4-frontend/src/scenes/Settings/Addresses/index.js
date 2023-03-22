import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import Bch from './Bch'
import Btc from './Btc'
import BtcManage from './Btc/ManageAddresses'
import Eth from './Eth'
import Menu from './Menu'
import Xlm from './Xlm'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const ContentWrapper = styled.section`
  width: 100%;
  box-sizing: border-box;
`
class AddressesContainer extends React.PureComponent {
  render() {
    return (
      <Wrapper>
        <Menu />
        <ContentWrapper>
          <Switch>
            <Route path='/settings/addresses/btc/:walletIndex/:derivation'>
              <BtcManage />
            </Route>
            <Route exact path='/settings/addresses/btc'>
              <Btc />
            </Route>
            <Route exact path='/settings/addresses/bch'>
              <Bch />
            </Route>
            <Route exact path='/settings/addresses/eth'>
              <Eth />
            </Route>
            <Route exact path='/settings/addresses/xlm'>
              <Xlm />
            </Route>
            <Route
              path='/settings/addresses'
              render={() => <Redirect to='/settings/addresses/btc' />}
            />
          </Switch>
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default AddressesContainer
