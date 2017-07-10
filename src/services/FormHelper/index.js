import bip39 from 'bip39'
import { passwordStrongness, isEmail, isGuid } from 'services/ValidationHelper'

const required = value => value ? undefined : 'Required'

const validPassword = value => passwordStrongness(value) > 5 ? undefined : 'Not strong enough'

const validEmail = value => isEmail(value) ? undefined : 'Invalid email address'

const validMmemonic = value => bip39.validateMnemonic(value) ? undefined : 'Invalid passphrase'

const validWalletId = value => isGuid(value) ? undefined : 'Invalid wallet identifier'

export { required, validPassword, validEmail, validMmemonic, validWalletId }
