import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import Bch from './Bch'
import Btc from './Btc'
import BtcManage from './Btc/ManageAddresses'
import Menu from './Menu'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const ContentWrapper = styled.section`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`
class AddressesContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Menu />
        <ContentWrapper>
          <Switch>
            <Route
              path='/settings/addresses/btc/:walletIndex/:derivation'
              component={BtcManage}
            />
            <Route path='/settings/addresses/btc' component={Btc} exact />
            <Route path='/settings/addresses/bch' component={Bch} />
            <Redirect from='/settings/addresses' to='/settings/addresses/btc' />
          </Switch>
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default withRouter(AddressesContainer)
