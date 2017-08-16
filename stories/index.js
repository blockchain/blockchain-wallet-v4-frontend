import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withInfo, setDefaults } from '@storybook/addon-info'

import Welcome from './welcome.js'
import Page from './myPage.js'
import { Button, ButtonGroup, ConfirmationGauge,
          Icon, SimpleDropdown, Link, Modal, Separator, Tooltip,
          Text, TextGroup } from '../src'

addDecorator(story => (<Page>{story()}</Page>))
addDecorator((story, context) => withInfo('Documentation')(story)(context))

// Set default settings for addon-info
setDefaults({
  inline: true
})

storiesOf('Welcome', module)
  .add('Introduction', () => <Welcome />)

storiesOf('Buttons', module)
  .add('Button', () => <Button>Button</Button>)
  .add('Button primary', () => <Button type='primary'>Button primary</Button>)
  .add('Button secondary', () => <Button type='secondary'>Button secondary</Button>)
  .add('Button rounded', () => <Button rounded>Button rounded</Button>)
  .add('Button fullwidth', () => <Button fullwidth>Button fullwidth</Button>)
  .add('Button disabled', () => <Button disabled>Button disabled</Button>)
  .add('Button bold', () => <Button bold>Button bold</Button>)
  .add('Button uppercase', () => <Button uppercase>Button uppercase</Button>)
  .add('ButtonGroup with 2 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button></ButtonGroup>))
  .add('ButtonGroup with 3 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button><Button>Button 3</Button></ButtonGroup>))

storiesOf('Dropdowns', module)
  .add('SimpleDropdown', () => <SimpleDropdown
                                  id={"1"}
                                  dropDownOpen = {false}
                                  handleToggle={function(){}}
                                  items={[{text: "item 1", value: 1},
                                          {text: "item 2", value: 2}]}
                                  callback={function(){}}/>)

storiesOf('Gauges', module)
  .add('ConfirmationGauge empty', () => <ConfirmationGauge />)
  .add('ConfirmationGauge yellow', () => <ConfirmationGauge nbConfirmations={1} />)
  .add('ConfirmationGauge orange', () => <ConfirmationGauge nbConfirmations={2} />)
  .add('ConfirmationGauge green', () => <ConfirmationGauge nbConfirmations={3} />)

//TODO: Fin out how to name icons
storiesOf('Icon', module)
  .add('Icon', () => <Icon name={"fa fa-picture-o"}/>)

storiesOf('Links', module)
  .add('Link', () => <Link>This is a link</Link>)
  .add('Bold Link', () => <Link bold>This is a bold link</Link>)
  .add('Uppercase Link', () => <Link uppercase>This is an uppercase link</Link>)
  .add('Navy Link', () => <Link color='navy'>This is a navy link</Link>)
  .add('Gray Link', () => <Link color='gray'>This is a gray link</Link>)

//What is total? Why doesn't it show a modal?
storiesOf('Modals', module)
  .add('Modal', () => <Modal position={1} total={1} title="Modal"/>)

storiesOf('Separators', module)
  .add('Separator', () => <div><br /><Separator /><br /></div>)

storiesOf('Tooltip', module)
  .add('Tooltip', () => <Tooltip>This is a tooltip.</Tooltip>)

storiesOf('Text', module)
  .add('Text', () => <Text>This is text</Text>)
  .add('Red Text', () => <Text color="red">This is text</Text>)
  .add('High weight text', () => <Text weight={900}>This is fat text</Text>)
  .add('Capitalized Text', () => <Text capitalize>This is capitalized text</Text>)
  .add('Italic Text', () => <Text italic>This is italic text</Text>)
  .add('Uppercase Text', () => <Text uppercase>This is uppercase text</Text>)
  .add('Alt font Text', () => <Text altFont>This is text using an alternative font</Text>)

storiesOf('TextGroup', module)
  .add('TextGroup not aligned', () => <TextGroup><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
  .add('TextGroup aligned', () => <TextGroup aligned><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
