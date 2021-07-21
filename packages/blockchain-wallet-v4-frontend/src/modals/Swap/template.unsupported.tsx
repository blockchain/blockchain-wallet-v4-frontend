import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export type Props = {
  handleClose: () => void
}

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Unsupported: React.FC<Props> = (props) => {
  return (
    <Top>
      <Container>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.swap.unsuported.title'
            defaultMessage='SWAP Crypto Coming Soon for your region'
          />
        </Title>
        <Subcontent color='grey600' weight={500}>
          <>
            <FormattedMessage
              id='modals.swap.unsuported.subcontent'
              defaultMessage="Well this is awkward. We don't support swap crypto yet for your region."
            />
          </>{' '}
          <FormattedMessage
            id='modals.simplebuy.unsupported-subcontent-2'
            defaultMessage="We'll send you an update when we do."
          />
        </Subcontent>
        <Button
          data-e2e='submitSwapAmount'
          height='48px'
          size='16px'
          nature='primary'
          onClick={props.handleClose}
          fullwidth
        >
          <FormattedMessage id='buttons.ok' defaultMessage='OK' />
        </Button>
      </Container>
    </Top>
  )
}

export default Unsupported
