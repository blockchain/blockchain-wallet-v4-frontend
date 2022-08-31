import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconAlert, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'

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
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${(props) => props.theme.red000};
  padding: 6px 12px;
  border-radius: 32px;
  margin-bottom: 16px;
`
const ErrorText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.red800};
  margin-left: 0.5rem;
`

const Failure = (props: Props) => {
  let text = <FormattedMessage id='buttons.close' defaultMessage='Close' />
  switch (props.action) {
    case 'retry':
    default:
      text = <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
      break
  }

  const message =
    typeof props.errorMessage === 'string'
      ? props.errorMessage
      : props.errorMessage?.network_error_description
      ? props.errorMessage.network_error_description
      : null

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
        {message && (
          <ErrorTextContainer>
            <IconAlert color={PaletteColors['red-600']} label='alert' />
            <ErrorText>{message}</ErrorText>
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

type Props = {
  action: 'retry' | 'close'
  'data-e2e': string
  errorMessage?: string | PartialClientErrorProperties
  handler: () => void
}

export default Failure
