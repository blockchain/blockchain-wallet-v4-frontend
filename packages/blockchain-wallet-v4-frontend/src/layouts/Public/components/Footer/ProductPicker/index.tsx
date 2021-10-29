import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bind } from 'ramda'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { LoginSteps, ProductAuthOptions } from 'data/types'

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`
const SignUpText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`

const ProductPicker = (props) => {
  const { authActions, formActions, formValues, productAuthMetadata } = props
  const handleProductPickerClick = () => {
    if (productAuthMetadata.product === ProductAuthOptions.WALLET) {
      authActions.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE })
      if (formValues.email) {
        formActions.change('login', 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE)
      } else {
        formActions.destroy('login')
        formActions.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID)
      }
    }
    if (productAuthMetadata.product === ProductAuthOptions.EXCHANGE) {
      authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET })
      formActions.change('login', 'step', LoginSteps.ENTER_PASSWORD_WALLET)
    }
  }

  return (
    <SubCard onClick={handleProductPickerClick}>
      <Text size='16px' color='grey400' weight={500}>
        {productAuthMetadata.product === ProductAuthOptions.WALLET && (
          <FormattedMessage
            id='scenes.login.wallet.exchange_link'
            defaultMessage='Looking for the Exchange?'
          />
        )}
        {productAuthMetadata.product === ProductAuthOptions.EXCHANGE && (
          <FormattedMessage
            id='scenes.login.wallet.wallet_link'
            defaultMessage='Looking for the Wallet?'
          />
        )}
      </Text>
      &nbsp;
      <SignUpText size='16px' color='white' weight={600}>
        <FormattedMessage id='scenes.login.wallet.exchange_login' defaultMessage='Log In ->' />
      </SignUpText>
    </SubCard>
  )
}
const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('login')(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(ProductPicker)
