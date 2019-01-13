import RealmStoreMock from '../../infra-data/__mocks__/realm.store.mock'
import SecretsStore from '../secrets.store'
import AccountsCreatorStore from '../accountCreator.store'

describe('Secret store', () => {
  let _accountsCreator, _secretStore, _store, _mockData, _RNTron, _client, _oneSignal

  beforeEach(() => {
    _mockData = [
      { name: '1', mnemonic: 'a', hide: false },
      { name: '2', mnemonic: 'b', hide: true }
    ]

    _RNTron = {
      generateKeypair: () => ({}),
      signTransaction: () => ({})
    }

    _client = {
      registerDeviceForNotifications: () => ({}),
      broadcastTransaction: () => ({}),
      getTransferTransaction: () => ({})
    }

    _oneSignal = {
      getId: () => ('asdf')
    }

    _store = new RealmStoreMock('name', _mockData)
    _secretStore = new SecretsStore(_RNTron, _store, jest.fn(), _client, null)
    _accountsCreator = new AccountsCreatorStore(_RNTron, _client, _oneSignal, _store, _secretStore)
  })

  describe('Create user secret account', () => {
    test('should create when account name and mnemonic was filled', async () => {
      const accountName = 'Asdf 1234'
      const mnemonic = 'asdf qwer zxcv'

      const newUser = await _accountsCreator.create(accountName, mnemonic)

      const expected = {
        mnemonic,
        name: accountName,
        alias: '@asdf_1234',
        confirmed: true,
        hide: false
      }

      expect(newUser).toBeTruthy()

      const persistedUser = _store.findByKey(accountName)
      expect(persistedUser).toEqual(expected)
    })

    test('should not create when account name wasn\'t filled', async () => {
      const accountName = ''
      const mnemonic = 'asdf qwer zxcv'

      const newUser = await _accountsCreator.create(accountName, mnemonic)

      expect(newUser).toBeNull()

      const persistedUser = _store.findByKey(accountName)
      expect(persistedUser).toBeFalsy()
    })

    test('should not create when mnemonic wasn\'t filled', async () => {
      const accountName = 'Asdf 1234'
      const mnemonic = ''

      const newUser = await _accountsCreator.create(accountName, mnemonic)

      expect(newUser).toBeNull()

      const persistedUser = _store.findByKey(accountName)
      expect(persistedUser).toBeFalsy()
    })
  })

  describe('Create FIRST user secret account', () => {
    test('should create when mnemonic filled and accounts is empty', async () => {
      const store = new RealmStoreMock('key', [])
      const secretStore = new SecretsStore(_RNTron, store, jest.fn(), _client, null)
      const accountsCreatorStore = new AccountsCreatorStore(_RNTron, _client, _oneSignal, store, secretStore)

      const mnemonic = 'asdf qwer zxcv'

      const newUser = await accountsCreatorStore.createFirstAccount(mnemonic)

      const expected = {
        mnemonic,
        name: 'Main account',
        alias: '@main_account',
        confirmed: true,
        hide: false
      }

      expect(newUser).toEqual(expected)
    })

    test('should not create when mnemonic wasn\'t filled', async () => {
      const mnemonic = ''

      const newUser = await _accountsCreator.createFirstAccount(mnemonic)

      expect(newUser).toBeNull()
    })

    test('should not create when accounts isn\'t empty', async () => {
      const mnemonic = 'asdf qwer zxcv'

      const newUser = await _accountsCreator.createFirstAccount(mnemonic)

      expect(newUser).toBeNull()
    })
  })

  describe('Add new account by modes', () => {
    test('should add new account when account data is valid and mode is default', async () => {
      const accountData = {
        accountName: 'Account1',
        privateKey: 'HJKLUIOP',
        address: 'asdf1234qwer'
      }

      const addedAccount = await _accountsCreator.addAccountByMode(accountData, 'default')

      const expected = {
        mnemonic: _mockData[0].mnemonic,
        name: accountData.accountName,
        alias: '@account1',
        confirmed: true,
        hide: false
      }

      expect(addedAccount).toBeTruthy()

      const persistedUser = _store.findByKey(accountData.accountName)
      expect(persistedUser).toEqual(expected)
    })

    test('should add new account when account data is valid and mode is privateKey', async () => {
      const accountData = {
        accountName: 'Account1',
        privateKey: 'HJKLUIOP',
        address: 'asdf1234qwer'
      }

      const addedAccount = await _accountsCreator.addAccountByMode(accountData, 'privateKey')

      const expected = {
        name: accountData.accountName,
        privateKey: accountData.privateKey,
        address: accountData.address,
        alias: '@account1',
        publicKey: '',
        confirmed: true,
        mnemonic: '',
        password: '',
        hide: false
      }

      expect(addedAccount).toBeTruthy()

      const persistedUser = _store.findByKey(accountData.accountName)
      expect(persistedUser).toEqual(expected)
    })
  })
})
