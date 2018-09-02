import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'
import { CreatableInputField } from 'components/Form'
import { CurrencyItem } from 'components/Balances'

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
  margin: 15px 40px;
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
const StyledCreatableInput = styled.div`
  .bc__control {
    border: none;
    box-shadow: none;
    background-color: ${props => props.theme['white']};
  }
`
const SearchLabel = styled.div`
  display: flex;
  border-radius: 2px;
  background-color: ${props => props.theme[props.background]};
  > div {
    color: ${props =>
      props.theme[props.background]
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
  const { deviceName, handleCoinSelection } = rest

  return (
    <Container>
      <TitleBar>
        <TitleBarWrapper>
          <Text size='24px' weight={400}>
            {deviceName}
          </Text>
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
            onClick={() => handleCoinSelection('btc')}
          />
          <CurrencyItem
            coin='bch'
            icon='bitcoin-filled'
            balance={bchBalance}
            onClick={() => handleCoinSelection('bch')}
          />
          <CurrencyItem
            coin='eth'
            icon='ethereum-filled'
            balance={ethBalance}
            onClick={() => handleCoinSelection('eth')}
          />
        </CurrencyList>
      </LinkContainer>
      <StyledCreatableInput>
        <Field
          name='search'
          component={CreatableInputField}
          multiValueContainer={multiValueContainer}
        />
      </StyledCreatableInput>
    </Container>
  )
}

export default reduxForm({ form: 'lockboxTransactions' })(Menu)
