import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconVerified } from '@blockchain-com/icons'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
`

export const StyledImage = styled.img`
  border-radius: 50%;
  height: 24px;
  width: 24px;
`
const IconWrapper = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  background: ${(props) => props.theme.white};
`

const NftCollectionImageSmall: React.FC<Props> = ({ alt, isVerified, src }) => {
  return (
    <Wrapper>
      {isVerified ? (
        <IconWrapper>
          <Icon label='verified' color='blue600'>
            <IconVerified />
          </Icon>
        </IconWrapper>
      ) : null}
      <StyledImage alt={alt} src={src} />
    </Wrapper>
  )
}

type Props = {
  alt: string
  isVerified: boolean
  src: string
}

export default NftCollectionImageSmall
