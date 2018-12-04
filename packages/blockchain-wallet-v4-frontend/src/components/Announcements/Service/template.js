import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import media from 'services/ResponsiveService'
import { Link, Icon, Text } from 'blockchain-info-components'

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
    margin-right: 8px;
  }
`
const ActionLink = styled(Link)`
  white-space: nowrap;
  text-decoration: underline;
  & > :first-child {
    margin: 10px 0 6px;
  }
  ${media.mobile`
    margin: 0px;
  `};
`
const ActionIcon = styled(Icon)`
  margin-left: 10px;
  &:hover {
    cursor: pointer;
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
        backgroundColor: 'info',
        textColor: 'white',
        uppercase: false
      }
    default:
      return {
        backgroundColor: 'textBlack',
        textColor: 'gray-2',
        uppercase: false
      }
  }
}

const Announcement = props => {
  const { announcement, collapsed, lang, handleDismiss, toggleCollapse } = props
  const { action, header, hideType, id, icon, sections, type } = announcement
  const { backgroundColor, textColor, uppercase } = selectStyle(type)

  return (
    <Container collapsed={collapsed} backgroundColor={backgroundColor}>
      <Wrapper>
        <Content>
          <Title>
            {icon && <Icon name={icon} size='20px' color={textColor} />}
            <Text size='14px' color='white' uppercase={uppercase}>
              {header[lang] ? header[lang] : header.en}
            </Text>
          </Title>
          <div style={{ display: collapsed ? 'none' : '' }}>
            {sections.map((section, i) => {
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
            {action.title && (
              <ActionLink href={action.link} color={textColor} target='_blank'>
                <Text weight={400} color={textColor} size='14px'>
                  {action.title[lang] ? action.title[lang] : action.title.en}
                </Text>
              </ActionLink>
            )}
          </div>
        </Content>
      </Wrapper>
      <div>
        {hideType === 'collapse' && (
          <ActionIcon
            name={collapsed ? 'down-arrow' : 'up-arrow'}
            size='14px'
            weight={600}
            color='white'
            onClick={() => toggleCollapse(id, collapsed)}
          />
        )}
        {hideType === 'dismiss' && (
          <ActionIcon
            name='close'
            size='14px'
            weight={600}
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
