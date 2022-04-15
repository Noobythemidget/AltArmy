const sqlite3 = require('sqlite3').verbose()

const { AppConfig } = require('./db/app_config.js')

const { Accounts } = require('./db/accounts.js')
const { Servers } = require('./db/servers.js')
const { Characters } = require('./db/characters.js')
const { CharactersView } = require('./db/characters_view.js')
const { CharacterStats } = require('./db/character_stats.js')

const { EveryWalletView } = require('./db/every_wallet_view.js')
const { WalletDescriptions } = require('./db/wallet_descriptions.js')
const { AccountWallet } = require('./db/account_wallet.js')
const { PersonalWallet } = require('./db/personal_wallet.js')

const { Professions } = require('./db/professions.js')
const { ProfessionsView } = require('./db/professions_view.js')

const { AllNotesView } = require('./db/all_notes_view.js')
const { AccountNotes } = require('./db/account_notes.js')
const { ServerNotes } = require('./db/server_notes.js')
const { CharacterNotes } = require('./db/character_notes.js')

const { TemporaryAccounts } = require('./db/temporary_accounts.js')
const { TemporaryNotes } = require('./db/temporary_notes.js')

const { DeletedCharacters } = require('./db/deleted_characters.js')
const { OnCharacterDeleteTrigger } = require('./db/on_character_delete_trigger.js')
const { OnCharacterInsertTrigger } = require('./db/on_character_insert_trigger.js')

// alt inventory stuff
const { CharacterStorageDetails } = require('./db/character_storage_details.js')
const { InventoryItems } = require('./db/inventory_items.js')

/**
 *
 */
const sql = {
  transaction: {
    begin: 'BEGIN TRANSACTION;',
    end: 'END TRANSACTION;',
    foreign_keys: 'PRAGMA foreign_keys = ON;'
  }
}

// // reference: https://www.utf8-chartable.de/unicode-utf8-table.pl
// // burgled from https://stackoverflow.com/questions/17057407/javascript-create-a-string-or-char-from-an-utf-8-value
// function convertHexToString (input) {
//   // split input into groups of two
//   const hex = input.match(/[\s\S]{2}/g) || []
//   let output = ''

//   // build a hex-encoded representation of your string
//   for (let i = 0, j = hex.length; i < j; i++) {
//     output += '%' + ('0' + hex[i]).slice(-2)
//   }

//   // decode it using this trick
//   output = decodeURIComponent(output)

//   return output
// }

// // MAIN FUNCTION
// function decodeUTF8 (encodedString) {
//   const replacer = (substr) => {
//     const hexStr = substr.split(/([0-9]+)/).filter(e => !isNaN(e)).map(e => parseInt(e).toString(16)).join('')
//     return convertHexToString(hexStr)
//   }

//   const regex = /(#[0-9]+#)+/g // matches the encoded UTF-8 strings '#195##128#...'
//   const decodedStr = encodedString.replace(regex, replacer)
//   return decodedStr.startsWith('#') ? decodedStr.substring(1) : decodedStr
// }

/**
 *
 */
class Database {
  constructor (filename) {
    try {
      // this.db = new sqlite3.Database(':memory:')
      // opens or creates the database
      this.db = new sqlite3.Database(filename, (err) => {
        if (err) {
          console.log('Creating sqlite3 db', err.message)
          throw err
        }
        console.log('created sqlite3 db')
      })

      console.log('creating table classes')

      this.tables = [
        this.AppConfig = new AppConfig(this.db),
        this.DeletedCharacters = new DeletedCharacters(this.db),

        this.Accounts = new Accounts(this.db),
        this.Servers = new Servers(this.db),
        this.Characters = new Characters(this.db),
        this.CharacterStats = new CharacterStats(this.db),

        this.WalletDescriptions = new WalletDescriptions(this.db),
        this.AccountWallet = new AccountWallet(this.db),
        this.PersonalWallet = new PersonalWallet(this.db),

        this.Professions = new Professions(this.db),

        this.AccountNotes = new AccountNotes(this.db),
        this.ServerNotes = new ServerNotes(this.db),
        this.CharacterNotes = new CharacterNotes(this.db),

        this.InventoryItems = new InventoryItems(this.db),
        this.CharacterStorageDetails = new CharacterStorageDetails(this.db)
      ]

      this.views = [
        this.AllNotesView = new AllNotesView(this.db),
        this.CharactersView = new CharactersView(this.db),
        this.ProfessionsView = new ProfessionsView(this.db),
        this.EveryWalletView = new EveryWalletView(this.db)
      ]

      this.triggers = [
        this.OnCharacterDeleteTrigger = new OnCharacterDeleteTrigger(this.db),
        this.OnCharacterInsertTrigger = new OnCharacterInsertTrigger(this.db)
      ]

      // temporary tables to backup/restore user data
      this.TemporaryAccounts = new TemporaryAccounts(this.db)
      this.TemporaryNotes = new TemporaryNotes(this.db)
    } catch (err) {
      console.log('exception: ' + err)
      throw err
    }

    this.initialize()
    // perhaps check app_config?
  }

  /// ///////////////
  // SQL Functions
  /// ///////////////

  /**
   * Closes connection to the database
   */
  close () {
    this.db.close()
  }

  /**
   * Serializes a series of sql statements
   *
   * @param {*} callback - a callback with the statements that need to be serialized
   */
  serialize (callback) {
    this.db.serialize(callback)
  }

  /**
   * Begin an sql transaction
   */
  beginTransaction () {
    this.db.run(sql.transaction.begin, (err) => {
      if (err) {
        console.log(sql.transaction.begin, err)
        throw err
      }
    })
  }

  /**
   * End an sql transaction
   */
  endTransaction () {
    this.db.run(sql.transaction.end, (err) => {
      if (err) {
        console.log(sql.transaction.end, err)
        throw err
      }
    })
  }

  /**
   *
   */
  enableForeignKeys () {
    console.log('enabling foreign keys')
    this.db.run(sql.transaction.foreign_keys, (err) => {
      if (err) {
        console.log('failed enabling foreign_keys', err.message)
        throw err
      }
      console.log('foreign_keys ON')
    })
  }

  /**
   * Creates the database views and tables.
   *
   * @param {*} drop - When true, drops all views and tables before recreating them. Optional.
   */
  initialize (drop = false) {
    this.db.serialize() // should set everything to serial until done
    this.enableForeignKeys()

    if (drop) {
      this.#dropTriggers()
      this.#dropViews()
      this.#dropTables()
    }
    this.#createTables()
    this.#createViews()
    this.#createTriggers()
  }

  /**
   * Deletes all the records in every table of the database.
   */
  deleteAllRecords () {
    this.tables.forEach(t => {
      if (t !== this.DeletedCharacters) {
        t.deleteAllSync()
      }
    })
  }

  /**
   * Creates the views in the database
   */
   #createViews () {
    console.log('creating view')
    this.views.forEach(v => v.createSync())
  }

  /**
   * Drops the views from the database
   */
  #dropViews () {
     console.log('dropping view')
     this.views.forEach(v => v.dropSync())
   }

  /**
   * Creates the triggers in the database
   */
   #createTriggers () {
    console.log('creating triggers')
    this.triggers.forEach(t => t.createSync())
  }

  /**
   * Drops the triggers from the database
   */
  #dropTriggers () {
     console.log('dropping triggers')
     this.triggers.forEach(t => t.dropSync())
   }

  /**
    * Creates the tables in the database
    */
  #createTables () {
    console.log('creating table')
    this.tables.forEach(t => t.createSync())
  }

  /**
   * Drops the tables from the database
   */
  #dropTables () {
    // create characters table
    console.log('dropping table')
    this.tables.forEach(t => t.dropSync())
  }

  /**
   * Backup any user provided data (notes and lotro points) to temporary tables.
   * * Current design is to always delete old data and load new data from plugindata folder. So we must save any existing notes before old data is deleted.
   *   Then resassign in the restore() method.
   */
  async backup () {
    console.log('creating temporary_notes')
    // this.TemporaryNotes.createSync()
    await this.TemporaryNotes.create()

    const accountNotesExist = await this.AccountNotes.exists()
    const serverNotesExists = await this.ServerNotes.exists()
    const characterNotesExist = await this.CharacterNotes.exists()

    if (accountNotesExist && serverNotesExists && characterNotesExist) {
      console.log('inserting temporary_notes')
      // this.TemporaryNotes.backupSync()
      await this.TemporaryNotes.backup()
    }

    // account lotro points
    // this.TemporaryAccounts.createSync()
    await this.TemporaryAccounts.create()

    const accountsExists = await this.Accounts.exists()
    if (accountsExists) {
      console.log('inserting temporary_accounts')
      // this.TemporaryAccounts.backupSync()
      await this.TemporaryAccounts.backup()
    }
  }

  backupSync () {
    this.TemporaryNotes.createSync()
    try {
      this.TemporaryNotes.backupSync()
    } catch (err) {
      console.log(err)
    }

    this.TemporaryAccounts.createSync()
    try {
      this.TemporaryAccounts.backupSync()
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Restores user provided data (notes and lotro points) from temporary tables to live tables.
   */
  restoreSync () {
    try {
      console.log('updating accounts lotro points')
      this.TemporaryAccounts.restoreSync()
    } catch (err) {
      console.log(err)
    }
    try {
      console.log('dropping temporary_accounts')
      this.TemporaryAccounts.dropSync()
    } catch (err) {
      console.log(err)
    }

    try {
      console.log('restoring saved notes')
      this.TemporaryNotes.restoreSync()
    } catch (err) {
      console.log(err)
    }
    try {
      console.log('dropping temporary_notes')
      this.TemporaryNotes.dropSync()
    } catch (err) {
      console.log(err)
    }
  }

  async restore () {
    console.log('updating accounts lotro points')
    await this.TemporaryAccounts.restore()
    console.log('dropping temporary_accounts')
    await this.TemporaryAccounts.drop()

    console.log('restoring saved notes')
    await this.TemporaryNotes.restore()
    console.log('dropping temporary_notes')
    await this.TemporaryNotes.drop()
  }
}

module.exports = { Database }
