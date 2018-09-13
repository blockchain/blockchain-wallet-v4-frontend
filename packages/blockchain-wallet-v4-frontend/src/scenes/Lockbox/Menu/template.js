import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'
import { Text } from 'blockchain-info-components'
import { CreatableInputField } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { toLower } from 'ramda'

import CurrencyList from './CurrencyList'
import DeviceTitle from './DeviceTitle'

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
  padding: 15px 30px;
`
const StyledCreatableInputContainer = styled.div`
  display: flex;
  padding: 15px 30px;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
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
const CurrencyListContainer = styled.div``

const multiValueContainer = props => {
  return (
    <SearchLabel background={props.data.value}>{props.children}</SearchLabel>
  )
}

const Menu = props => {
  const {
    btcBalance,
    bchBalance,
    ethBalance,
    deviceInfo,
    deviceIndex,
    ...rest
  } = props
  const { location } = rest

  return (
    <Container>
      <TitleBar>
        <TitleBarWrapper>
          <DeviceTitle deviceInfo={deviceInfo} deviceIndex={deviceIndex} />
        </TitleBarWrapper>
      </TitleBar>
      <LinkContainer to='/lockbox/dashboard'>
        <CurrencyListContainer>
          <CurrencyList deviceInfo={deviceInfo} />
        </CurrencyListContainer>
      </LinkContainer>
      {deviceInfo && (
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
      )}
    </Container>
  )
}

export default reduxForm({ form: 'lockboxTransactions' })(Menu)
