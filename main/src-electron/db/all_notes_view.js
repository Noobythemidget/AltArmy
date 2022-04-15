const { BaseTable, TYPE } = require('./base_table.js')

class AllNotesView extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'all_notes', TYPE.VIEW)
  }

  /**
   * This object contains all the sql statements for the all_notes view
   */
  sql = {
    create: ` CREATE VIEW IF NOT EXISTS all_notes (
                id,
                note,
                timestamp,
                source,
                character_name,
                account,
                server
              ) AS
              SELECT 
                id,
                note,
                timestamp,
                'character_notes',
                character_name,
                account,
                server
              FROM character_notes
              UNION ALL
              SELECT 
                id,
                note,
                timestamp,
                'account_notes',
                NULL,
                (SELECT name FROM accounts WHERE id = a.account_id) as account,
                NULL
              FROM account_notes AS a
              UNION ALL
              SELECT 
                id,
                note,
                timestamp,
                'server_notes',
                NULL,
                NULL,
                (SELECT name FROM servers WHERE id = s.server_id) as server
              FROM server_notes AS s ORDER BY timestamp DESC;`
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
}

module.exports = { AllNotesView }
