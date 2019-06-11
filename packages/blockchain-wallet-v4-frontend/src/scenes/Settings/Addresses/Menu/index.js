import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon, TabMenu, TabMenuItem } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'
import { TextBox } from 'components/Form'
import { model } from 'data'
const { WALLET_TX_SEARCH } = model.form

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  @media (min-width: 900px) {
    width: 300px;
  }
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`
const LinkItem = styled(TabMenuItem)`
  &.active {
    & :after {
      position: absolute;
      content: '';
      top: 39px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
    }
  }
`
const MenuTop = () => (
  <HorizontalMenu>
    <Container>
      <TabMenu>
        <LinkContainer to='/settings/addresses/btc' activeClassName='active'>
          <LinkItem data-e2e='btcWalletSettingsLink'>
            <FormattedMessage
              id='scenes.settings.addresses.menutop.btc'
              defaultMessage='Bitcoin'
            />
          </LinkItem>
        </LinkContainer>
        <LinkContainer to='/settings/addresses/bch' activeClassName='active'>
          <LinkItem data-e2e='bchWalletSettingsLink'>
            <FormattedMessage
              id='scenes.settings.addresses.menutop.bch'
              defaultMessage='Bitcoin Cash'
            />
          </LinkItem>
        </LinkContainer>
      </TabMenu>
      <Search data-e2e='walletSettingsSearch'>
        <Field name='search' height='40px' component={TextBox} />
        <SearchIcon name='search' size='20px' />
      </Search>
    </Container>
  </HorizontalMenu>
)

export default reduxForm({
  form: WALLET_TX_SEARCH
})(MenuTop)
