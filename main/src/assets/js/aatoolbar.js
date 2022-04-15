const aatoolbar = {
  messages: {
    searchTooltip:
        '<strong>Customize searches for your characters.</strong>' +
        '<ul>' +
        '<li>All searches are case insensitive.</li>' +
        "<li>Separate different searches with a comma <code>','</code>.</li>" +
        "<li>Combine searches with a plus sign <code>'+'</code>.</li>" +
        "<li>Inverse results with a minus sign <code>'-'</code>.</li>" +
        "<li>Specify level ranges with the following symbols: <code>'&gt;', '&lt;', '-'</code></li>" +
        '</ul><br/>' +
        '<strong>Examples:</strong><br/>' +
        "<table border='0'>" +
        '<tr><td style="text-align: right;"><code>hobbit,elf</code></td><td>&nbsp;</td><td> - will match all hobbit and elf characters</td></tr>' +
        '<tr><td style="text-align: right;"><code>hobbit+hunter,elf</code></td><td>&nbsp;</td><td> - will match all hobbit hunters and any elf characters.</td></tr>' +
        '<tr><td style="text-align: right;"><code>hunter+-hobbit</code></td><td>&nbsp;</td><td> - will match all hunters that are not hobbit characters.</td></tr>' +
        '<tr><td style="text-align: right;"><code>dwarf+&gt;50</code></code></td><td>&nbsp;</td><td> - will match all dwarf characters that are lvl 50 and over.</td></tr>' +
        '<tr><td style="text-align: right;"><code>hobbit+&lt;30</code></code></td><td>&nbsp;</td><td> - will match all hobbit characters that are lvl 30 and lower.</td></tr>' +
        '<tr><td style="text-align: right;"><code>30-45</code></code></td><td>&nbsp;</td><td> - will match all characters between levels 30 and 45 inclusive.</td></tr>' +
        '</table>'
  }
}

// this class represents an AAToolbar component
// it consists of a search field
// and an array of AABtnDropdownOptions for the drop down lists
class AAToolbarOptions {
  constructor () {
    this.search = ''
    this.dropdownOptions = []
  }

  // creates a new AAToolbarOptions
  // labelArray - an array of labels for dropdownOptions[] to be created
  static init (labelArray) {
    const obj = new AAToolbarOptions()
    labelArray.forEach(label => obj.addDropdownOption(label, []))
    return obj
  }

  addDropdownOption (label, optionsArray) {
    this.dropdownOptions.push(AABtnDropdownOptions.init(label, optionsArray, true))
  }

  getDropdownOption (label) {
    let ddOption
    this.dropdownOptions.forEach(e => {
      if (e.label === label) {
        ddOption = e
      }
    })
    return ddOption
  }

  setDropdownOption (label, optionsArray) {
    // should probably reimplement this as a Set since class doesn't prevent multiple options with same label being added
    this.dropdownOptions.forEach(e => {
      if (e.label === label) {
        e.options = optionsArray
      }
    })
  }

  //
  update (toolbarOptions) {
    this.search = toolbarOptions.search

    const map = new Map()
    this.dropdownOptions.forEach(e => map.set(e.label, e))
    toolbarOptions.dropdownOptions.forEach(e => {
      const dropdownOptions = map.get(e.label)
      dropdownOptions.update(e)
    })
  }

  getSelectedValues () {
    const selectedValueStrings = []
    this.dropdownOptions.forEach(e => {
      selectedValueStrings.push(e.getSelectedValues().join(','))
    })
    return selectedValueStrings
  }

  toJson () {
    // const array = []
    // for (const e of this.dropdownOptions) {
    //   array.push(e.toJson())
    // }
    this.dropdownOptions.forEach(e => console.log(e))
    return {
      search: this.search,
      dropdownOptions: this.dropdownOptions.map(e => e.toJson())
    }
  }

  static initFromJsonObj (jsonObj) {
    const toolbarOptions = new AAToolbarOptions()
    toolbarOptions.search = jsonObj.search
    if (jsonObj.dropdownOptions !== undefined) {
      jsonObj.dropdownOptions.forEach(e => {
        toolbarOptions.dropdownOptions.push(AABtnDropdownOptions.initFromJsonObj(e))
      })
    }
    return toolbarOptions
  }
}

// this class represents an AAToolbarBtnDropdown component
// it consists of a label to be displayed on the drop down button
// and an array of AABtnDropdownOptionsListItem for the options
class AABtnDropdownOptions {
  constructor (label) {
    this.label = label
    this.options = []
  }

  //
  static init (label, optionsArray) {
    const obj = new AABtnDropdownOptions(label)
    obj.options = optionsArray
    return obj
  }

  /**
   * creates a new AABtnDropdownOptions with the given label and options[]
   * @param {*} label label of the AABtnDropdownOptions
   * @param {*} optionsLabelArray labels for each of the options to be created
   * @param {*} selected the selected flag each of the options will be set to
   * @returns
   */
  static initFromLabelArray (label, optionsLabelArray, selected) {
    const obj = new AABtnDropdownOptions(label)
    obj.initOptionsFromLabelArray(optionsLabelArray, selected)
    return obj
  }

  /**
   *
   * @param {*} label
   * @param {*} selected
   */
  addOption (label, selected) {
    this.options.push(new AABtnDropdownOptionsListItem(label, selected))
  }

  // sets the selected value of the option with matching label - assuming unique label values but not enforced
  // no error if matching option is not found
  setOption (label, selected) {
    this.options.forEach(e => {
      if (e.label === label) {
        e.selected = selected
      }
    })
  }

  getSelectedValues () {
    return this.options.filter(e => e.selected).map(e => e.value)
  }

  // initializes the options[] with new options given with the given labels and selected flag
  initOptionsFromLabelArray (labelArray, selected) {
    this.options = []
    labelArray.forEach(e => {
      this.addOption(e, selected)
    })
  }

  update (dropdownOptions) {
    this.label = dropdownOptions.label
    this.options = []
    dropdownOptions.options.forEach(e => this.options.push(e))
  }

  toJson () {
    // const array = []
    // for (const e of this.options) {
    //   array.push(e.toJson())
    // }
    return {
      label: this.label,
      options: this.options.map(e => e.toJson())
    }
  }

  static initFromJsonObj (jsonObj) {
    const btnDropdownOptions = new AABtnDropdownOptions(jsonObj.label)
    if (jsonObj.options !== undefined) {
      jsonObj.options.forEach(e => {
        btnDropdownOptions.options.push(new AABtnDropdownOptionsListItem(e.label, e.selected))
      })
    }
    return btnDropdownOptions
  }
}

// this class represents an individual option in a QOptionGroup component
class AABtnDropdownOptionsListItem {
  constructor (label, selected) {
    this.label = label // String
    this.value = label // String, same as label
    this.selected = selected // boolean
  }

  toJson () {
    return {
      label: this.label,
      value: this.value,
      selected: this.selected
    }
  }
}

module.exports = { aatoolbar, AAToolbarOptions, AABtnDropdownOptions, AABtnDropdownOptionsListItem }
