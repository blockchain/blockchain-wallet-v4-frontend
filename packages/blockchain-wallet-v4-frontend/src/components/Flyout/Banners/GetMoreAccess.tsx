import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 12px;
  padding: 16px 18px;
  margin: 10px 0;
  cursor: pointer;
  box-shadow: 0px 0px 24px rgba(5, 24, 61, 0.08);

  ${media.atLeastLaptop`
    height: 72px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`

const SpacedRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex: 1;
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 55px;
  justify-content: flex-start;
`

const GetMoreAccess = ({ startProcess }: Props) => {
  return (
    <Wrapper onClick={startProcess}>
      <SpacedRow>
        <ImageWrapper>
          <Image size='24px' name='lock-open' />
        </ImageWrapper>
        <Column>
          <Text size='16px' weight={600} color='grey900'>
            <FormattedMessage
              id='scenes.home.banners.get_more_access.title'
              defaultMessage='Get More Access When You Verify'
            />
          </Text>
          <Text size='12px' weight={500} color='grey600' style={{ marginTop: '8px' }}>
            <FormattedMessage
              id='scenes.home.banners.get_more_access.description'
              defaultMessage='After completing this transaction, verify to unlock higher transaction limits and more payment methods.'
            />
          </Text>
        </Column>
        <Icon name='chevron-right' color='grey400' size='24px' />
      </SpacedRow>
    </Wrapper>
  )
}

type Props = { startProcess: () => void }

export default GetMoreAccess
