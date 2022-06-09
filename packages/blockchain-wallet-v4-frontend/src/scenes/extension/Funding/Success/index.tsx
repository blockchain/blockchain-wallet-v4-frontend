import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconCheck } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { Continue } from '../SelectAccount'

const ImageWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Success = () => {
  return (
    <>
      <ImageWrapper>
        <Icon size='lg' color='blue300' label='icon Check'>
          <IconCheck />
        </Icon>
        <Text style={{ marginTop: '20px', textAlign: 'center' }}>
          Success! <br />
          Your funds are now available
        </Text>
      </ImageWrapper>
      <Continue style={{ width: 'unset' }} to='/extension/home'>
        Continue
      </Continue>
    </>
  )
}
