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
            <Route
              component={BtcManage}
              path='/settings/addresses/btc/:walletIndex/:derivation'
            />
            <Route component={Btc} exact path='/settings/addresses/btc' />
            <Route component={Bch} exact path='/settings/addresses/bch' />
            <Route component={Eth} exact path='/settings/addresses/eth' />
            <Route component={Xlm} exact path='/settings/addresses/xlm' />
            <Redirect from='/settings/addresses' to='/settings/addresses/btc' />
          </Switch>
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default withRouter(AddressesContainer)
