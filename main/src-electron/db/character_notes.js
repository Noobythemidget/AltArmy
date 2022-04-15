const { BaseTable, TYPE } = require('./base_table.js')

class CharacterNotes extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'character_notes', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS character_notes (
                    id              INTEGER PRIMARY KEY,
                    note            TEXT NOT NULL,
                    timestamp       DATE NOT NULL,
                    character_name  TEXT NOT NULL,
                    account         TEXT NOT NULL,
                    server          TEXT NOT NULL,
                    FOREIGN KEY (character_name, account, server)
                    REFERENCES characters (name, account, server)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
                );`,

    insert: `   INSERT INTO character_notes (
                    note, 
                    timestamp, 
                    character_name, 
                    account, 
                    server
                ) VALUES (
                    ?,
                    datetime('now'),
                    ?,
                    ?,
                    ?
                );`,

    select: `   SELECT 
                    id, 
                    note, 
                    datetime(timestamp,"localtime") AS timestamp, 
                    character_name, 
                    account, 
                    server 
                FROM 
                    character_notes 
                WHERE 
                    character_name  =? AND 
                    account         =? AND 
                    server          =?;`,

    update: `   UPDATE character_notes 
                SET     note        = ?, 
                        timestamp   = datetime('now') 
                WHERE   id          = ?;`,

    delete: `   DELETE FROM character_notes 
                WHERE id = ?;`

  }

  /**
   *
   * @returns
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
   * @param {*} note
   * @param {*} charcterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  addCharacterNote (note, charcterName, account, server) {
    return this.runSql(this.sql.insert, note, charcterName, account, server)
  }

  /**
   *
   * @param {*} id
   * @param {*} note
   * @returns
   */
  updateCharacterNote (id, note) {
    return this.runSql(this.sql.update, note, id)
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  deleteCharacterNote (id) {
    return this.runSql(this.sql.delete, id)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getCharacterNotes (characterName, account, server) {
    return this.allSql(this.sql.select, characterName, account, server)
  }
}

module.exports = { CharacterNotes }
