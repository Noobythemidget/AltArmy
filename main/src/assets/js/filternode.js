// this works for characters table
function characterRowToArray (r) {
  return [r.name, r.account, r.server, r.class, r.race].map((e) =>
    e.toLowerCase()
  )
}

function walletAndInventoryRowToArray (r) {
  const set = new Set()
  set.add(r.name) // inventory uses this column
  set.add(r.currency_name) // wallets use this column
  const json = JSON.parse(r.locations)
  json.forEach(e => {
    set.add(e.account)
    set.add(e.server)
    set.add(e.character)
    set.add(e.container)
  })
  return Array.from(set).filter(e => e !== undefined).map((e) => e.toLowerCase())
}

function contains (array, value) {
  // return array.includes(value)
  return array.some(e => e.includes(value))
}

// function isNullOrUndefined (obj) {
//   return Object.is(obj, null) || Object.is(obj, undefined)
// }

class FilterNode {
  static TYPE_OR = 'OR' // OR nodes filter a row when any of the children match
  static TYPE_AND = 'AND' // AND nodes filter a row when all of the children match
  static TYPE_NEG = 'NEG' // NEG nodes filter a row when all of the children don't match
  static TYPE_VALUE = 'VALUE' // VALUE nodes contain a value that will be compared with a column of a row
  static TYPE_TRUE = 'TRUE' // TRUE nodes always retun true
  static TYPE_FALSE = 'FALSE' // FALSE nodes always return false

  static DELIM_OR = ','
  static DELIM_AND = '+'
  static DELIM_RANGE = '-' // used to indicate a level rage e.g. 15-133 is the same as 15 <= level <= 133

  static PREFIX_NEG = '-' // negation operator
  static PREFIX_LT = '<' // less than or equal to level e.g. <16 is the same as level <= 16
  static PREFIX_GT = '>' // greater than or equal to level e.g. >35 is the same as level >= 35

  // param to applyFilter method
  static FILTER_CHARACTERS = 'FILTER_CHARACTERS'
  static FILTER_WALLET = 'FILTER_WALLET_AND_INVENTORY'
  static FILTER_INVENTORY = 'FILTER_WALLET_AND_INVENTORY'

  constructor (type, filterString) {
    this.type = type
    this.value = null
    this.children = []

    if (
      filterString !== null &&
      typeof filterString !== 'undefined' &&
      filterString.trim() !== ''
    ) {
      switch (type) {
        case FilterNode.TYPE_OR:
          this.children = this.children.concat(this.#initOrNodes(filterString))
          break
        case FilterNode.TYPE_AND:
          this.children = this.children.concat(this.#initAndNodes(filterString))
          break
        case FilterNode.TYPE_NEG:
          this.children = this.children.concat(this.#initNegNode(filterString))
          break
        case FilterNode.TYPE_VALUE:
          this.value = filterString
          break
      }
    }
  }

  #initOrNodes (filterString) {
    return this.#_initOrAndNodes(filterString, FilterNode.DELIM_OR)
  }

  #initAndNodes (filterString) {
    return this.#_initOrAndNodes(filterString, FilterNode.DELIM_AND)
  }

  #_initOrAndNodes (filterString, delim) {
    const filterStrings = this.#filterStringSplitter(filterString, delim)

    const nodeArray = []
    filterStrings.forEach((fs) => {
      if (this.#andTest(fs)) {
        // this test will only pass when this method is called by #initOrNodes
        // because #initAndNodes splits with '+' delim , '+' signs will no longer appear
        // in the filterString elements
        //
        // #initOrNodes and #initAndNodes are identical except for this condition
        //
        // #andTest checks that there is a '+' in the filter.
        // nodeArray.concat(this.#initAndNodes(fs))
        nodeArray.push(new FilterNode(FilterNode.TYPE_AND, fs))
      } else if (this.#negTest(fs)) {
        // nodeArray.concat(this.#initNegNode(fs))
        nodeArray.push(new FilterNode(FilterNode.TYPE_NEG, fs.substr(1)))
      } else if (!fs.startsWith('-')) {
        // nodeArray.push(this.#initValueNode(fs))
        nodeArray.push(new FilterNode(FilterNode.TYPE_VALUE, fs))
      }
    })

    return nodeArray
  }

  #initNegNode (filterString) {
    const nodeArray = []
    if (this.#negTest(filterString)) {
      // starts with a '-' so this is a negative operation
      const negNode = new FilterNode(
        FilterNode.TYPE_NEG, // type of node
        filterString.substr(1) // the value without the '-' prefix
      )
      nodeArray.push(negNode)
    } else {
      // when it fails the negTest it is a value node
      const valNode = new FilterNode(
        FilterNode.TYPE_VALUE, // type of node
        filterString
      ) // the value
      nodeArray.push(valNode)
    }
    return nodeArray
  }

  #initValueNode (filterString) {
    return new FilterNode(FilterNode.TYPE_VALUE, filterString)
  }

  #filterStringSplitter (filterString, delimeter) {
    return filterString
      .toLowerCase() // standardize to lowercase letters for our filters
      .split(delimeter) // split into an array using given delimeter ',' or '+'
      .map((e) => e.trim()) // trim whitespace from tokens
      .filter((e) => e !== '') // filter out empty strings
  }

  #negTest (str) {
    return str.startsWith(FilterNode.PREFIX_NEG) && str.substr(1).length > 0
  }

  #andTest (str) {
    return str.includes(FilterNode.DELIM_AND)
  }

  // applies filter to the row
  applyFilter (row, filterFlag) {
    switch (this.type) {
      case FilterNode.TYPE_OR:
        return this.#applyOrTest(row, filterFlag)
      case FilterNode.TYPE_AND:
        return this.#applyAndTest(row, filterFlag)
      case FilterNode.TYPE_NEG:
        return this.#applyNegTest(row, filterFlag)
      case FilterNode.TYPE_VALUE:
        if (filterFlag === FilterNode.FILTER_WALLET || filterFlag === FilterNode.FILTER_INVENTORY) { // both of these flags have the same value, just doing it this way for readability
          return this.#applyValueTestForWalletOrInventory(row)
        } else {
          return this.#applyValueTest(row) // FILTER_CHARACTERS
        }
      case FilterNode.TYPE_TRUE:
        return true
      case FilterNode.TYPE_FALSE:
        return false
    }
  }

  #applyOrTest (row, filterFlag) {
    return this.children.some((f) => f.applyFilter(row, filterFlag))
  }

  #applyAndTest (row, filterFlag) {
    return this.children.every((f) => f.applyFilter(row, filterFlag))
  }

  #applyNegTest (row, filterFlag) {
    // there should only be one child in a neg node
    return !this.children.every((f) => f.applyFilter(row, filterFlag))
  }

  #applyValueTest (row) {
    // values can be a string that matches a field in the characer row
    // or
    // values can be an expression that matches the character's level
    //
    // types of expressions:
    //
    // <level - less than equal to level
    //    e.g. <50 for characters level 50 and below
    //
    // >level - greater than equal to level
    //    e.g. >50 for characters level 50 and above
    //
    // level1-level2 - level range
    //    e.g. 45-75 for characters lvl 45 to lvl 75

    if (this.#nanTest(FilterNode.PREFIX_GT)) {
      // >=
      return row.level >= parseInt(this.value.substr(1))
    } else if (this.#nanTest(FilterNode.PREFIX_LT)) {
      // <=
      return row.level <= parseInt(this.value.substr(1))
    } else if (this.#nanRangeTest()) {
      // level1 <= level <= level2
      const rangeArray = this.value
        .split(FilterNode.DELIM_RANGE)
        .map((level) => parseInt(level))

      return rangeArray[0] <= row.level && row.level <= rangeArray[1]
    } else if (!isNaN(this.value)) {
      // =
      return row.level === parseInt(this.value)
    } else {
      // match any field
      // return characterRowToArray(row).includes(this.value)
      return contains(characterRowToArray(row), this.value)
    }
  }

  #applyValueTestForWalletOrInventory (row) {
    // return walletAndInventoryRowToArray(row).includes(this.value)
    return contains(walletAndInventoryRowToArray(row), this.value)
  }

  #nanTest (prefix) {
    return this.value.startsWith(prefix) && !isNaN(this.value.substr(1))
  }

  #nanRangeTest () {
    const rangeArray = this.value.split(FilterNode.DELIM_RANGE)
    if (
      rangeArray.length === 2 &&
      !isNaN(rangeArray[0]) &&
      !isNaN(rangeArray[1])
    ) {
      return true
    } else {
      return false
    }
  }

  static fromCharacterFilters (toolbarOptions) {
    // console.log(toolbarOptions)
    const characterFilterNode = new FilterNode(FilterNode.TYPE_AND, '')
    toolbarOptions.getSelectedValues().forEach(selectedString => {
      characterFilterNode.children.push(
        new FilterNode(FilterNode.TYPE_OR, selectedString
        )
      )
    })
    return characterFilterNode
  }

  static initRootFilterNode (toolbarOptions) {
    const rootNode = FilterNode.fromCharacterFilters(toolbarOptions)
    if (
      !Object.is(toolbarOptions.search, undefined) &&
      !Object.is(toolbarOptions.search, null) &&
      toolbarOptions.search.trim() !== ''
    ) {
      rootNode.children.push(
        new FilterNode(
          FilterNode.TYPE_OR,
          toolbarOptions.search
        )
      )
    }
    return rootNode
  }
}

module.exports = { FilterNode }
