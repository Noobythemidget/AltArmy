<template>

  <div class="q-pa-sm">
    <q-table
      ref="baseQTable"
      class="plugin-data-view base-table"
      :rows-per-page-options="[50]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      :title="title"

      :loading-label="getLoadingLabel()"
      :no-results-label="getNoResultsLabel()"
      v-model:columns="columns"
      v-model:rows="getStoreProperty().rows"
      @refresh="refresh"
      :filter="getStoreFilter()"
      :filter-method="filterMethod"
      >

      <template v-slot:top>
          <AAToolbar  :icon="icon"
                      class="base-table-toolbar"
                      :label="title"
                      :searchTooltip="searchTooltip"
                      :toolbarOptions="getStoreProperty().toolbarOptions"
                      @stateChanged="handleStateChanged($event)">
          </AAToolbar>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props" class="base-table-header">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }} <AATooltip v-if="col.tooltip" :text="col.tooltip"></AATooltip>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :class="'base-table-body-row' + (props.expand ? ' base-table-body-row__expanded' : '')">

          <q-td auto-width>
            <div v-show="expandable">
              <q-btn
                class="table-btn-expand"
                size="xs"
                round
                dense
                @click="expandButtonClicked(props)"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </div>
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props" >
            <!-- if col is editable -->
            <div v-if="col.editable">

              <span v-if="col.html" v-html="col.value"></span>
              <span v-else>{{ col.value }}</span>

              <q-popup-edit v-model="props.row[col.name]"
                            :title="'Update ' + col.label"
                            class="edit_lp_popup"
                            buttons
                            v-slot="scope"
                            dense
                            anchor="top left"
                            label-set="OK"
                            :validate="(value) => { return validateHandler(col, value) }"
                            @save="(value, initialValue) => { saveHandler(props.row, col, value, initialValue)}">
                <div v-if="col.editableNumber">
                  <q-input  type="number"
                            v-model="scope.value"
                            dense
                            autofocus
                            input-class="popup-edit-input" />
                </div>
                <div v-else-if="col.editableNote">
                  <q-editor v-model="scope.value"
                            autofocus></q-editor>
                </div>
                <div v-else>
                  <q-input  type="text"
                            v-model="scope.value"
                            dense
                            autofocus
                            input-class="popup-edit-input" />
                </div>
              </q-popup-edit>

            </div>

            <!-- if col is not editable -->
            <div v-else>
              <span v-if="col.html" v-html="col.value"></span>
              <span v-else>{{ col.value }}</span>
            </div>
          </q-td>

        </q-tr>

        <!-- the row to display when main row is expanded -->
        <q-tr v-show="props.expand" :props="props" class="base-table-body-expanded-row">
          <q-td colspan="100%">
            <slot :props="props" v-if="props.expand"><!-- Content goes in here --></slot>
          </q-td>
        </q-tr>

      </template>

    </q-table>

  </div>

</template>

<style lang="sass">
.base-table
  /* height or max-height is important */
  // height: 93vh
  // min-height: 93vh
  border-radius: 10px  // default is 4px
  border-width: thick
  box-shadow: 0 0 1px 1px $top-table-border-color

  top: 10px
  bottom: 10px
  left: 10px
  right: 10px
  position: absolute

  .q-table__top
    height: 65px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: $top-table-head-foot-background    // top and bottom of the table background color
    color: $top-table-head-foot-text-icon                // label color in the header/footer

  thead tr th
    position: sticky
    z-index: 1

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  .q-table__control
    .material-icons
      color:  $top-table-head-foot-text-icon   // color of the pagination controls at the bottom

  .q-table__middle
    background: lighten($main-toolbar-background, 40%)     // default background when no rows
    .base-table-body-row__expanded
      background: $top-table-head-foot-text-icon !important
      color: black !important
      border-width: 3px
      border-color: black
      font-weight: 500
      font-size: 125%
    .base-table-body-row:nth-child(4n+1)  // odd rows
      background: $top-table-row-background-odd
      color: $top-table-row-text-odd
    .base-table-body-row:nth-child(4n+3)  // even rows
      background: $top-table-row-background-even
      color: $top-table-row-text-even
    .base-table-body-expanded-row:nth-child(4n+2)         // expanded odd rows
      background: $top-table-expanded-row-background-odd
    .base-table-body-expanded-row:nth-child(4n)         // expanded even rows
      background: $top-table-expanded-row-background-even
    .base-table-body-expanded-row
      td
        padding: $top-table-expanded-row-padding      // padding around contents of expanded row (e.g. q-tab-panels in the characters page)

.edit_lp_popup
  // border-color: $heat-yellow
  background: lighten($main-toolbar-background,6%) // popup background
  color: $top-table-head-foot-text-icon // popup label text
  max-width: 400px !important
  // width: 400px !important
  min-width: 200px !important
  .q-popup-edit__buttons
    .q-btn--actionable  // popup buttons
      background: $top-table-head-foot-text-icon
      color: black !important
  .q-dialog__title
    user-select: none

.q-editor
  background: lighten($main-toolbar-background, 5%)
  border-color: $top-table-head-foot-text-icon

.popup-edit-input
  color: $top-table-head-foot-text-icon// text color of input field
.q-field__control
  color: $top-table-head-foot-text-icon //underline when input field is in focus

// .notes-popup-edit //.q-popup-edit
//   width: 400px !important
//   min-width: 400px !important
//   max-width: 400px !important
//   background: lighten($dark, 6%)
//   color: $heat-yellow
//   .q-editor
//     border-color: orange
//     background: lighten($dark, 5%)
//   .q-popup-edit__buttons
//     .q-btn--rectangle
//       color: black !important
//       background: $heat-yellow !important
</style>

<script>
// import { ref, reactive } from 'vue'
import { AAToolbarOptions, aatoolbar } from 'assets/js/aatoolbar.js'
import { FilterNode } from 'assets/js/filternode.js'
import { startLoading, stopLoading, setupDropdownFilterHelper, dropdownHandleStateChangedHelper } from 'assets/js/util.js'

import { store } from 'assets/js/store.js'

import AAToolbar from 'components/AAToolbar.vue'
import AATooltip from 'components/AATooltip.vue'
import { Logger } from 'assets/js/logger.js'

export default {
  components: {
    AAToolbar,
    AATooltip
  },
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    expandable: { // disables expandable rows
      type: Boolean,
      required: false,
      default: true
    },
    expandButtonClicked: {
      type: Function,
      required: true,
      default: (props) => { props.expand = !props.expand }
    },
    forEachRow: {
      type: Function,
      required: false,
      default: (index, row) => { }
    },
    searchTooltip: {
      type: String,
      required: false,
      default: aatoolbar.messages.searchTooltip
    }
  },
  methods: {
    getName () {
      return 'AATable'
    },
    getLoadingLabel () {
      return 'Loading data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No matches.' // No characters matched.
    },
    getStoreProperty () {
      return undefined // something like store.characters
    },
    getStoreFilter () {
      return this.getStoreProperty().toolbarOptions
    },
    getRefreshEventName () {
      return '' // 'get-all-characters'
    },
    getFilterType () {
      return '' // the default
    },
    /*
    getEditableColumns () {
      // an array of these objects
      // {
      //   name: 'col name',
      //   save: (row, col, value, initialValue) => { ... }, // function called when edit changes saved
      //   validate: (value) => { ... } // function called to validate new value. returns boolean
      // }

      const array = []
      return array
    },
    getEditableColumn (colName) {
      const editableColumns = this.getEditableColumns()
      if (editableColumns !== undefined && editableColumns !== null) {
        for (let i = 0; i < editableColumns.length; i++) {
          if (editableColumns[i].name === colName) {
            return editableColumns[i]
          }
        }
      }
      return null
    },
    isEditableColumn (colName) {
      const col = this.getEditableColumn(colName)
      return col !== null
    },
    */
    validateHandler (col, value) {
      if (col.validate !== undefined) {
        return col.validate(value)
      } else {
        return true // pass validation by default
      }
    },
    saveHandler (row, col, value, initialValue) {
      if (col.save !== undefined) {
        return col.save(row, col, value, initialValue)
      } else {
        return true // pass validation by default
      }
    },
    async refresh () {
      Logger.log(this.getName() + '.refresh')

      startLoading()
      await setupDropdownFilterHelper(this.getStoreProperty())

      window.invoke(this.getRefreshEventName()).then((rows) => {
        const storeObj = this.getStoreProperty()
        if (storeObj !== undefined) {
          storeObj.rows = rows
          for (let i = 0; i < storeObj.rows.length; i++) {
            storeObj.rows[i].index = i
            this.forEachRow(i, storeObj.rows[i]) // <<< this method is passed in as a property
          }
        }
      }).finally(() => {
        stopLoading()
      })
    },
    filterMethod () {
      Logger.log(this.getName() + '.filterMethod')

      let filteredRows = []
      const storeObj = this.getStoreProperty()

      if (storeObj !== undefined) {
        console.log(storeObj.toolbarOptions)

        const toolbarOptions = AAToolbarOptions.initFromJsonObj(storeObj.toolbarOptions)
        const rootFilterNode = FilterNode.initRootFilterNode(toolbarOptions)

        filteredRows = storeObj.rows.filter((r) => {
          return rootFilterNode.applyFilter(r, this.getFilterType())
        })
      }

      return filteredRows
    },
    // this implements the default filter method. to use it, derived tables
    // should override filterMethod and call this in the implementation
    defaultFilterMethod () {
      const storeObj = this.getStoreProperty()
      const searchStr = this.getStoreFilter()

      if (searchStr === undefined || searchStr === null || searchStr === '') {
        return storeObj.rows
      } else {
        const searchStrLC = searchStr.toLowerCase()
        return storeObj.rows.filter((row) => {
          for (const col of this.columns) {
            try {
              console.log(searchStrLC, col.field, row[col.field])
              if (col.field !== undefined && row[col.field] !== undefined) {
                const fieldValue = typeof row[col.field] === 'string' ? row[col.field] : row[col.field].toString()
                if (fieldValue.toLowerCase().includes(searchStrLC)) {
                  return true
                }
              }
            } catch (err) {
              // no op
              console.log(err)
            }
          }
          return false
        })
      }
    },
    handleStateChanged (json) {
      Logger.log(this.getName() + '.handleStateChanged')
      dropdownHandleStateChangedHelper(this.getStoreProperty(), json)
    }
  },
  setup () {
    return {
      columns: []
      // editable_columns: []
    }
  },
  data () {
    return {
      store
    }
  },
  beforeMount () {
    Logger.log(this.getName() + '.beforeMount')
    // const storeObj = this.getStoreProperty()
    // if (store.dbLoaded && storeObj !== undefined && !storeObj.loaded.table) {
    this.refresh()
    //   storeObj.loaded.table = true
    // }
  }
}
</script>
