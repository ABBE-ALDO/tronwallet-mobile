import RNTron from 'react-native-tron'

import client from '../../services/client'
import { logSentry } from '../../utils/sentryUtils'

import * as oneSignal from '../security/oneSignal'

import SecretsStore from './secrets.store'
import { getUserSecretsConnection, getContactsConnection } from './connections'
import AccountsCreatorStore from './accountCreator.store'

let _secretStore

export const getSecretStore = async () => {
  if (!_secretStore) {
    const secretsConnection = await getUserSecretsConnection()
    const contactsConnection = await getContactsConnection()
    _secretStore = new SecretsStore(RNTron, secretsConnection, logSentry, client, contactsConnection)
  }

  return _secretStore
}

let _accountsCreatorStore

export const getAccountsCreatorStore = async () => {
  if (!_accountsCreatorStore) {
    const secretsConnection = await getUserSecretsConnection()
    const secretsStore = await getSecretStore()

    _accountsCreatorStore = new AccountsCreatorStore(RNTron, client, oneSignal, secretsConnection, secretsStore)
  }

  return _accountsCreatorStore
}
