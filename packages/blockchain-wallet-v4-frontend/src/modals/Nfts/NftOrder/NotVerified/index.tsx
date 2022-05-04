import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import { NftOrderStepEnum } from '../../../../data/components/nfts/types'
import { Props as OwnProps } from '..'

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 15em;
  font-family: Inter, sans-serif;
  font-style: normal;
  text-align: center;
`
const Subtitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
`

const ButtonWrapper = styled.div`
  display: block;
  margin-left: 4em;
  position: absolute;
  bottom: 2em;
`

const NftOrderNotVerified: React.FC<Props> = (props: any) => {
  const { nftActions } = props

  const Continue = () => {
    nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })
  }

  const Cancel = () => {
    props.close()
  }
  return (
    <div>
      <>
        <Title>
          <Text size='20px' color={colors.grey900} weight={600}>
            This Collection Is Not Yet Verified
          </Text>
        </Title>
        <Subtitle>
          <Text size='14px' color='black' weight={600} style={{ padding: '1em' }}>
            Blockchain.com can not verify the validity or safety of this collection and recommend
            you proceed with caution
          </Text>
        </Subtitle>
        <ButtonWrapper>
          <Button
            nature='primary'
            height='56px'
            onClick={Continue}
            size='large'
            width='20em'
            data-e2e='submitProfileDetails'
          >
            <Text color='white' size='16px' weight={500}>
              <FormattedMessage id='modals.prompt.button' defaultMessage='Continue' />
            </Text>
          </Button>
          <Button
            nature='empty-blue'
            height='56px'
            size='large'
            width='20em'
            margin='0.5em 0em'
            onClick={Cancel}
            data-e2e='submitProfileDetails'
          >
            <Text color={colors.blue600} size='16px' weight={500}>
              <FormattedMessage id='modals.prompt.button' defaultMessage='Cancel & Go Back' />
            </Text>
          </Button>
        </ButtonWrapper>
      </>
    </div>
  )
}

type Props = OwnProps

export default NftOrderNotVerified
