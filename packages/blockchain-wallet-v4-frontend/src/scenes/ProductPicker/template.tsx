import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

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
`
const ProductImage = styled(Image)`
  margin: 0 1.5rem;
  cursor: pointer;
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

const ProductPicker = ({ walletRedirect }: Props) => {
  return (
    <>
      <TitleWrapper>
        <WhiteCircle>
          <Icon color='success' name='checkmark-circle-filled' size='40px' />
        </WhiteCircle>
        <Text color='white' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage
            id='scenes.register.account_created'
            defaultMessage='Account Created!'
          />
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
          <ProductImage name='product-redirect-wallet' height='400px' />
        </Link>
        <ProductImage name='product-redirect-exchange' height='400px' />
      </ProductImageRow>
    </>
  )
}

type Props = {
  walletRedirect: () => void
}

export default ProductPicker
