import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import FaqRow from './../FaqRow'

const Wrapper = styled.div`
  margin-bottom: 20px;
`

const GroupTitle = styled(Text)`
 font-size: 14px;
 font-weight: 600;
 padding-bottom: 4px;
`

const FaqGroup = (props) => {
  const { groupTitleId, groupTitleMsg, groupQuestions } = props

  return (
    <Wrapper>
      <GroupTitle>
        <FormattedMessage id={groupTitleId} defaultMessage={groupTitleMsg} />
      </GroupTitle>
      {
        groupQuestions.length > 0 && groupQuestions.map((q, i) => {
          return <FaqRow title={q.question} description={q.answer} key={i} />
        })
      }
    </Wrapper>
  )
}

FaqGroup.propTypes = {
  groupTitleMsg: PropTypes.string.isRequired,
  groupTitleId: PropTypes.string.isRequired,
  groupQuestions: PropTypes.array.isRequired
}

export default FaqGroup
