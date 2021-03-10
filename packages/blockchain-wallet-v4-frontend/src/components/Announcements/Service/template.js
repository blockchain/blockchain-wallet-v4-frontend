import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Banner, Button, Icon, Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme[props.backgroundColor]};
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  margin: 0 auto;
  overflow: hidden;
  padding: 12px 25px;
  box-sizing: border-box;
  height: ${props => (props.collapsed ? '40px' : '')};
  width: 100%;
`

const ServiceBadge = styled(Banner)`
  margin-left: 0;

  > div {
    font-weight: 600;
    font-size: 12px;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const Content = styled.div`
  flex: 2;
  width: 100%;
`
const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > :first-child {
    margin-right: 16px;
  }
`
const ActionIcon = styled(Icon)`
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`
const ActionButton = styled(Button)`
  height: 32px;
  margin-right: 20px;
  padding: 0;
  min-width: auto;

  > a {
    font-weight: 600;
    font-size: 14px;
    padding: 0 12px;
  }
`

const selectStyle = type => {
  switch (type) {
    case 'danger':
      return {
        backgroundColor: 'error',
        textColor: 'white',
        uppercase: true
      }
    case 'info':
      return {
        backgroundColor: 'blue600',
        textColor: 'white',
        uppercase: false
      }
    default:
      return {
        backgroundColor: 'textBlack',
        textColor: 'grey200',
        uppercase: false
      }
  }
}

const Announcement = props => {
  const { announcement, collapsed, handleDismiss, lang, toggleCollapse } = props
  const { action, header, hideType, icon, id, sections, type } = announcement
  const { backgroundColor, textColor, uppercase } = selectStyle(type)

  return (
    <Container collapsed={collapsed} backgroundColor={backgroundColor}>
      <Wrapper>
        <Content>
          <Title>
            {id === 'blockchain-rebrand' && (
              <ServiceBadge type='white' inline>
                Update
              </ServiceBadge>
            )}
            {icon && <Icon name={icon} size='20px' color={textColor} />}
            <Text size='16px' color='white' uppercase={uppercase} weight={500}>
              {header[lang] ? header[lang] : header.en}
            </Text>
          </Title>
          <div style={{ display: collapsed ? 'none' : '' }}>
            {sections &&
              sections.map((section, i) => {
                return (
                  <Text
                    color={textColor}
                    key={i}
                    size='13px'
                    style={{ margin: '8px 0 0' }}
                  >
                    {section.body[lang] ? section.body[lang] : section.body.en}
                  </Text>
                )
              })}
          </div>
        </Content>
      </Wrapper>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {action && action.title && (
          <ActionButton nature='empty-secondary'>
            <Link href={action.link} target='_blank'>
              {action.title[lang] ? action.title[lang] : action.title.en}
            </Link>
          </ActionButton>
        )}
        {hideType === 'collapse' && (
          <ActionIcon
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size='24px'
            weight={600}
            color='white'
            onClick={() => toggleCollapse(id, collapsed)}
          />
        )}
        {hideType === 'dismiss' && (
          <ActionIcon
            name='close'
            size='14px'
            weight={700}
            color='white'
            onClick={() => handleDismiss(id)}
          />
        )}
      </div>
    </Container>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.object.isRequired
}

export default Announcement
