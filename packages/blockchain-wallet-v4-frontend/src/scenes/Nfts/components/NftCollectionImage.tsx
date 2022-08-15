import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconVerified } from '@blockchain-com/icons'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey100};
`

const IconWrapper = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  background: ${(props) => props.theme.white};
`

const NftCollectionImage: React.FC<Props> = ({ alt, isVerified, src }) => {
  return (
    <Wrapper>
      {isVerified ? (
        <IconWrapper>
          <Icon label='verified' color='orange400'>
            <IconVerified />
          </Icon>
        </IconWrapper>
      ) : null}
      <StyledImage src={src} alt={alt} />
    </Wrapper>
  )
}

type Props = {
  alt: string
  isVerified: boolean
  src: string
}

export default NftCollectionImage
