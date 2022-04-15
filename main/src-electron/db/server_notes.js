const { BaseTable, TYPE } = require('./base_table.js')

class ServerNotes extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'server_notes', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {
    create: `   CREATE TABLE IF NOT EXISTS server_notes (
                    id            INTEGER       PRIMARY KEY,
                    note          TEXT          NOT NULL,
                    timestamp     DATE          NOT NULL,
                    server_id     INTEGER       NOT NULL,
                    FOREIGN KEY   (server_id) 
                    REFERENCES    servers (id) 
                      ON DELETE     CASCADE 
                      ON UPDATE     NO ACTION
                );`,

    insert: `   INSERT INTO server_notes (
                    note, 
                    timestamp, 
                    server_id
                ) VALUES (
                    ?, 
                    datetime('now'),
                    ?
                );`,

    select: `   SELECT 
                    id, 
                    note, 
                    datetime(timestamp,'localtime') AS timestamp, 
                    server_id 
                FROM 
                    server_notes 
                WHERE 
                    server_id=?;`,

    update: `   UPDATE server_notes 
                SET note=?, 
                    timestamp=datetime('now') 
                WHERE id=?;`,

    delete: `   DELETE FROM server_notes 
                WHERE id=?;`

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

  addServerNote (note, serverId) {
    return this.runSql(this.sql.insert, note, serverId)
  }

  updateServerNote (id, note) {
    return this.runSql(this.sql.update, note, id)
  }

  deleteServerNote (id) {
    return this.runSql(this.sql.delete, id)
  }

  getServerNotes (serverId) {
    return this.allSql(this.sql.select, serverId)
  }
}

module.exports = { ServerNotes }
