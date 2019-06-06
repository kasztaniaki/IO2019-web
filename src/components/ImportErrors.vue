<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Errors</p>
        </header>
        <section class="modal-card-body">
            <b-table :data="import_errors"
                    :row-class="(row,index) => row.error" :selected.sync="selected" focusable>
                <template slot-scope="props">
                    <b-table-column field="line" label="#">{{props.row.line}}</b-table-column>
                    <b-table-column field="pool" label="Line" width="400">{{props.row.pool | overflow(selected==props.row)}}</b-table-column>
                    <b-table-column field="info" label="Info">{{props.row.info}}</b-table-column>
                </template>
            </b-table>
        </section>
        <footer class="modal-card-foot">
                <b-button @click="forceImport()" class="button is-warning" type="button">Force</b-button>
                <b-button @click="$parent.close()" class="button" type="button">Close</b-button>
        </footer>
    </div>
</template>

<script>
export default {
  props: {
    import_errors: Array
  },
  filters: {
    overflow: function (value, selected) {

      if (!value) return ''
      if (value.toString().length > 100 && !selected) {
        return value.toString().substring(0, 100) + '...'
      } else return value
    }
  },
  methods: {
    forceImport () {
      this.$emit('force')
      this.$emit('close')
    }
  },
  data () {
    return {
      selected: this.import_errors[0]
    }
  }
}
</script>

<style lang="scss">
$warning: hsl(48, 100%, 67%);
$error: hsl(348, 100%, 61%);
    tr.warning {
        background: $warning !important;
        color: black !important;
    }
    tr.error {
        background: $error !important;
        color: black !important;
    }

    tr.warning.is-selected{
        filter: brightness(120%);
        border: 5px solid black !important;
    }
    tr.error.is-selected{
        filter: brightness(120%);
        border: 5px solid black !important;

    }
</style>
