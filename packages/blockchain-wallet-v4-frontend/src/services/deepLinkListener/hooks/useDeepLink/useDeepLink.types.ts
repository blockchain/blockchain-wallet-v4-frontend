import { DeepLinkListenerContext } from 'services/deepLinkListener/contexts'

type DeepLinkHook = () => Pick<DeepLinkListenerContext, 'onClickDeepLink'>

export type { DeepLinkHook }
