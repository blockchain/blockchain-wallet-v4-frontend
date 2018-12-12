import React from 'react'
import styled from 'styled-components'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'

import Menu from './Menu'
import Btc from './Btc'
import BtcManage from './Btc/ManageAddresses'
import Bsv from './Bsv'
import Bch from './Bch'

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
        <Menu location={this.props.location} />
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
