import React from 'react'
import styled from 'styled-components'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'

import Btc from './Btc'
import BtcManage from './Btc/ManageAddresses'
import Bch from './Bch'
import Bsv from './Bsv'

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
        <ContentWrapper>
          <Switch>
            <Route
              path='/settings/addresses/btc/:index'
              component={BtcManage}
            />
            <Route path='/settings/addresses/btc' component={Btc} exact />
            <Route path='/settings/addresses/bch' component={Bch} />
            <Route path='/settings/addresses/bsv' component={Bsv} />
            <Redirect from='/settings/addresses' to='/settings/addresses/btc' />
          </Switch>
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default withRouter(AddressesContainer)
