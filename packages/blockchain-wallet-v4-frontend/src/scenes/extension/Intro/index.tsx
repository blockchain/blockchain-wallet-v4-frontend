import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import Images from 'blockchain-info-components/src/Images/Images'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.exchangeLogin};
  position: relative;
  padding: 24px !important;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  & > div {
    height: 100%;
    flex: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .content {
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
`

const Footer = styled.div`
  width: 100%;
`

const Intro = () => {
  return (
    <Wrapper>
      <div>
        <div className='content'>
          <img width={64} src={Images['blockchain-icon']} alt='' />
          <Text
            size='24px'
            style={{ marginBottom: '24px', marginTop: '48px' }}
            color='white'
            weight={600}
          >
            <FormattedMessage
              id='modals.wallet.tour.wallet.tour'
              defaultMessage='Welcome to Blockchain!'
            />
          </Text>
          <Text color='grey600' size='14px' weight={500}>
            <FormattedMessage
              id='extension.blockchainDescription'
              defaultMessage='The easy way to send, receive, store and trade digital currencies.'
            />
          </Text>
        </div>
        <Footer>
          <Button
            capitalize
            data-e2e='installAndroidAppBtn'
            height='48px'
            fullwidth
            nature='secondary'
            // onClick={() => console.log('Click')}
            size='16px'
          >
            Log In
          </Button>
        </Footer>
      </div>
    </Wrapper>
  )
}

export default Intro
