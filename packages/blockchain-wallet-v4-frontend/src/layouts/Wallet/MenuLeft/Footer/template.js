import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from 'blockchain-info-components'
import SecurityGauge from './SecurityGauge'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: ;
  color: ${props => props.theme['gray-4']};
`
const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 14px;
  width: 100%;

  & > span:first-child {
    width: 30px;
    font-size: 24px;
    margin-right: 5px;
  }

  &.active {
    & > * {
      color: ${props => props.theme['brand-secondary']};
    }
  }
`
const SubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  text-transform: none;
  padding: 5px 10px;
  margin-left: 10px;
  margin-top: -15px;
  margin-bottom: 30px;
`
const SubMenuItem = styled.li`
  padding: 5px 0;
  box-sizing: border-box;
  text-transform: none;
  cursor: pointer;

  &.active {
    & > * {
      color: ${props => props.theme['brand-secondary']};
    }
  }
`

const Footer = props => {
  const { settingsOpened, userFlowSupported } = props.data

  return (
    <Wrapper>
      <LinkContainer to='/security-center' activeClassName='active'>
        <MenuItem>
          <Icon name='security' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.securitycenter'
            defaultMessage='Security Center'
          />
          <SecurityGauge />
        </MenuItem>
      </LinkContainer>
      <LinkContainer
        to='/settings/info'
        activeClassName='active'
        className={settingsOpened ? 'active' : ''}
      >
        <MenuItem>
          <Icon name='settings' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.settings'
            defaultMessage='Settings'
          />
        </MenuItem>
      </LinkContainer>
      {settingsOpened && (
        <SubMenu>
          <LinkContainer to='/settings/info' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.general'
                defaultMessage='General'
              />
            </SubMenuItem>
          </LinkContainer>
          {userFlowSupported && (
            <LinkContainer to='/settings/profile' activeClassName='active'>
              <SubMenuItem>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.profile'
                  defaultMessage='Profile'
                />
              </SubMenuItem>
            </LinkContainer>
          )}
          <LinkContainer to='/settings/preferences' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.preferences'
                defaultMessage='Preferences'
              />
            </SubMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses' activeClassName='active'>
            <SubMenuItem>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.addresses'
                defaultMessage='Wallets & Addresses'
              />
            </SubMenuItem>
          </LinkContainer>
        </SubMenu>
      )}
    </Wrapper>
  )
}

export default Footer
