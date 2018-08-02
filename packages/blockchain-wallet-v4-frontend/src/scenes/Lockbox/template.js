import React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'ramda'
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
`

const Lockbox = props => {
  const { launchCarbonSetup, balances, devices } = props

  return (
    <Wrapper>
      <div>
        <Text size='26px' weight={600}>
          <FormattedMessage
            id='scenes.lockbox.welcome.title'
            defaultMessage='Hardware secured digital assets'
          />
        </Text>
      </div>
      <div style={{ marginTop: '15px' }}>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.welcome.subtitle'
            defaultMessage='Lockbox works with Carbon to give your digital assets an additional layer of security. Unlock your Lockbox by linking your Carbon, or buy one today.'
          />
        </Text>
      </div>
      <Buttons>
        <Button nature='primary' onClick={launchCarbonSetup}>
          <FormattedMessage
            id='scenes.lockbox.welcome.setupcarbon'
            defaultMessage='Setup Carbon'
          />
        </Button>
      </Buttons>

      {!isEmpty(devices) && (
        <React.Fragment>
          <Text size='24px' style={{ marginTop: '25px' }}>
            Lockboxes:
          </Text>
          <pre
            style={{
              width: '90%',
              'white-space': 'normal',
              'word-break': 'break-all'
            }}
          >
            {JSON.stringify(devices)}
          </pre>
        </React.Fragment>
      )}

      {!isEmpty(balances) && (
        <React.Fragment>
          <Text size='24px' style={{ marginTop: '25px' }}>
            Lockbox Final Balance BTC:
          </Text>
          <pre
            style={{
              width: '90%',
              'white-space': 'normal',
              'word-break': 'break-all'
            }}
          >
            {balances}
          </pre>
        </React.Fragment>
      )}
    </Wrapper>
  )
}

export default Lockbox
