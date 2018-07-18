import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`

const Lockbox = props => {
  return (
    <Wrapper>
      <div>
        <Text size='26px' weight='600'>
          <FormattedMessage
            id='scenes.lockbox.welcome.title'
            defaultMessage='Hardware secured digital assets'
          />
        </Text>
      </div>
      <div style={{ marginTop: '15px' }}>
        <Text size='14px' weight='300'>
          <FormattedMessage
            id='scenes.lockbox.welcome.subtitle'
            defaultMessage='Lockbox works with Carbon to give your digital assets an additional layer of security. Unlock your Lockbox by linking your Carbon, or buying one today.'
          />
        </Text>
      </div>
      <Buttons>
        <Button nature='secondary'>
          <FormattedMessage
            id='scenes.lockbox.welcome.buycarbon'
            defaultMessage='Buy a Carbon'
          />
        </Button>
        <Button nature='primary' style={{ marginLeft: '15px' }}>
          <FormattedMessage
            id='scenes.lockbox.welcome.linkcarbon'
            defaultMessage='Link My Carbon'
          />
        </Button>
      </Buttons>
    </Wrapper>
  )
}

export default Lockbox
