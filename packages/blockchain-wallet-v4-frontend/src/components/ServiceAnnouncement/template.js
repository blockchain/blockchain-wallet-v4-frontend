import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Banner, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: pink;
  z-index: 10;
`

const Announcement = props => {
  const {  } = props

  return (
    <Wrapper>
      <Banner type='warning' dismissible={true}>
        <TextGroup style={{ padding: '0 10px'}}>
          <Text size='18px'>We’re packing our bags and preparing to move... domains!</Text>
          <Text size='12px'>To make way for our new and exciting products coming this year, we’re saying hello to our new home. Your Blockchain Wallet will soon be changing URLs as it's combined with our company site, blockchain.com. Read more about what to expect</Text>
        </TextGroup>
      </Banner>
    </Wrapper>
  )
}

Announcement.propTypes = {}

export default Announcement
