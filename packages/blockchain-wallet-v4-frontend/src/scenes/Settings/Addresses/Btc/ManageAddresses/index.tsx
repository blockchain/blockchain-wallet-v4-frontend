import React from 'react'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { model } from 'data'

import UnusedAddresses from './UnusedAddresses'
import UsedAddresses from './UsedAddresses'
const { WALLET_TX_SEARCH } = model.form

const Wrapper = styled.section`
  box-sizing: border-box;
`
class ManageAddressesContainer extends React.PureComponent<
  InjectedFormProps<{}, {}>
> {
  render() {
    // @ts-ignore
    const routeParams = this.props.match.params
    return (
      <Wrapper>
        <UnusedAddresses
          // @ts-ignore
          derivation={routeParams.derivation}
          // @ts-ignore
          walletIndex={routeParams.walletIndex}
        />
        <UsedAddresses
          // @ts-ignore
          derivation={routeParams.derivation}
          // @ts-ignore
          walletIndex={routeParams.walletIndex}
        />
      </Wrapper>
    )
  }
}

export default reduxForm<{}, {}>({
  form: WALLET_TX_SEARCH
})(ManageAddressesContainer)
