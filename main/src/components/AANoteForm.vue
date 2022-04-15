<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-sm">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <span class="text-h6">New Note</span>
      </q-card-section>
      <q-card-section>
        <q-editor v-model="note" min-height="10rem" autofocus/>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="warning" text-color="black" label="Cancel" @click="onCancelClick" />
        <q-btn color="warning" text-color="black" label="OK" @click="onOKClick(this.note)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped>
.q-editor
  border-color: $main-toolbar-text-icon
  background: lighten($main-toolbar-background,5%)
  color: $main-toolbar-text-icon
.q-editor__toolbar
  border-color: $main-toolbar-text-icon

.q-dialog-plugin
  background: lighten($main-toolbar-background,5%)
  color: $main-toolbar-text-icon
</style>

<script>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],

  setup () {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      note: ref(''),
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick (note) {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK({ note })
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel
    }
  }
}
</script>
