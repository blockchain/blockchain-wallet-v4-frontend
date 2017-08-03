import settings from 'config'
import { Socket } from 'dream-wallet/lib/network'

export const socket = new Socket({ wsUrl: settings.WEB_SOCKET_URL })
