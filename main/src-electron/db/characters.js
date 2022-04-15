const { BaseTable, TYPE } = require('./base_table.js')
const { CharacterStats } = require('./character_stats.js')
const { Professions } = require('./professions.js')
const { PersonalWallet } = require('./personal_wallet.js')
// const { Logger } = require('../logger.js')

class Characters extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'characters', TYPE.TABLE)

    this.Professions = new Professions(db)
    this.PersonalWallet = new PersonalWallet(db)
    this.CharacterStats = new CharacterStats(db)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {
    create: `                 CREATE TABLE IF NOT EXISTS characters (
                                      name            TEXT      NOT NULL,
                                      account         TEXT      NOT NULL,
                                      server          TEXT      NOT NULL,
                                      class           TEXT      NOT NULL,
                                      race            TEXT      NOT NULL,
                                      level           INTEGER   NOT NULL,
                                      alignment       TEXT      NOT NULL,
                                      money           INTEGER   NOT NULL,
                                      vocation        TEXT      NOT NULL,
                                      last_updated    TEXT      NOT NULL,
                                      plugin_version  TEXT      NOT NULL,
                                      PRIMARY KEY     (name, account, server)
                                  );`,

    // the on_characters_insert trigger requires a view to work so changed the insert
    // to point to characters_view instead of characters.
    insert: `                  INSERT OR IGNORE INTO characters_view (
                                      name, 
                                      account, 
                                      server, 
                                      class, 
                                      race, 
                                      level, 
                                      alignment, 
                                      money, 
                                      vocation, 
                                      last_updated, 
                                      plugin_version
                                ) VALUES (
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?, 
                                      ?
                                );`,

    select: `                 SELECT * 
                                FROM characters 
                                WHERE account = ?   AND 
                                      server  = ?   AND 
                                      name    = ?;`,

    select_by_account: `    SELECT * 
                              FROM characters 
                              WHERE account = ?
                              ORDER BY server   ASC,
                                       name     ASC;`,

    select_by_server: `     SELECT * 
                              FROM characters 
                              WHERE server  = ?
                              ORDER BY account  ASC,
                                       name     ASC;`,

    selectall: `              SELECT * 
                                FROM characters 
                                ORDER BY  account   ASC, 
                                          server    ASC, 
                                          level     DESC, 
                                          name      ASC;`,

    select_all_accounts: `    SELECT DISTINCT account 
                              FROM 
                                characters 
                              ORDER BY 
                                account ASC;`,

    select_all_servers: `     SELECT DISTINCT server 
                              FROM 
                                characters 
                              ORDER BY 
                                server ASC;`,

    select_all_classes: `     SELECT DISTINCT class 
                              FROM 
                                characters 
                              ORDER BY 
                                alignment ASC, 
                                class ASC;`,

    select_all_races: `       SELECT DISTINCT race 
                              FROM 
                                characters 
                              ORDER BY 
                                alignment ASC, 
                                race ASC;`,

    delete: `                 DELETE FROM characters 
                              WHERE name    = ? AND 
                                    account = ? AND 
                                    server  = ?;`
  }

  /**
   *
   */
  create () {
    return this.execSql(this.sql.create)
  }

  /**
   *
   */
  createSync () {
    this.execSqlSync(this.sql.create)
  }

  /// //////////////////////////////////////
  // helper methods
  /// //////////////////////////////////////

  /**
   *
   * @param {*} characterObj
   */
  async add (characterObj) {
    // add the character to table
    await this.runSql(
      this.sql.insert,
      characterObj.name,
      characterObj.account,
      characterObj.server,
      characterObj.data.Class,
      characterObj.data.Race === 'Undefined' ? 'Creep' : characterObj.data.Race,
      characterObj.data.Level,
      characterObj.data.Alignment,
      characterObj.data.Money,
      this.#getVocation(characterObj),
      characterObj.data.LastUpdated,
      characterObj.data.PluginVersion
    )

    // add it's personal wallet items to its table
    for (const currencyName of Object.keys(characterObj.data.PersonalWallet)) {
      const qty = parseInt(characterObj.data.PersonalWallet[currencyName])
      // Logger.log(currencyName + ' : ' + qty)
      await this.PersonalWallet.addWalletItem(currencyName, qty, characterObj).catch(() => {
        // Logger.log('Error adding WalletItems', err)
        // no op - swallow errors for now
      })
    }

    // add it's crafting information
    await this.Professions.addProfession(characterObj).catch(() => {
      // Logger.log('Error adding Professions', err)
      // no op - swallow errors for now
    })

    // add character stats
    await this.CharacterStats.addCharacterStats(characterObj).catch(() => {
      // no op - swallow errors for now
    })
  }

  /**
   *
   * @param {*} characterObj
   * @returns
   */
  #getVocation (characterObj) {
    if (characterObj.data.Crafting === undefined || characterObj.data.Crafting.Vocation === undefined) {
      return 'None'
    } else {
      return characterObj.data.Crafting.Vocation
    }
  }

  /**
   *
   * @returns
   */
  getAllAccounts () {
    return this.allSqlOneColumn('account', this.sql.select_all_accounts)
  }

  /**
   *
   * @returns
   */
  getAllServers () {
    return this.allSqlOneColumn('server', this.sql.select_all_servers)
  }

  /**
   *
   * @returns
   */
  getAllClasses () {
    // sorting this so that the Creep class always shows up at the end of the array
    return this.allSqlOneColumn('class', this.sql.select_all_classes)
  }

  /**
   *
   * @returns
   */
  getAllRaces () {
    return this.allSqlOneColumn('race', this.sql.select_all_races)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getCharacter (characterName, account, server) {
    return this.getSql(this.sql.select, account, server, characterName)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  delete (characterName, account, server) {
    return this.runSql(this.sql.delete, characterName, account, server)
  }
}

module.exports = { Characters }
