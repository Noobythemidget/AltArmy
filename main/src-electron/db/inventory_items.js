const { BaseTable, TYPE, decodeUTF8 } = require('./base_table.js')

class InventoryItems extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'inventory_items', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS inventory_items (
                    name                    TEXT    NOT NULL,
                    sort_category           TEXT    NOT NULL,
                    category                TEXT    NOT NULL,
                    background_image_id     TEXT    NOT NULL,
                    icon_image_id           TEXT    NOT NULL,
                    quality                 TEXT    NOT NULL,
                    character_name          TEXT    NOT NULL,
                    account                 TEXT    NOT NULL,
                    server                  TEXT    NOT NULL,
                    vault                   TEXT    NOT NULL,
                    container_name          TEXT    NOT NULL,
                    quantity                INTEGER NOT NULL,
                    PRIMARY KEY (name, character_name, account, server, vault, container_name)
                );`,
    // FOREIGN KEY (character_name, account, server)
    //     REFERENCES characters (name, account, server)
    //     ON DELETE CASCADE
    //     ON UPDATE NO ACTION
    /*
      Removing Foreign key constraint because some items will be linked to 'Shared Storage'.
      There are no characters of that name, so foreign key constraint will fail.

      These entries will be deleted by a trigger instead.
    */

    insert: `   INSERT OR REPLACE INTO inventory_items (
                    name, 
                    sort_category, 
                    category, 
                    background_image_id, 
                    icon_image_id, 
                    quality, 
                    character_name, 
                    account, 
                    server, 
                    vault, 
                    container_name, 
                    quantity
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
                    ?, 
                    ?
                );`,

    select: `   SELECT * 
                FROM inventory_items 
                WHERE   character_name  = ? AND 
                        account         = ? AND 
                        server          = ?;`,

    select2: `  SELECT 
                    name, 
                    sum(t.qty) AS quantity, 
                    json_group_object(t.location, t.quantity) AS location_json
                FROM 
                    (
                        SELECT 
                            name, 
                            sum(quantity) AS qty, 
                            quantity,
                            iif(character_name = "Shared Storage", "Shared Storage",
                                                                    iif(vault = 1,  "Vault Storage", 
                                                                                    "Inventory Bags")) AS location 
                        FROM 
                            inventory_items
                        WHERE ( character_name = ? OR character_name = "Shared Storage" ) AND 
                                account = ? AND 
                                server  = ?
                        GROUP BY 
                            name, 
                            quantity, 
                            character_name, 
                            vault 
                        ORDER BY 
                            name
                    ) AS t
                GROUP BY 
                    name 
                ORDER BY name;`,

    selectall: `    SELECT 
                        name, 
                        sum(quantity) AS quantity, 
                        json("[" || group_concat(location) || "]") AS locations
                    FROM 
                        (
                            SELECT 
                                name, 
                                sum(quantity) AS quantity,
                                json_object('category',     'inventory', 
                                            'sub_category', 'container',
                                            'account',      account,
                                            'server',       server, 
                                            'container',    character_name || iif(character_name = "Shared Storage", "", iif(vault = 1, " (Vault)", "")),
                                            'quantity',     sum(quantity)
                                ) AS location
                            FROM 
                                inventory_items 
                            GROUP BY 
                                name, 
                                account, 
                                server, 
                                character_name, 
                                vault 
                            ORDER BY 
                                name, 
                                location
                        ) AS t
                        GROUP BY 
                            name 
                        ORDER BY 
                            name, 
                            locations;`

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
   * @param {*} obj
   * @returns
   */
  add (obj) {
    //   '(name, character_name, account, server, vault, container_name, quantity)' +
    // '(name, sort_category, category, background_image_id, icon_iamge_id, quality, character_name, account, server, vault, container_name, quantity)' +
    const promiseArray = []
    const VAULT = ' (Vault)'
    const SUBTOTAL = 'Subtotal'
    for (const characterKey of Object.keys(obj.data.Qty)) {
      if (characterKey !== undefined) {
        const vault = characterKey.endsWith(VAULT) || characterKey === 'Shared Storage'
        const characterName = characterKey.replaceAll(VAULT, '')
        for (const containerKey of Object.keys(obj.data.Qty[characterKey])) {
          if (containerKey !== undefined && containerKey !== SUBTOTAL) {
            //
            const quantity = obj.data.Qty[characterKey][containerKey]
            promiseArray.push(
              this.runSql(this.sql.insert,
                decodeUTF8(obj.name),
                obj.data.SortCategory,
                obj.data.Category,
                obj.data.BackgroundImageID,
                obj.data.IconImageID,
                obj.data.Quality,
                characterName,
                obj.account,
                obj.server,
                vault,
                containerKey,
                quantity
              )
            )
          }
        }
      }
    }
    return Promise.all(promiseArray)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getCharacterInventory (characterName, account, server) {
    return this.allSql(this.sql.select2, characterName, account, server)
  }

  /**
   *
   * @returns
   */
  getAltInventory () {
    return this.allSql(this.sql.selectall)
  }
}

module.exports = { InventoryItems }
