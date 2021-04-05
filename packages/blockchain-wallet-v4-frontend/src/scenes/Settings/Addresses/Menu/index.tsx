import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import { StickyHeader } from 'components/Layout'
import { model } from 'data'
import { media } from 'services/styles'

const { WALLET_TX_SEARCH } = model.form

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Search = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  ${media.atLeastTablet`
    width: 300px;
  `}
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`
const MenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`
const Title = styled(Text)`
  margin: 4px 0;
`

const MenuTop = () => (
  <StickyHeader>
    <MenuHeader>
      <Title size='26px' weight={600} color='black'>
        <FormattedMessage
          id='scenes.settings.menu.title'
          defaultMessage='Wallets & Addresses'
        />
      </Title>
      <Text size='14px' weight={500} color='grey700'>
        <FormattedMessage
          id='scenes.settings.menu.subtitle'
          defaultMessage='Manage your wallets, addresses and private keys.'
        />
      </Text>
    </MenuHeader>
    <HorizontalMenu border={false}>
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
          <LinkContainer to='/settings/addresses/eth'>
            <TabMenuItem
              activeClassName='active'
              data-e2e='ethWalletSettingsLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.menutop.eth'
                defaultMessage='Ethereum'
              />
            </TabMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses/xlm'>
            <TabMenuItem
              activeClassName='active'
              data-e2e='xlmWalletSettingsLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.menutop.xlm'
                defaultMessage='Stellar'
              />
            </TabMenuItem>
          </LinkContainer>
        </TabMenu>
        <Search data-e2e='walletSettingsSearch'>
          <Field
            name='search'
            height='40px'
            placeholder='Search'
            component={TextBox}
          />
          <SearchIcon name='magnifier' size='20px' />
        </Search>
      </Container>
    </HorizontalMenu>
  </StickyHeader>
)

const enhance = compose(
  withRouter,
  reduxForm({
    form: WALLET_TX_SEARCH
  })
)

export default enhance(MenuTop)
