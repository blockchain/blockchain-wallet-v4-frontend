import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconImage, IconPlayCircle, IconQuestion } from '@blockchain-com/icons'
import styled from 'styled-components'

const Wrapper = styled.div<{ right: string; top: string }>`
  position: absolute;
  top: ${(props) => props.top};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.greyFade400};
  right: ${(props) => props.right};
`

const NftAssetImageType: React.FC<Props> = ({ animation_url, image_url, ...rest }) => {
  return (
    <Wrapper {...rest}>
      <Icon size='sm' color='white900' label='asset-type'>
        {animation_url ? <IconPlayCircle /> : image_url ? <IconImage /> : <IconQuestion />}
      </Icon>
    </Wrapper>
  )
}

type Props = {
  animation_url?: string | null
  image_url?: string | null
  right: string
  top: string
}

export default NftAssetImageType
