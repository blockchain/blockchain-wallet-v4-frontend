import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
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
  margin-top: 20px;
`
const Header = styled(Text)`
  margin-top: 30px; 
  margin-bottom: 20px;
`

class DataErrorContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Empty>
          <Image name='empty-search' width='260px' />
          <Header size='18px' weight={500}>
            <FormattedMessage id='components.dataerror.header' defaultMessage='Oops, something went wrong here!' />
          </Header>
          <TextGroup inline>
            <Text size='18px' weight={300}>
              <FormattedHTMLMessage id='components.dataerror.body' defaultMessage='Please ' />
            </Text>
            <Link size='18px' onClick={this.props.onClick}>
              <FormattedMessage id='components.dataerror.click' defaultMessage='click here' />
            </Link>
            <Text size='18px' weight={300}>
              <FormattedHTMLMessage id='components.dataerror.refresh' defaultMessage=' to refresh.' />
            </Text>
          </TextGroup>
        </Empty>
      </Wrapper>
    )
  }
}

DataErrorContainer.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DataErrorContainer
