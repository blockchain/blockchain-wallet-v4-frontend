import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { ProductAuthMetadata, ProductAuthOptions } from 'data/types'

const SubCard = styled.div`
  display: flex;
  justify-content: center;
`
const SignUpText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`

const CreateAccount = ({ productAuthMetadata: { product } }: Props) => {
  return (
    <>
      {product === ProductAuthOptions.EXCHANGE && (
        <Link
          data-e2e='exchangeSignupLink'
          target='_blank'
          rel='noopener noreferrer'
          href='https://exchange.blockchain.com/trade/signup'
        >
          <SubCard>
            <Text size='16px' color='grey400' weight={500}>
              <FormattedMessage
                id='scenes.login.account_signup'
                defaultMessage="Don't have a Blockchain Account?"
              />
            </Text>
            &nbsp;
            <SignUpText size='16px' color='white' weight={600}>
              <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
            </SignUpText>
          </SubCard>
        </Link>
      )}
      {product === ProductAuthOptions.WALLET && (
        <LinkContainer data-e2e='signupLink' to='/signup'>
          <Link>
            <SubCard>
              <Text size='16px' color='grey400' weight={500}>
                <FormattedMessage
                  id='scenes.login.account_signup'
                  defaultMessage="Don't have a Blockchain Account?"
                />
              </Text>
              &nbsp;
              <SignUpText size='16px' color='white' weight={600}>
                <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
              </SignUpText>
            </SubCard>
          </Link>
        </LinkContainer>
      )}
    </>
  )
}

type Props = {
  productAuthMetadata: ProductAuthMetadata
}

export default CreateAccount
