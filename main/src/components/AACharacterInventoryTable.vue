<template>
  <div>
    <q-table
      ref="inventoryQTable"
      class="character-wallet-table plugin-data-view"
      :rows-per-page-options="[50]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      title="Inventory"
      loading-label="Loading inventory data..."
      no-results-label="Inventory is empty."
      v-model:columns="columns"
      v-model:rows="rows"
      :filter="search"
      @refresh="refresh"
    >

      <template v-slot:top>

        <q-toolbar class="table-toolbar">
          <q-icon name="inventory" size="lg"></q-icon>
          <q-toolbar-title class="table-toolbar-title">Inventory</q-toolbar-title>
          <q-space />

          <q-space />
          <q-input
            class="col-3 search-class"
            input-class="table-toolbar-textarea"
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

      <!--
      <template v-slot:header="props">
        <q-tr :props="props" class="base-table-header">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>
      -->

      <template v-slot:body="props">
        <q-tr>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'location'" v-html="col.value"></div>
            <div v-else>{{col.value}}</div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</template>
<style lang="sass">
.my-sticky-virtscroll-table2
  /* height or max-height is important */
  height: 50vh
  // width: 45vw

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
<script>
import { ref } from 'vue'
import { startLoading, stopLoading } from 'assets/js/util.js'
import { Logger } from 'assets/js/logger.js'

export default {
  // name: 'ComponentName',
  props: ['characterName', 'server', 'account'],
  setup () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          field: 'name',
          align: 'left',
          sortable: true,
          style: 'width: 10%;'
        },
        {
          name: 'quantity',
          label: 'Quantity',
          field: 'quantity',
          align: 'left',
          sortable: true,
          style: 'width: 10%;',
          format: (val, row) => val.toLocaleString()
        },
        {
          name: 'location',
          label: 'Locations',
          field: 'location_json',
          align: 'left',
          sortable: true,
          style: 'width: 100%;',
          format: (val, row) => {
            const json = JSON.parse(val)
            let html = '<ul style="list-style: none; padding-left: 0;">'
            if (json['Inventory Bags']) {
              html += '<li>Inventory Bags: ' + parseInt(json['Inventory Bags']).toLocaleString() + '</li>'
            }
            if (json['Vault Storage']) {
              html += '<li>Vault Storage: ' + parseInt(json['Vault Storage']).toLocaleString() + '</li>'
            }
            if (json['Shared Storage']) {
              html += '<li>Shared Storage: ' + parseInt(json['Shared Storage']).toLocaleString() + '</li>'
            }
            html += '</ul>'
            return html
          }
        // },
        // {
        //   name: 'description',
        //   label: 'Description',
        //   field: 'description',
        //   align: 'left',
        //   sortable: true,
        //   style: 'width: 150px; word-wrap: break-word;'
        }
      ],
      rows: ref([]),
      search: ref('')
    }
  },
  methods: {
    htmlLocation (val) {
      const json = JSON.parse(val)
      let html = '<ul>'
      if (json['Inventory Bags']) {
        html += '<li><strong>Inventory Bags:</strong> ' + json['Inventory Bags'] + '</li>'
      }
      if (json['Vault Storage']) {
        html += '<li>Vault Storage: ' + json['Vault Storage'] + '</li>'
      }
      if (json['Shared Storage']) {
        html += '<li>Shared Storage: ' + json['Shared Storage'] + '</li>'
      }
      html += '</ul>'
      return html
    },
    refresh () {
      Logger.log('AACharacterInventoryTable.refresh')
      startLoading()
      window.invoke('get-character-inventory', this.characterName, this.account, this.server).then((result) => {
        console.log(result.details)

        this.rows = result.rows
      }).finally(() => {
        stopLoading()
      })
    }
  }
}
</script>
