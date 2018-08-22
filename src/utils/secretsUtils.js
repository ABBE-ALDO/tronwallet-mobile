import RNTron from 'react-native-tron'
import { AsyncStorage } from 'react-native'

import getSecretsStore from '../store/secrets'
import Client from '../services/client'
import { USER_STATUS } from '../utils/constants'

export const createUserKeyPair = async (pin, oneSignalId) => {
  const mnemonic = await RNTron.generateMnemonic()
  await generateKeypair(pin, oneSignalId, mnemonic, 0, true)
  AsyncStorage.setItem(USER_STATUS, 'active')
}

export const recoverUserKeypair = async (
  pin,
  oneSignalId,
  mnemonic,
  vaultNumber = 0,
  randomlyGenerated = false
) => {
  await RNTron.validateMnemonic(mnemonic)
  await generateKeypair(pin, oneSignalId, mnemonic, vaultNumber, randomlyGenerated)
  AsyncStorage.setItem(USER_STATUS, 'active')
}

export const createNewAccount = async (pin, oneSignalId) => {
  const accounts = await getUserSecrets(pin)
  const { mnemonic } = accounts[0]
  const generatedKeypair = await RNTron.generateKeypair(mnemonic, accounts.length, false)
  generatedKeypair.mnemonic = mnemonic
  generatedKeypair.name = `Account ${accounts.length}`
  generatedKeypair.alias = `@account${accounts.length}`
  generatedKeypair.confirmed = true
  const secretsStore = await getSecretsStore(pin)
  await secretsStore.write(() => secretsStore.create('UserSecret', generatedKeypair, true))
  Client.registerDeviceForNotifications(oneSignalId, generatedKeypair.address)
}

const generateKeypair = async (pin, oneSignalId, mnemonic, vaultNumber, randomlyGenerated) => {
  const generatedKeypair = await RNTron.generateKeypair(mnemonic, 0, false)
  generatedKeypair.mnemonic = mnemonic
  generatedKeypair.confirmed = !randomlyGenerated
  generatedKeypair.name = 'Main Account'
  generatedKeypair.alias = '@main_account'
  const secretsStore = await getSecretsStore(pin)
  await secretsStore.write(() => secretsStore.create('UserSecret', generatedKeypair, true))
  Client.registerDeviceForNotifications(oneSignalId, generatedKeypair.address)
}

export const confirmSecret = async pin => {
  const secretsStore = await getSecretsStore(pin)
  const allSecrets = secretsStore.objects('UserSecret')
  const mainSecret = allSecrets.length ? allSecrets[0] : allSecrets
  secretsStore.write(() => { mainSecret.confirmed = true })
}

export const getUserSecrets = async pin => {
  const secretsStore = await getSecretsStore(pin)
  const secrets = secretsStore
    .objects('UserSecret')
    .map(item => Object.assign({}, item))
  return secrets
}

export const resetSecretData = async pin => {
  const secretsStore = await getSecretsStore(pin)
  const secretList = secretsStore.objects('UserSecret')
  await secretsStore.write(() => secretsStore.delete(secretList))
}
