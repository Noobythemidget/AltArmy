const { ipcMain, BrowserWindow, shell } = require('electron')
const { getPluginDataDir, PluginData } = require('./plugindata.js')
const { Database } = require('./db.js')
const { Preferences } = require('./preferences.js')
// const { Logger } = require('./logger.js')

Preferences.load()

const db = new Database(Preferences.data.dbFilePath)
let refreshCounter = 0

// Initializes all the event handlers
function initEventHandlers () {
  console.log('initEventHandlers')

  ipcMain.handle('minimize-window', (event, ...args) => {
    BrowserWindow.getAllWindows()[0].minimize()
  })

  // ipcMain.handle('maximize-window', (event, ...args) => {
  //   const mainWindow = BrowserWindow.getAllWindows()[0]
  //   mainWindow.isMaximized ? mainWindow.unmaximize() : mainWindow.maximize()
  // })

  // handles event to get the plugindata folder
  ipcMain.handle('get-plugindata-folder', async (event, ...args) => {
    const window = BrowserWindow.getAllWindows()[0]
    const result = await getPluginDataDir(window)
    if (!result.canceled) {
      Preferences.data.pluginDataDir = result.filePaths[0]
      Preferences.save()
    }
    return result
  })

  // handles event to load plugin data from all ALtArmy.plugindata files in the PluginData folder
  ipcMain.handle('get-plugindata', async (event, ...args) => {
    const pluginData = new PluginData(db)
    pluginData.loadPluginData(Preferences.data.pluginDataDir)
    return pluginData
  })

  ipcMain.handle('start-refresh', (event, ...args) => {
    if (refreshCounter === 0) {
      // start loading
    }
    refreshCounter++
    return refreshCounter
  })

  // handles event to load plugin data from all ALtArmy.plugindata files in the PluginData folder
  ipcMain.handle('get-dropdown-filter-lists', async (event, ...args) => {
    const accounts = await db.Characters.getAllAccounts()
    const servers = await db.Characters.getAllServers()
    const classes = await db.Characters.getAllClasses()
    const races = await db.Characters.getAllRaces()

    return {
      accounts: accounts,
      servers: servers,
      classes: classes,
      races: races
    }
  })

  ipcMain.handle('open-link', (event, ...args) => {
    shell.openExternal(args[0])
  })

  /// ///////////////////////
  // Characters
  /// ///////////////////////

  ipcMain.handle('get-all-characters', async (event, ...args) => {
    return await db.CharactersView.getAllCharacters()
  })

  ipcMain.handle('get-all-characters-for-server', async (event, ...args) => {
    const server = args[0]
    return await db.CharactersView.getAllCharactersForServer(server)
  })

  ipcMain.handle('get-all-characters-for-account', async (event, ...args) => {
    const account = args[0]
    return await db.CharactersView.getAllCharactersForAccount(account)
  })

  ipcMain.handle('get-character', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    return await db.Characters.getCharacter(characterName, account, server)
  })

  ipcMain.handle('get-character-professions', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    return await db.Professions.getProfessions(characterName, account, server)
  })

  ipcMain.handle('get-character-wallet', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    const accountWallet = await db.AccountWallet.getAccountWallet(account, server)
    const personalWallet = await db.PersonalWallet.getPersonalWallet(characterName, account, server)

    return {
      account: accountWallet,
      personal: personalWallet
    }
  })

  ipcMain.handle('get-character-stats', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    return await db.CharacterStats.getCharacterStats(characterName, account, server)
  })

  ipcMain.handle('delete-character', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    await db.DeletedCharacters.add(characterName, account, server)
  })

  /// ///////////////////////
  // Wallets
  /// ///////////////////////

  ipcMain.handle('get-every-wallet', async (event, ...args) => {
    return await db.EveryWalletView.getEveryWallet()
  })

  ipcMain.handle('get-character-inventory', async (event, ...args) => {
    const characterName = args[0]
    const account = args[1]
    const server = args[2]

    return {
      details: await db.CharacterStorageDetails.getCharacterStroageDetails(characterName, account, server),
      rows: await db.InventoryItems.getCharacterInventory(characterName, account, server)
    }
  })

  /// ///////////////////////
  // Alt Iventory
  /// ///////////////////////

  ipcMain.handle('get-alt-inventory', async (event, ...args) => {
    return await db.InventoryItems.getAltInventory()
  })

  /// ///////////////////////
  // Accounts
  /// ///////////////////////
  ipcMain.handle('get-accounts-table', async (event, ...args) => {
    return await db.Accounts.getAccountsTable()
  })

  ipcMain.handle('update-account-lotropoints', async (event, ...args) => {
    const accountId = args[0]
    const lotroPoints = args[1]

    await db.Accounts.updateAccountLotroPoints(accountId, lotroPoints)
  })

  /// ///////////////////////
  // Servers
  /// ///////////////////////
  ipcMain.handle('get-servers-table', async (event, ...args) => {
    return await db.Servers.getServersTable()
  })

  /// ///////////////////////
  // Account Notes
  /// ///////////////////////

  ipcMain.handle('get-account-notes', async (event, ...args) => {
    const accountId = args[0][0]
    return await db.AccountNotes.getAccountNotes(accountId)
  })

  ipcMain.handle('add-account-note', async (event, ...args) => {
    const note = args[0]
    const accountId = args[1][0]

    await db.AccountNotes.addAccountNote(note, accountId)
    return await db.AccountNotes.getAccountNotes(accountId)
  })

  ipcMain.handle('update-account-note', async (event, ...args) => {
    const id = args[0]
    const note = args[1]
    await db.AccountNotes.updateAccountNote(id, note)

    if (args.length >= 3) { // making 3rd param optional because editing a note in the all notes view doesn't need this call
      const accountId = args[2][0]
      return await db.AccountNotes.getAccountNotes(accountId)
    }
  })

  ipcMain.handle('delete-account-note', async (event, ...args) => {
    const id = args[0]
    const accountId = args[1][0]

    await db.AccountNotes.deleteAccountNote(id)
    return await db.AccountNotes.getAccountNotes(accountId)
  })

  /// ///////////////////////
  // Server Notes
  /// ///////////////////////

  ipcMain.handle('get-server-notes', async (event, ...args) => {
    const serverId = args[0][0]
    return await db.ServerNotes.getServerNotes(serverId)
  })

  ipcMain.handle('add-server-note', async (event, ...args) => {
    const note = args[0]
    const serverId = args[1][0]

    await db.ServerNotes.addServerNote(note, serverId)
    return await db.ServerNotes.getServerNotes(serverId)
  })

  ipcMain.handle('update-server-note', async (event, ...args) => {
    const id = args[0]
    const note = args[1]
    await db.ServerNotes.updateServerNote(id, note)

    if (args.length >= 3) { // making 3rd param optional because editing a note in the all notes view doesn't need this call
      const serverId = args[2][0]
      return await db.ServerNotes.getServerNotes(serverId)
    }
  })

  ipcMain.handle('delete-server-note', async (event, ...args) => {
    const id = args[0]
    const serverId = args[1][0]

    await db.ServerNotes.deleteServerNote(id)
    return await db.ServerNotes.getServerNotes(serverId)
  })

  /// ///////////////////////
  // Character Notes
  /// ///////////////////////
  ipcMain.handle('get-character-notes', async (event, ...args) => {
    const characterName = args[0][0]
    const account = args[0][1]
    const server = args[0][2]
    return await db.CharacterNotes.getCharacterNotes(characterName, account, server)
  })

  ipcMain.handle('add-character-note', async (event, ...args) => {
    const note = args[0]

    const characterName = args[1][0]
    const account = args[1][1]
    const server = args[1][2]

    await db.CharacterNotes.addCharacterNote(note, characterName, account, server)
    return await db.CharacterNotes.getCharacterNotes(characterName, account, server)
  })

  ipcMain.handle('update-character-note', async (event, ...args) => {
    const id = args[0]
    const note = args[1]
    await db.CharacterNotes.updateCharacterNote(id, note)

    if (args.length >= 3) { // making 3rd param optional because editing a note in the all notes view doesn't need this call
      const characterName = args[2][0]
      const account = args[2][1]
      const server = args[2][2]
      return await db.CharacterNotes.getCharacterNotes(characterName, account, server)
    }
  })

  ipcMain.handle('delete-character-note', async (event, ...args) => {
    const id = args[0]

    const characterName = args[1][0]
    const account = args[1][1]
    const server = args[1][2]

    await db.CharacterNotes.deleteCharacterNote(id)
    return await db.CharacterNotes.getCharacterNotes(characterName, account, server)
  })

  /// ///////////////////////
  // All Notes
  /// ///////////////////////
  ipcMain.handle('get-all-notes', async (event, ...args) => {
    return await db.AllNotesView.selectAll()
  })
}

module.exports = { initEventHandlers }
