import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Banner, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  background-color: pink;
`

const Announcement = props => {
  const {  } = props

  return (
    <Wrapper>
      <Banner type='warning'>
        <Text size='12px'>THIS IS A PUBLIC SERVICE....</Text>
      </Banner>
    </Wrapper>
  )
}

Announcement.propTypes = {}

export default Announcement
