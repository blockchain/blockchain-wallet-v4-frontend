import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import Bch from './Bch'
import Btc from './Btc'
import BtcManage from './Btc/ManageAddresses'
import Eth from './Eth'
import Menu from './Menu'
import React from 'react'
import styled from 'styled-components'
import Xlm from './Xlm'

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
              path='/settings/addresses/btc/:index'
              component={BtcManage}
            />
            <Route path='/settings/addresses/btc' component={Btc} exact />
            <Route path='/settings/addresses/bch' component={Bch} exact />
            <Route path='/settings/addresses/eth' component={Eth} exact />
            <Route path='/settings/addresses/xlm' component={Xlm} exact />
            <Redirect from='/settings/addresses' to='/settings/addresses/btc' />
          </Switch>
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default withRouter(AddressesContainer)
