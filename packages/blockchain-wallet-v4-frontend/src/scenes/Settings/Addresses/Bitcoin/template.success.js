import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`
const AddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`

const Success = (props) => {
  const { wallets } = props

  return (
    wallets.map((wallet, i) => {
      return (
        <Wrapper>
          <AddressesSettingHeader>
            <FormattedMessage id='scenes.settings.addresses.header' defaultMessage='Bitcoin Wallets' />
          </AddressesSettingHeader>
          <SettingDescription>
            <FormattedMessage id='scenes.settings.addresses.header' defaultMessage='Wallets are a way of organizing your funds. Common ways to organize your funds include dividing them up into categories like spending, savings, or business related expenses. Your wallet automatically manages your bitcoin addresses for you by generating a new one each time you need one to receive a payment. You can click on Manage to the right of a wallet to see all of the individual addresses that have been generated for that specific wallet.' />
          </SettingDescription>
          <div key={i}>
            <div>{ wallet.label }</div>
            <div>{ wallet.value.balance }</div>
          </div>
        </Wrapper>
      )
    })
  )
}

export default Success
