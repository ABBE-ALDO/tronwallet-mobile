import RealmStoreMock from '../../infra-data/__mocks__/realm.store.mock'
import SecretsStore from '../secrets.store'

describe('Secret store', () => {
  let _secretStore, _contactStore, _store, _mockData, _RNTron, _client

  beforeEach(() => {
    _mockData = [
      { key: 1, value: 'a', hide: false },
      { key: 2, value: 'b', hide: true }
    ]

    _RNTron = {
      generateKeypair: () => ({})
    }

    _client = {
      broadcastTransaction: () => ({}),
      getTransferTransaction: () => ({})
    }

    _store = new RealmStoreMock('key', _mockData)
    _contactStore = new RealmStoreMock('key', _mockData)
    _secretStore = new SecretsStore(_RNTron, _store, jest.fn(), _client, _contactStore)
  })

  describe('List accounts', () => {
    test('should return all accounts when accounts list exist', () => {
      const accounts = _secretStore.findAllAccounts()

      expect(accounts).toMatchObject(_mockData)
    })

    test('should return empty list when accounts list is empty', () => {
      const store = new RealmStoreMock('key', [])
      const secretStore = new SecretsStore(_RNTron, store, jest.fn(), _client, _contactStore)

      const accounts = secretStore.findAllAccounts()

      expect(accounts).toHaveLength(0)
    })

    test('should return only visible accounts when list have visible accounts', () => {
      const accounts = _secretStore.findVisibleAccounts()

      expect(accounts).toEqual([{ key: 1, value: 'a', hide: false }])
    })

    test('should return empty list when list doesn\'t have visible accounts', () => {
      const store = new RealmStoreMock('key', [{ key: 1, value: 'a', hide: true }])
      const secretStore = new SecretsStore(_RNTron, store, jest.fn(), _client, _contactStore)

      const accounts = secretStore.findVisibleAccounts()

      expect(accounts).toHaveLength(0)
    })

    test('should return first account when list have accounts', () => {
      const account = _secretStore.findFirstAccount()

      expect(account).toMatchObject({ key: 1, value: 'a', hide: false })
    })

    test('should return last account when list have accounts', () => {
      const account = _secretStore.findLastAccount()

      expect(account).toMatchObject({ key: 2, value: 'b', hide: true })
    })
  })

  describe('Delete account', () => {
    test('should remove item when delete object by address', async () => {
      await _secretStore.removeByAccountType(2, 'User')

      const objects = _secretStore.findAllAccounts()

      expect(objects).toMatchObject([
        { key: 1, value: 'a', hide: false }
      ])
    })

    test('should not remove item when address doesn\'t exists for delete', async () => {
      await _secretStore.removeByAccountType(5, 'User')

      const objects = _secretStore.findAllAccounts()

      expect(objects).toMatchObject([
        { key: 1, value: 'a', hide: false },
        { key: 2, value: 'b', hide: true }
      ])
    })

    test('should empty list when reset data', async () => {
      await _secretStore.resetSecretData()

      const objects = _secretStore.findAllAccounts()
      expect(objects).toHaveLength(0)
    })
  })
})
