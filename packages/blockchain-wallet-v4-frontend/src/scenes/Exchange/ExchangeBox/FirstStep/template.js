import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  border: 1px solid black;
`

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const Body = styled.div`
  padding: 20px 30px;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0px 20px 20px 20px;
`

const FirstStep = (props) => {
  const { nextStep } = props

  return (
    <Wrapper>
      <Header>
        <Text>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.title' defaultMessage='Exchange Details' />
        </Text>
        <Text weight={300}>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.stepnumber' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Body>
        Exchange form
      </Body>
      <Footer>
        <Button nature='primary' fullwidth onClick={nextStep}>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.logout' defaultMessage='Next step' />
        </Button>
      </Footer>
    </Wrapper>
  )
}

export default FirstStep
