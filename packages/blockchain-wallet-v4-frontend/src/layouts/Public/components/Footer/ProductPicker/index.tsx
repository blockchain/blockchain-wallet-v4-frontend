import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { LoginSteps } from 'data/types'

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
  return (
    <>
      <SubCard
        onClick={() =>
          props.formActions.change('login', 'step', LoginSteps.PRODUCT_PICKER_BEFORE_AUTHENTICATION)
        }
      >
        <Text size='16px' color='grey400' weight={500}>
          <FormattedMessage
            id='layouts.wallet.footer.looking_product'
            defaultMessage='Looking for another product?'
          />
        </Text>
        &nbsp;
        <SignUpText size='16px' color='white' weight={600}>
          <FormattedMessage
            id='layouts.wallet.footer.select_product'
            defaultMessage='Select a Product ->'
          />
        </SignUpText>
      </SubCard>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export default connector(ProductPicker)
