<template>
  <q-page class="plugin-data-view view-page">
    <AAAllNotesTable  class="view-page-table"
                      :expandable="false"
                      searchTooltip="Filter Notes"
                      :expandButtonClicked="expandButtonClicked"
                      :forEachRow="forEachRow"
                      title="All Notes"
                      icon="notes">
    </AAAllNotesTable>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import AAAllNotesTable from 'components/AAAllNotesTable.vue'
// import { store } from 'assets/js/store.js'
import { Logger } from 'assets/js/logger.js'

export default {
  name: 'AAAllNotesPage',
  components: {
    AAAllNotesTable
  },
  methods: {
    expandButtonClicked (props) {
      console.log('AAAllNotesPage.expandButtonClicked')
      // this.tree = store.inventory.rows[props.row.index].tree
      // // this.$refs['tree' + props.row.index].expandAll()
      // props.expand = !props.expand
      // // this.$refs.locationView.expandAll()
    },
    forEachRow (index, row) {
      Logger.log('AAAllNotesPage.forEachRow')
      switch (row.source) {
        case 'character_notes':
          // \u21E8 is unicode for an arrow
          row.entity = row.account + ' \u21E8 ' + row.server + ' \u21E8 ' + row.character_name
          break
        case 'account_notes':
          row.entity = row.account
          break
        case 'server_notes':
          row.entity = row.server
          break
      }
    }
  },
  data () {
    return {
      tree: ref([{ label: 'dummy value' }])
    }
  }
}

</script>
