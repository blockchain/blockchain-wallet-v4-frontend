import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  > div {
    margin: 8px 0;
  }
`

const ProductImageRow = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  margin: 32px 0;
  ${media.mobile`
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
`}
`
const ProductImage = styled(Image)`
  margin: 0 1.5rem;
  cursor: pointer;
  height: 400px;
  transition: transform 0.5s ease 0s, box-shadow 0.5s ease 0s;
  &:hover {
    transform: scale(1.05);
    box-shadow: #000 0 8px 16px 8px, #000 0 2px 8px 2px;
  }
  ${media.mobile`
  flex-direction: column;
  align-items: center;
  height: 275px;
  margin: 1rem 0;
`}
`
const WhiteCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: white;
  border-radius: 36px;
`

const ProductPicker = ({ exchangeRedirect, isAccountReset, walletRedirect }: Props) => {
  return (
    <>
      <TitleWrapper>
        <WhiteCircle>
          <Icon color='success' name='checkmark-circle-filled' size='40px' />
        </WhiteCircle>
        <Text color='white' size='20px' weight={600} lineHeight='1.5'>
          {isAccountReset ? (
            <FormattedMessage
              id='scenes.register.account_recovered'
              defaultMessage='Account Recovered!'
            />
          ) : (
            <FormattedMessage
              id='scenes.register.account_created'
              defaultMessage='Account Created!'
            />
          )}
        </Text>
        <Text color='white' size='16px' weight={500} lineHeight='1.5'>
          <FormattedMessage
            id='scenes.register.selectproduct'
            defaultMessage='Select a product to launch now.'
          />
        </Text>
      </TitleWrapper>
      <ProductImageRow>
        <Link onClick={walletRedirect}>
          <ProductImage name='product-redirect-wallet' />
        </Link>
        <Link onClick={exchangeRedirect}>
          <ProductImage name='product-redirect-exchange' />
        </Link>
      </ProductImageRow>
    </>
  )
}

type Props = {
  exchangeRedirect: () => void
  isAccountReset: boolean
  walletRedirect: () => void
}

export default ProductPicker
