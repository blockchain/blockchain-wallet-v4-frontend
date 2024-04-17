import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { Button, Icon, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

import { LINK_BACK_TO_APP, TEXT_ELEMENTS, VFP_STORE_URL } from './constants'
import { ProveProps, ProveStates } from './types'

const ContentWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Prove: React.FC<ProveProps> = ({ location: { pathname, search } }) => {
  const isExpired = pathname.includes('/expired')
  const product = new URLSearchParams(search).get('product')
  const isBCPay = !!product && product === 'bc_pay'

  const [proveStatus, setProveStatus] = useState<ProveStates>(isExpired ? 'error' : 'loading')

  const {
    data: { api }
  } = useSelector(getDomains)

  const checkFingerprint = async () => {
    const vfp = new URLSearchParams(search).get('vfp')

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
    if (!isExpired) checkFingerprint()
  }, [])

  if (proveStatus === 'loading') return <SpinningLoader />

  const { description, iconProps, title } = TEXT_ELEMENTS(isBCPay)[proveStatus]

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
      {!isBCPay && (
        <Link href={LINK_BACK_TO_APP}>
          <Button data-e2e='back-to-app' fullwidth style={{ marginTop: '1rem' }}>
            <FormattedMessage
              id='scenes.prove.back'
              defaultMessage='Go back to the Blockchain.com App'
            />
          </Button>
        </Link>
      )}
    </Wrapper>
  )
}

export default Prove
