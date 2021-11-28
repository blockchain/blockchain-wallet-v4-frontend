import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
  position: relative;
  height: 100%;
`
const CloseIcon = styled(Icon)`
  position: absolute;
  padding: inherit;
  left: 380px;
  top: 0;
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
  margin: 40px 0 16px 0;
  text-align: center;
`
const SubContent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Failure: React.FC<Props> = (props) => (
  <Top>
    <CloseIcon
      cursor
      name='close'
      size='20px'
      color='grey600'
      role='button'
      onClick={props.handleClose}
    />
    <Container>
      <Image
        width='48px'
        height='48px'
        name='world-alert'
        srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
      />
      <Title color='grey800' size='20px' weight={600}>
        <FormattedMessage id='copy.connection_error' defaultMessage='Connection Error' />
      </Title>
      <SubContent color='grey600' weight={500}>
        <FormattedMessage
          id='scenes.walletconnect.server_failure'
          defaultMessage='Failed to connect with Wallet Connect servers'
        />
      </SubContent>
    </Container>
  </Top>
)

type Props = {
  handleClose: () => void
}

export default Failure
