import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const ContentWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const VFP_STORE_URL = '/onboarding/prove/possession/instant-link/vfp-store'

const ELEMENTS = {
  error: {
    description:
      'Return to the Blockchain.com App to get a new one and continue with the verification process.',
    iconProps: {
      color: 'error',
      name: 'close-circle'
    },
    title: 'Your link has expired'
  },
  verified: {
    description: 'Return to the Blockchain.com App to continue with the verification process.',
    iconProps: {
      color: 'success',
      name: 'checkmark-circle-filled'
    },
    title: 'Your device is verified!'
  }
}

type Props = {
  isExpired?: boolean
  location: {
    pathname: string
    search: string
  }
}

const Prove: React.FC<Props> = ({ location: { pathname, search } }) => {
  const isExpired = pathname.includes('/expired')

  const [proveStatus, setProveStatus] = useState<'loading' | 'error' | 'verified'>(
    isExpired ? 'error' : 'loading'
  )

  const {
    data: { api }
  } = useSelector(getDomains)

  const checkFingerprint = async () => {
    const vfp = new URLSearchParams(search || '').get('vfp')

    axios
      .post(`${api}${VFP_STORE_URL}`, { vfp })
      .then(() => {
        setProveStatus('verified')
      })
      .catch(() => {
        setProveStatus('error')
      })
  }

  useEffect(() => {
    // if(!isExpired) checkFingerprint()
    setTimeout(() => {
      setProveStatus('verified')
    }, 2000)
  }, [])

  if (proveStatus === 'loading') return <SpinningLoader />

  const { description, iconProps, title } = ELEMENTS[proveStatus]

  return (
    <Wrapper>
      <ContentWrapper>
        <Icon {...iconProps} size='40px' />
        <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }} lineHeight='30px'>
          <FormattedMessage id={`scenes.prove.title.${proveStatus}`} defaultMessage={title} />
        </Text>
        <Text
          color='grey900'
          style={{ marginTop: '1rem' }}
          size='16px'
          weight={500}
          lineHeight='1.5rem'
        >
          <FormattedMessage
            id={`scenes.prove.description.${proveStatus}`}
            defaultMessage={description}
          />
        </Text>
      </ContentWrapper>
      <Button data-e2e='back-to-app' fullwidth onClick={() => {}} style={{ marginTop: '1rem' }}>
        <FormattedMessage
          id='scenes.prove.back'
          defaultMessage='Go back to the Blockchain.com App'
        />
      </Button>
    </Wrapper>
  )
}

export default Prove
