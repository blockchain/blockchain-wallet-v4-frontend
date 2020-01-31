import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

import { Icon, TabMenu, TabMenuItem } from 'blockchain-info-components'
import { model } from 'data'
import { TextBox } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
const { WALLET_TX_SEARCH } = model.form

const Wrapper = styled.div`
  background-color: ${props => props.theme.white};
  position: sticky;
  width: 100%;
  z-index: 1;
  top: 0;
`

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
const MenuTop = () => (
  <Wrapper>
    <HorizontalMenu>
      <Container>
        <TabMenu>
          <LinkContainer to='/settings/addresses/btc'>
            <TabMenuItem
              activeClassName='active'
              data-e2e='btcWalletSettingsLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.menutop.btc'
                defaultMessage='Bitcoin'
              />
            </TabMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses/bch'>
            <TabMenuItem
              activeClassName='active'
              data-e2e='bchWalletSettingsLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.menutop.bch'
                defaultMessage='Bitcoin Cash'
              />
            </TabMenuItem>
          </LinkContainer>
        </TabMenu>
        <Search data-e2e='walletSettingsSearch'>
          <Field name='search' height='40px' component={TextBox} />
          <SearchIcon name='magnifier' size='20px' />
        </Search>
      </Container>
    </HorizontalMenu>
  </Wrapper>
)

export default reduxForm({
  form: WALLET_TX_SEARCH
})(MenuTop)
