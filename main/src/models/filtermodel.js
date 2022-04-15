class FilterItem {
  constructor (name) {
    this.name = name
    this.value = true
  }

  toggle () {
    this.value = !this.value
  }
}

class FilterModel {
  constructor (filterName) {
    this.name = filterName
    this.filterItems = []
  }

  clear () {
    this.filterItems = []
  }

  getArrayOfNames () {
    const names = new Set()
    this.filterItems.forEach(item => {
      names.push(item.name)
    })
    return Array.from(names).sort((item1, item2) => {
      return item1.name.localeCompare(item2.name)
    })
  }

  hasItem (name) {
    for (let i = 0; i < this.filterItems.length; i++) {
      if (this.filterItems[i].name === name) {
        return true
      }
    }
    return false
  }

  addNewItemm (name) {
    this.addItem(new FilterItem(name))
  }

  addItem (item) {
    if (!this.hasItem(item.name)) {
      this.filterItems.push(item)
    }
  }

  setItemByName (name, value) {
    this.filterItems.forEach(fi => {
      if (fi.name === name) {
        fi.value = value
      }
    })
  }

  setItem (index, value) {
    this.filterItems[index].value = value
  }

  toggleByName (name) {
    this.filterItems.forEach(fi => {
      if (fi.name === name) {
        fi.toggle()
      }
    })
  }

  toggle (index) {
    this.filterItem[index].toggle()
  }

  getItemByName (name) {
    for (let i = 0; i < this.filterItems.length; i++) {
      if (this.filterItems[i].name === name) {
        return this.filterItems[i]
      }
    }
    return null
  }
}

module.exports = { FilterModel, FilterItem }
