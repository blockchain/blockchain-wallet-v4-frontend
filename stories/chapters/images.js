import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Image } from '../../src'

storiesOf('Images', module)
    .addDecorator(story => (<Layout>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('App store badge', () => <Image name='app-store-badge' />)
    .add('Bitcoin network', () => <Image name='bitcoin-network' />)
    .add('Blockchain blue', () => <Image name='blockchain-blue' />)
    .add('Blockchain vector', () => <Image name='blockchain-vector' />)
    .add('Blue logo', () => <Image name='blue-logo' />)
    .add('Google play badge', () => <Image name='google-play-badge' />)
    .add('Landing page banner overlay', () => <Image name='landing-page-banner-overlay' />)
    .add('Landing page banner sm overlay', () => <Image name='landing-page-banner-sm-overlay' />)
    .add('QR code', () => <Image name='qr-code' />)
    .add('Refresh', () => <Image name='refresh' />)
    .add('Sophisticated', () => <Image name='sophisticated' />)
    .add('Blue logo with width', () => <Image name='blue-logo' width='100' />)
    .add('Blue logo with height', () => <Image name='blue-logo' height='50' />)
