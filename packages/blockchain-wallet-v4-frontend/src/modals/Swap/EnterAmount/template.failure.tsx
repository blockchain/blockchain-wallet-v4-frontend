import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Failure: React.FC<Props> = props => {
  return (
    <>
      <FlyoutWrapper>
        <Wrapper>
          <Icon name='alert-filled' size='54px' color='red600' />
          {props.error === 'Custodial trading is disabled' ? (
            <>
              <Text size='14px' weight={500} style={{ marginTop: '8px' }}>
                <FormattedMessage
                  id='copy.swap_account_from_error'
                  defaultMessage='You cannot swap between these types of accounts. Try changing the From account.'
                />
              </Text>
              <Button
                jumbo
                fullwidth
                data-e2e='retrySwap'
                nature='primary'
                onClick={() => props.swapActions.setStep({ step: 'INIT_SWAP' })}
                style={{ marginTop: '16px' }}
              >
                <FormattedMessage
                  id='buttons.tryagain'
                  defaultMessage='Try Again'
                />
              </Button>
            </>
          ) : (
            <>
              <Text size='14px' weight={500} style={{ marginTop: '8px' }}>
                <FormattedMessage
                  id='copy.unknown_error'
                  defaultMessage='An unknown error has occurred.'
                />
              </Text>
              <Button
                jumbo
                fullwidth
                data-e2e='retrySwap'
                nature='primary'
                onClick={() => props.swapActions.initAmountForm()}
                style={{ marginTop: '16px' }}
              >
                <FormattedMessage
                  id='buttons.tryagain'
                  defaultMessage='Try Again'
                />
              </Button>
            </>
          )}
          <Link
            href='https://support.blockchain.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Text
              size='12px'
              color='blue600'
              style={{ textAlign: 'center', marginTop: '8px' }}
            >
              <FormattedMessage
                id='buttons.contact_support'
                defaultMessage='Contact Support'
              />
            </Text>
          </Link>
        </Wrapper>
      </FlyoutWrapper>
      <Wrapper>
        <ErrorCartridge>
          Server Error:{' '}
          {typeof props.error === 'string'
            ? props.error
            : JSON.stringify(props.error)}
        </ErrorCartridge>
      </Wrapper>
    </>
  )
}

type Props = OwnProps & { error: string }

export default Failure
