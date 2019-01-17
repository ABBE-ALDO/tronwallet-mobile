class AccountsCreatorStore {
  constructor (tron, client, oneSignal, secretsConnection, secretsStore) {
    this._tron = tron
    this._client = client
    this._oneSignal = oneSignal
    this._secretsConnection = secretsConnection
    this._secretsStore = secretsStore
  }

  async create (accountName, mnemonic, registerDevice = false) {
    if (!accountName || !mnemonic) {
      return null
    }

    const accounts = this._secretsStore.findAllAccounts()

    const userSecret = await this._tron.generateKeypair(mnemonic, accounts.length, false)

    userSecret.mnemonic = mnemonic
    userSecret.name = accountName
    userSecret.alias = this._secretsStore.formatAlias(accountName)
    userSecret.confirmed = true
    userSecret.hide = false
    userSecret.order = accounts.length
    userSecret.type = 'TRX'
    userSecret.coin = 'TRONIX'

    await this.saveUser(userSecret, registerDevice)

    return userSecret
  }

  async createFirstAccount (mnemonic) {
    const accounts = this._secretsStore.findAllAccounts()
    if (accounts.length) {
      return null
    }

    return this.create('Main account', mnemonic, true)
  }

  async addAccountByMode (accountData, mode) {
    switch (mode) {
      case 'privateKey':
        return this.addAccountByPrivateKeyMode(accountData)
      case 'watch':
        return this.addAccountByWatchMode(accountData)
      default:
        return this.addAccountByExistent(accountData)
    }
  }

  async addAccountByPrivateKeyMode ({ accountName, address, privateKey }) {
    await this._secretsStore.checkAccount(address, privateKey)

    const accounts = this._secretsStore.findAllAccounts()

    const userSecrets = {
      privateKey,
      address,
      publicKey: '',
      confirmed: true,
      mnemonic: '',
      password: '',
      hide: false,
      name: accountName,
      alias: this._secretsStore.formatAlias(accountName),
      order: accounts.length,
      type: 'TRX',
      coin: 'TRONIX'
    }

    await this.saveUser(userSecrets)

    return userSecrets
  }

  async addAccountByWatchMode () {
    console.warn('test')
  }

  async addAccountByExistent ({ accountName }) {
    const firstAccount = this._secretsStore.findFirstAccount()

    if (!firstAccount) {
      return null
    }

    return this.create(accountName, firstAccount.mnemonic)
  }

  async saveUser (userSecret, registerDevice = false) {
    await this._secretsConnection.save(userSecret)

    if (registerDevice) {
      const oneSignalId = this._oneSignal.getOneSignalId()
      this._client.registerDeviceForNotifications(oneSignalId, userSecret.address, true)
    }
  }
}

export default AccountsCreatorStore
