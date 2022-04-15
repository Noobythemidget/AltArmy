import { Loading } from 'quasar'
import { AABtnDropdownOptions, AAToolbarOptions } from 'assets/js/aatoolbar.js'
import { Logger } from 'assets/js/logger.js'
import OneRing from 'components/OneRing.vue'

let loadCounter = 0

// ESM export format instead of module.exports at the bottom
export function startLoading () {
  if (loadCounter === 0) {
    Loading.show({
      message: 'Loading plugin data...',
      messageColor: 'accent',
      spinner: OneRing,
      spinnerSize: 300,
      spinnerColor: 'accent'
    })
  }
  loadCounter++
}

export function stopLoading () {
  if (loadCounter > 0) {
    loadCounter--
  }
  if (loadCounter === 0) {
    Loading.hide()
  }
}

export async function setupDropdownFilterHelper (storeObjChild) {
  Logger.log('setupDropdownFilterHelper')
  startLoading()
  return window.invoke('get-dropdown-filter-lists').then((result) => {
    Logger.log(result)

    // array for all the new dropdown options objects, see AABtnDropdownOptions in aatoolbar.js
    const newDropdownOptionsArray = []

    // create a map of the old drop down options so we can do easy lookups
    const oldOptionsMap = new Map()
    storeObjChild.toolbarOptions.dropdownOptions.forEach(e => oldOptionsMap.set(e.label, e))

    // creates a map of an options list items (i.g. {label, selected} objects) for easy lookup, see AABtnDropdownOptionsListItem in aatoolbar.js
    // we'll use these values to populate the new options so that selections don't change between page changes
    const createListItemMap = (options) => {
      const selectionsMap = new Map()
      options.forEach(e => selectionsMap.set(e.label, e.selected))
      return selectionsMap
    }

    // setup drop down option and add to newDropdownOptionsArray
    const setupNewDropdownOption = (label, resultArray) => {
      if (oldOptionsMap.has(label)) { //
        const newOption = AABtnDropdownOptions.initFromLabelArray(
          label,
          resultArray,
          true // default value for all the selections
        )

        // overwrite selections with old values if there any
        const oldItems = createListItemMap(oldOptionsMap.get(label).options)
        newOption.options.forEach(e => {
          if (oldItems.has(e.label)) {
            e.selected = oldItems.get(e.label)
          }
        })

        newDropdownOptionsArray.push(newOption)
      }
    }

    setupNewDropdownOption('Account', result.accounts)
    setupNewDropdownOption('Server', result.servers)
    setupNewDropdownOption('Race', result.races)
    setupNewDropdownOption('Class', result.classes)

    const tboptions = new AAToolbarOptions()
    tboptions.search = storeObjChild.toolbarOptions.search
    tboptions.dropdownOptions = newDropdownOptionsArray

    storeObjChild.toolbarOptions = tboptions.toJson()
    Logger.log(storeObjChild.toolbarOptions)
  }).finally(() => {
    stopLoading()
  })
}

export function dropdownHandleStateChangedHelper (storeObjChild, json) {
  Logger.log('dropdownHandleStateChangedHelper')
  Logger.log(json)
  Logger.log(storeObjChild.toolbarOptions)
  const toolbarOptions = storeObjChild.toolbarOptions
  toolbarOptions.search = json.search === undefined ? '' : json.search
  for (let i = 0; i < toolbarOptions.dropdownOptions.length; i++) {
    for (let j = 0; j < toolbarOptions.dropdownOptions[i].options.length; j++) {
      toolbarOptions.dropdownOptions[i].options[j].selected = json.dropdownOptions[i].options[j].selected
    }
  }
  Logger.log('toolbar updated')
  Logger.log(toolbarOptions)
}

// Simple: [
//         {
//           label: 'Satisfied customers (with avatar)',
//           avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
//           children: [
//             {
//               label: 'Good food (with icon)',
//               icon: 'restaurant_menu',
//               children: [
//                 { label: 'Quality ingredients' },
//                 { label: 'Good recipe' }
//               ]
//             },
export function mergeLocationsJson (locationsJson) {
  // helper functions
  let id = 1
  const createNode = (name, icon, type, quantity) => {
    return {
      // these are standard node properties (see quasar doc.)
      label: name + ': ' + quantity.toLocaleString(),
      expandable: true,
      noTick: true,
      icon: icon,
      children: [],

      // these are properties added by alt army
      id: id++,
      type: type,
      name: name,
      quantity: quantity
    }
  }
  const getOrCreateNode = (nodesArray, name, icon, type, quantity) => {
    for (const node of nodesArray) {
      if (node.name === name) {
        return node
      }
    }
    const node = createNode(name, icon, type, quantity)
    nodesArray.push(node)
    return node
  }
  const getIcon = (e) => {
    if (e[e.sub_category] === 'Shared Storage') {
      return 'people_outline'
    } else if (e[e.sub_category].endsWith(' (Vault)')) {
      return 'person_outline'
    } else {
      return 'person'
    }
  }
  const sortFunc = (first, second) => {
    if (first.name === 'Shared Storage') {
      return -1
    }
    if (second.name === 'Shared Storage') {
      return 1
    }
    if (first.name.endsWith(' (Vault)') && first.name.startsWith(second.name)) {
      return 1
    }
    if (second.name.endsWith(' (Vault)') && second.name.startsWith(first.name)) {
      return -1
    }

    return first.name.localeCompare(second.name)
  }

  // starts here
  const json = JSON.parse(locationsJson)
  const jsonArray = []
  json.forEach(e => {
    const acc = getOrCreateNode(jsonArray, e.account, 'account_circle', 'account', e.quantity)
    acc.account = e.account
    const server = getOrCreateNode(acc.children, e.server, 'public', 'server', e.quantity)
    server.account = e.account
    server.server = e.server

    if (e.sub_category === 'account') {
      // sub_category is 'account' only for account wallet items (see sql queries).
      // These don't have children under server
      // server.quantity = e.quantity
    } else {
      const node = createNode(
        e[e.sub_category], // using e.sub_category because the sql returns different keys for wallet and inventory queries
        getIcon(e),
        'container',
        e.quantity)

      node.account = e.account
      node.server = e.server
      server.children.push(node)
    }
  })

  // update quantities
  jsonArray.sort(sortFunc)
  jsonArray.forEach(acc => {
    let qtyA = 0
    acc.children.sort(sortFunc)
    acc.children.forEach(server => {
      if (server.children.length > 0) {
        let qtyS = 0
        server.children.sort(sortFunc)
        server.children.forEach(c => { qtyS += c.quantity })
        server.quantity = qtyS
      }
      server.label = server.name + ': ' + server.quantity.toLocaleString()
      qtyA += server.quantity
    })
    acc.quantity = qtyA
    acc.label = acc.name + ': ' + acc.quantity.toLocaleString()
  })

  return jsonArray
}
