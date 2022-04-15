const { BaseTable, TYPE } = require('./base_table.js')

class TemporaryNotes extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'temporary_notes', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    // this table will contain notes from all notes tables: account_notes, character_notes
    // the 'source' column will have the name of the table the row came from
    create: `                 CREATE TABLE IF NOT EXISTS temporary_notes (
                                  id              INTEGER       PRIMARY KEY,
                                  note            TEXT          NOT NULL,
                                  timestamp       DATE          NOT NULL,
                                  character_name  TEXT              NULL,
                                  account         TEXT              NULL,
                                  server          TEXT              NULL,
                                  source          TEXT          NOT NULL
                              );`,

    insert: `                 INSERT OR IGNORE INTO temporary_notes (
                                  timestamp, 
                                  note, 
                                  character_name, 
                                  account, 
                                  server,
                                  source
                              ) 
                              SELECT 
                                  timestamp, 
                                  note, 
                                  null, 
                                  (SELECT name FROM accounts WHERE id = a.account_id), 
                                  null,
                                  "account_notes" 
                              FROM account_notes AS a
                              UNION ALL 
                              SELECT 
                                  timestamp, 
                                  note, 
                                  null,
                                  null,
                                  (SELECT name FROM servers WHERE id = s.server_id), 
                                  "server_notes" 
                              FROM server_notes AS s
                              UNION ALL 
                              SELECT 
                                  timestamp, 
                                  note, 
                                  character_name, 
                                  account, 
                                  server, 
                                  "character_notes"
                              FROM character_notes;`,

    // backup_account_notes: `   INSERT OR IGNORE INTO temporary_notes (
    //                               timestamp,
    //                               note,
    //                               character_name,
    //                               account,
    //                               server,
    //                               source
    //                           )
    //                           SELECT
    //                               timestamp,
    //                               note,
    //                               null,
    //                               (SELECT name FROM accounts WHERE id = a.account_id),
    //                               null,
    //                               "account_notes"
    //                           FROM account_notes AS a`,

    // backup_server_notes: `    INSERT OR IGNORE INTO temporary_notes (
    //                               timestamp,
    //                               note,
    //                               character_name,
    //                               account,
    //                               server,
    //                               source
    //                           )
    //                           SELECT
    //                               timestamp,
    //                               note,
    //                               null,
    //                               null,
    //                               (SELECT name FROM servers WHERE id = s.server_id),
    //                               "server_notes"
    //                           FROM server_notes AS s`,

    // backup_character_notes: ` INSERT OR IGNORE INTO temporary_notes (
    //                               timestamp,
    //                               note,
    //                               character_name,
    //                               account,
    //                               server,
    //                               source
    //                           )
    //                           SELECT
    //                               timestamp,
    //                               note,
    //                               character_name,
    //                               account,
    //                               server,
    //                               "character_notes"
    //                           FROM character_notes;`,

    insert_account_notes: `   INSERT INTO account_notes (
                                  timestamp, 
                                  note, 
                                  account_id
                              ) 
                              SELECT 
                                  timestamp, 
                                  note, 
                                  (SELECT a.id FROM accounts AS a WHERE a.name=k.account) AS account_id
                              FROM temporary_notes AS k
                              WHERE source = "account_notes";`,

    insert_server_notes: `    INSERT INTO server_notes (
                                  timestamp, 
                                  note, 
                                  server_id
                              ) 
                              SELECT 
                                  timestamp, 
                                  note, 
                                  (SELECT s.id FROM servers AS s WHERE s.name=k.server) AS server_id
                              FROM temporary_notes AS k
                              WHERE source = "server_notes";`,

    insert_character_notes: ` INSERT INTO character_notes (
                                  timestamp, 
                                  note, 
                                  character_name,
                                  account,
                                  server
                              ) 
                              SELECT 
                                  timestamp, 
                                  note,
                                  character_name,
                                  account,
                                  server 
                              FROM temporary_notes
                              WHERE source = "character_notes";`
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
   * @returns
   */
  backup () {
    return this.execSql(this.sql.insert)
  }

  /**
   *
   */
  backupSync () {
    this.execSqlSync(this.sql.insert)
  }

  // /**
  //  *
  //  * @returns
  //  */
  // backupAccountNotes () {
  //   return this.execSql(this.sql.backup_account_notes)
  // }

  // /**
  //  *
  //  */
  // backupAccountNotesSync () {
  //   this.execSqlSync(this.sql.backup_account_notes)
  // }

  // /**
  //  *
  //  * @returns
  //  */
  // backupServerNotes () {
  //   return this.execSql(this.sql.backup_server_notes)
  // }

  // /**
  //  *
  //  */
  // backupServerNotesSync () {
  //   this.execSqlSync(this.sql.backup_server_notes)
  // }

  // /**
  //  *
  //  * @returns
  //  */
  // backupCharacterNotes () {
  //   return this.execSql(this.sql.backup_character_notes)
  // }

  // /**
  //  *
  //  */
  // backupCharacterNotesSync () {
  //   this.execSqlSync(this.sql.backup_character_notes)
  // }

  /**
  *
  * @returns
  */
  restore () {
    const promiseArray = [
      this.execSql(this.sql.insert_account_notes),
      this.execSql(this.sql.insert_server_notes),
      this.execSql(this.sql.insert_character_notes)
    ]
    return Promise.all(promiseArray)
  }

  /**
   *
   */
  restoreSync () {
    this.execSqlSync(this.sql.insert_account_notes)
    this.execSqlSync(this.sql.insert_server_notes)
    this.execSqlSync(this.sql.insert_character_notes)
  }
}

module.exports = { TemporaryNotes }
