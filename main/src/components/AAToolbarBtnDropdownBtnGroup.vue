<template>
  <q-btn-group class="q-px-lg" rounded>
    <q-btn icon="check_circle" dense @click="$emit('check-all')">
      <AATooltip text="Select All"></AATooltip>
    </q-btn>
    <q-btn icon="swap_horiz" dense @click="$emit('toggle-all')">
      <AATooltip text="Invert Selection"></AATooltip>
    </q-btn>
    <q-btn icon="highlight_off" dense @click="$emit('clear-all')">
      <AATooltip text="Clear All"></AATooltip>
    </q-btn>
  </q-btn-group>
</template>

<style lang="sass" scoped>
.q-btn
  color: $main-toolbar-text-icon
</style>

<script>
import AATooltip from 'components/AATooltip.vue'

export default {
  // name: 'ComponentName',
  components: { AATooltip },
  emits: ['check-all', 'toggle-all', 'clear-all'],
  setup () {
    return {}
  }
}
</script>
