import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import { model } from 'data'
import { StickyHeader } from 'components/Layout'
import { TextBox } from 'components/Form'
import { withRouter } from 'react-router-dom'
import HorizontalMenu from 'components/HorizontalMenu'
import React from 'react'
import styled from 'styled-components'
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
  @media (min-width: 900px) {
    width: 300px;
  }
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

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.blue000};
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
`

const Row = styled.div`
  display: flex;
`

const Title = styled(Text)`
  margin-left: 1rem;
`

const Subtitle = styled(Text)`
  margin-top: 1rem;
`

const MenuTop = () => (
  <StickyHeader>
    <MenuHeader>
      <Row>
        <IconWrapper>
          <Icon color='blue600' name='wallet-filled' size='24px' />
        </IconWrapper>
        <Title size='32px' weight={600} color='black'>
          <FormattedMessage
            id='scenes.settings.menu.title'
            defaultMessage='Wallets & Addresses'
          />
        </Title>
      </Row>

      <Subtitle size='16px' weight={500} color='grey600'>
        <FormattedMessage
          id='scenes.settings.menu.subtitle'
          defaultMessage='Manage your wallet names, addresses and private keys.'
        />
      </Subtitle>
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
          <Field name='search' height='40px' component={TextBox} />
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
