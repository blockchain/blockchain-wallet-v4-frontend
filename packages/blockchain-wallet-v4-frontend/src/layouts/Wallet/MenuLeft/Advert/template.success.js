import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 0;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
`
const Image = styled.img`
  height: 30px;
`

const Advert = props => {
  const { adverts } = props

  return (
    <Wrapper>
      <Text size='14px' weight={400} uppercase>
        <FormattedMessage id='layouts.menuleft.advert.sponsored' defaultMessage='Sponsored links' />
      </Text>
      {adverts.map(function (advert, index) {
        return (
          <Container key={index}>
            <Link href={advert.url} target='_blank'>
              <Image src={advert.data} />
            </Link>
            {advert.name && <Text size='14px' weight={400} uppercase>{advert.name}</Text>}
          </Container>
        )
      })}
    </Wrapper>
  )
}

Advert.propTypes = {
  adverts: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string
  })).isRequired
}

Advert.defaultProps = {
  adverts: []
}

export default Advert
