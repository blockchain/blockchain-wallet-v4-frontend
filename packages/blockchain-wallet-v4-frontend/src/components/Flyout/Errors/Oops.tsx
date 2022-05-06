import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 56px;
  box-sizing: border-box;
`
const Title = styled(Text)`
  margin: 40px 0 24px;
`

const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red800};
  margin-bottom: 16px;
`

const Failure = (props: FailurePropsType) => {
  let text = <FormattedMessage id='buttons.close' defaultMessage='Close' />
  switch (props.action) {
    case 'retry':
    default:
      text = <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
      break
  }
  return (
    <Wrapper>
      <div>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title weight={600} size='20px' lineHeight='150%'>
          <FormattedMessage
            id='modals.simplebuy.eligible.failure'
            defaultMessage='Oops. Something went wrong on our side. Please try again.'
          />
        </Title>
        {props.errorMessage && (
          <ErrorTextContainer>
            <ErrorText>
              <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
              Error: {props.errorMessage}
            </ErrorText>
          </ErrorTextContainer>
        )}
        <Button
          fullwidth
          height='48px'
          data-e2e={props['data-e2e']}
          nature='primary'
          size='16px'
          onClick={props.handler}
        >
          {text}
        </Button>
      </div>
    </Wrapper>
  )
}

type FailurePropsType = {
  action: 'retry' | 'close'
  'data-e2e': string
  errorMessage?: string
  handler: () => void
}

export default Failure
