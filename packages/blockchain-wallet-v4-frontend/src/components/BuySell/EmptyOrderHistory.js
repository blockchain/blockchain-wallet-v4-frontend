import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 50px;
`
const Header = styled(Text)`
  margin-top: 30px;
  margin-bottom: 20px;
`

class EmptyOrderHistoryContainer extends React.PureComponent {
  render () {
    const { changeTab } = this.props
    return (
      <Wrapper>
        <Empty>
          <Image name='empty-tx' width='300px' />
          <Header size='18px' weight={500}>
            <FormattedMessage id='scenes.buysell.empty.content.header' defaultMessage="We couldn't find any trades!" />
          </Header>
          <TextGroup inline>
            <Text size='18px' weight={300}>
              <FormattedMessage id='scenes.buysell.empty.content.goto' defaultMessage='To get started, go to ' />
            </Text>
            <Link size='18px' onClick={() => changeTab('buy')}>
              <FormattedMessage id='scenes.buysell.empty.content.buy' defaultMessage='buy ' />
            </Link>
            <Text>
              <FormattedMessage id='or' defaultMessage='or ' />
            </Text>
            <Link size='18px' onClick={() => changeTab('sell')}>
              <FormattedMessage id='scenes.buysell.empty.content.sell' defaultMessage='sell ' />
            </Link>
          </TextGroup>
        </Empty>
      </Wrapper>
    )
  }
}

export default EmptyOrderHistoryContainer
