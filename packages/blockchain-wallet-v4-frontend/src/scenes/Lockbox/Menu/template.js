import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'
import { CreatableInputField } from 'components/Form'
import { CurrencyItem } from 'components/Balances'
import { FormattedMessage } from 'react-intl'
import { any, equals, toLower, prop, isEmpty } from 'ramda'

const Container = styled.div`
  width: 100%;
`
const TitleBar = styled.div`
  width: 100%;
  background-color: ${props => props.theme['white']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const TitleBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
`
const CurrencyList = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 40px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const SettingsIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`
const StyledCreatableInputContainer = styled.div`
  display: flex;
  padding: 15px 40px;
  align-items: center;
  > div:last-child {
    width: 100%;
  }
  .bc__control {
    border: none;
    cursor: text;
    box-shadow: none;
    background-color: ${props => props.theme['white']};
  }
  .bc__multi-value {
    cursor: auto;
  }
  .bc__multi-value__remove {
    cursor: pointer;
  }
  .bc__clear-indicator {
    display: none;
  }
`
const SearchLabel = styled.div`
  display: flex;
  border-radius: 4px;
  background-color: ${props =>
    props.background ? props.theme[toLower(props.background)] : 'initial'};
  > div {
    font-size: 14px;
    color: ${props =>
      props.theme[toLower(props.background)]
        ? props.theme['white']
        : props.theme['gray-5']};
  }
`
const multiValueContainer = props => {
  return (
    <SearchLabel background={props.data.value}>{props.children}</SearchLabel>
  )
}

const Menu = props => {
  const { btcBalance, bchBalance, ethBalance, ...rest } = props
  const { deviceInfo, handleCoinSelection, formValues, location } = rest

  const isActive = coin =>
    any(val => equals(toLower(prop('label', val)), toLower(coin)), formValues)

  return (
    <Container>
      <TitleBar>
        <TitleBarWrapper>
          {deviceInfo && (
            <Text size='24px' weight={400}>
              {deviceInfo.name}
            </Text>
          )}
          <LinkContainer to='/lockbox/settings'>
            <SettingsIcon name='settings-filled' size={'24px'} />
          </LinkContainer>
        </TitleBarWrapper>
      </TitleBar>
      <LinkContainer to='/lockbox/dashboard'>
        <CurrencyList>
          <CurrencyItem
            coin='btc'
            icon='bitcoin-filled'
            balance={btcBalance}
            isActive={isActive('btc')}
            isInactive={!isEmpty(formValues) && !isActive('btc')}
            onClick={() => handleCoinSelection('BTC')}
          />
          <CurrencyItem
            coin='bch'
            icon='bitcoin-filled'
            balance={bchBalance}
            isActive={isActive('bch')}
            isInactive={!isEmpty(formValues) && !isActive('bch')}
            onClick={() => handleCoinSelection('BCH')}
          />
          <CurrencyItem
            coin='eth'
            icon='ethereum-filled'
            balance={ethBalance}
            isActive={isActive('eth')}
            isInactive={!isEmpty(formValues) && !isActive('eth')}
            onClick={() => handleCoinSelection('ETH')}
          />
        </CurrencyList>
      </LinkContainer>
      <StyledCreatableInputContainer>
        <Text size='20px' weight={400}>
          {location.pathname.includes('/lockbox/dashboard') && (
            <FormattedMessage
              id='scenes.lockbox.menu.transactions'
              defaultMessage='Transactions'
            />
          )}
          {location.pathname.includes('/lockbox/settings') && (
            <FormattedMessage
              id='scenes.lockbox.menu.settings'
              defaultMessage='Settings'
            />
          )}
        </Text>
        <Field
          name='search'
          autoFocus
          component={CreatableInputField}
          multiValueContainer={multiValueContainer}
        />
      </StyledCreatableInputContainer>
    </Container>
  )
}

export default reduxForm({ form: 'lockboxTransactions' })(Menu)
