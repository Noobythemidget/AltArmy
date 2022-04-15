<template>
  <div>
    <q-table
      ref="baseNotesable"
      class="sticky-virtscroll-notes-table plugin-data-view base-notes-table"
      :rows-per-page-options="[10]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      :loading-label="getLoadingLabel()"
      :no-results-label="getNoResultsLabel()"
      v-model:columns="columns"
      v-model:rows="rows"
      @refresh="refresh"
      :filter="search"
      >

      <template v-slot:top>

        <q-toolbar class="table-toolbar">
          <q-icon name="notes" size="lg"></q-icon>
          <q-toolbar-title class="table-toolbar-title">{{ title }}</q-toolbar-title>
          <q-space></q-space>
          <q-input
            class="col-3 table-toolbar-input"
            label="Search"
            icon="search"
            rounded
            outlined
            dense
            clearable
            v-model="search"
            autogrow
            type="search"
          >
                  <!-- @update:model-value="handleStateChanged($event)" -->
                  <!-- <AATooltip :html="searchTooltip"></AATooltip> -->
          </q-input>
          <!-- <q-icon name="search" color="white" size="sm" /> -->
        </q-toolbar>

      </template>

      <template v-slot:header="props">
        <q-tr :props="props" class="base-table-header">
          <q-th style="width: 25px;">
            <q-btn icon="playlist_add" size="md" flat @click="addNote()"><AATooltip text="Add a new note"></AATooltip></q-btn>
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" class="base-notes-table-body-row">
          <q-td auto-width>

            <span v-if="props.row.note">
              <q-btn
                class="table-btn-expand"
                size="sm"
                round
                dense
                flat
                icon="delete"
                @click="confirm = true"
              />
            </span>

            <span>
              <q-dialog v-model="confirm" persistent>
                <q-card class="delete-dialog">
                  <q-card-section class="row items-center">
                    <q-avatar icon="delete" class="delete-avatar" />
                    <span class="q-ml-sm">Are you sure you want to delete this note?</span>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" class="dialog-button" v-close-popup />
                    <q-btn flat label="Delete" class="dialog-button" @click="deleteNote(props)" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </span>

          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props" >
            <div v-if="col.name == 'note'">
              <span v-html="col.value"></span>
              <q-popup-edit v-model="props.row[col.name]"
                            :title="'Update '+col.label"
                            buttons
                            v-slot="scope"
                            dense
                            anchor="top left"
                            class="notes-popup-edit"
                            label-set="OK"
                            @save="(value, initialValue) => {editNote(props.row, col, value, initialValue)}">
                <q-editor v-model="scope.value" autofocus></q-editor>
              </q-popup-edit>
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

  </div>
</template>
<style lang="sass">
.sticky-virtscroll-notes-table
  /* height or max-height is important */
  max-height: 50vh
  min-height: 50vh
  height: 50vh
  border-radius: $sub-table-border-radius  // rounded corner

  .q-table__top
    height: 65px

    // .q-table__top,
  // .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background: $sub-table-head-foot-background     // top and bottom of the table background color
    color: $sub-table-head-foot-text-icon           // label color in the header/footer

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

.q-table__middle
  // background: lighten($mainbg, 40%)     // default background when no rows
  .q-table
    tbody
      .base-notes-table-body-row:nth-child(2n+1)  // odd rows
        background: $sub-table-row-background-odd
        color: $sub-table-row-text-odd
      .base-notes-table-body-row:nth-child(2n)  // even rows
        background: $sub-table-row-background-even
        color: $sub-table-row-text-even

// this is for the 'Search' label inside the text area
.table-toolbar-input
  .q-field__inner
    .q-field__control
      .q-field__control-container
        .q-placeholder
          color: $top-table-head-foot-text-icon !important
        // .q-field__label,
      .q-field__append
        color: $top-table-head-foot-text-icon

// delete note dialog
.dialog-button
  background: $negative
  color: $top-table-head-foot-text-icon

.delete-dialog
  background: $main-toolbar-background
  color: $top-table-head-foot-text-icon
  .q-card-section
    .q-avatar
      background: $top-table-head-foot-text-icon

.delete-avatar
  background: $negative
  color: $top-table-head-foot-text-icon

.notes-popup-edit //.q-popup-edit
  width: 400px !important
  min-width: 400px !important
  max-width: 400px !important
  background: lighten($main-toolbar-background, 6%)
  color: $top-table-head-foot-text-icon
  .q-editor
    border-color: $top-table-head-foot-text-icon
    background: lighten($main-toolbar-background, 5%)
  .q-popup-edit__buttons
    .q-btn--rectangle
      color: black !important
      background: $top-table-head-foot-text-icon !important
</style>

<script>
import { ref } from 'vue'
import { Dialog } from 'quasar'

import { startLoading, stopLoading } from 'assets/js/util.js'
// import { store } from 'assets/js/store.js'
import { Logger } from 'assets/js/logger.js'

import AANoteForm from 'components/AANoteForm.vue'
import AATooltip from 'components/AATooltip.vue'

export default {
  components: {
    AATooltip
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Notes'
    },
    icon: {
      type: String,
      required: false
    },
    foreignKeys: {
      // an array of foreign keys that links the note row to the accounts or characters table
      // for account_notes it will be [account_id]
      // for character_notes it will be [character_name, account, server]
      type: Array,
      required: true
    }
  },
  methods: {
    getName () {
      return 'AABaseNotesTable'
    },
    getLoadingLabel () {
      return 'Loading data...' // Loading character data...
    },
    getNoResultsLabel () {
      return 'No matches.' // No characters matched.
    },
    getRefreshEventName () {
      return '' // 'get-all-characters'
    },
    getAddNoteEventName () {
      return '' // add-account-note
    },
    getUpdateNoteEventName () {
      return '' // update-account-note
    },
    getDeleteNoteEventName () {
      return '' // delete-account-note
    },
    // separating the main implementation of the refresh statement because I don't always want to invoke the event
    refreshBody (result) {
      console.log('refreshBody: ' + result)
      this.rows = result
      let i = 0
      this.rows.forEach(e => { e.index = i++ })
    },
    async refresh () {
      Logger.log(this.getName() + '.refresh')

      startLoading()
      window.invoke(this.getRefreshEventName(), this.foreignKeys).then((result) => {
        this.refreshBody(result)
      }).finally(() => {
        stopLoading()
      })
    },
    addNote () {
      Dialog.create({ component: AANoteForm }).onOk((data) => {
        window.invoke(this.getAddNoteEventName(), data.note, this.foreignKeys).then((result) => {
          this.refreshBody(result)
        })
      }).onCancel(() => {
        Logger.log('>>>> Cancel')
      }).onDismiss(() => {
        Logger.log('I am triggered on both OK and Cancel')
      })
    },
    editNote (row, col, value, initialValue) {
      window.invoke(this.getUpdateNoteEventName(), row.id, value, this.foreignKeys).then((result) => {
        this.refreshBody(result)
      })
    },
    deleteNote (props) {
      Logger.log(this.getName() + '.deleteNote', props)
      window.invoke(this.getDeleteNoteEventName(), props.row.id, this.foreignKeys).then((result) => {
        this.confirm = false
        this.refreshBody(result)
      })
    }
  },
  setup () {
    return {
    }
  },
  data () {
    return {
      confirm: ref(false),
      rows: ref([]),
      search: ref(''),
      columns: [
        {
          name: 'timestamp',
          required: true,
          label: 'Timestamp',
          field: 'timestamp',
          align: 'left',
          sortable: true,
          style: 'width: 25px;'
        },
        {
          name: 'note',
          label: 'Note',
          field: 'note',
          align: 'left',
          sortable: true,
          style: 'width: 100%;'
        }
      ]
    }
  },
  beforeMount () {
    Logger.log(this.getName() + '.beforeMount')
    // if (store.dbLoaded) {
    this.refresh()
    // }
  }
}
</script>
