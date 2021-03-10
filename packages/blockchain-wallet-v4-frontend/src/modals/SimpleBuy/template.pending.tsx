import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Icon,
  Text
} from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
`
const Container = styled.div`
  width: 100%;
  height: 100%;
`
const MainText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Subcontent = styled(Text)`
  margin: 38px 0 46px 0;
  display: flex;
  justify-content: center;
`
const Title = styled(Text)`
  margin: 16px 0;
  text-align: left;
`

const Pending: React.FC<{
  handleClose: () => void
  handleRefresh: () => void
}> = props => {
  return (
    <Top>
      <MainText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          data-e2e='sbCloseModalIcon'
          name='user'
          size='22px'
          color='blue600'
        />
        <Icon
          cursor
          data-e2e='sbCloseModalIcon'
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={props.handleClose}
        />
      </MainText>
      <Container>
        <Title color='textBlack' size='24px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.underreview'
            defaultMessage='ID Verification Pending'
          />
        </Title>
        <Title color='grey800' size='16px' weight={500}>
          <FormattedMessage
            id='scenes.exchange.getstarted.status.pending.description'
            defaultMessage='We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to trade cryptocurrency. You should receive an update within 5 minutes.'
          />
        </Title>
        <Subcontent>
          <BlockchainLoader height='80px' width='80px' />
        </Subcontent>
        <Button
          jumbo
          nature='primary'
          data-e2e='refreshKyc'
          onClick={props.handleRefresh}
          fullwidth
        >
          <FormattedMessage
            id='scenes.exchange.exchangeform.refreshlatest'
            defaultMessage='Refresh status.'
          />
        </Button>
      </Container>
    </Top>
  )
}

export default Pending
