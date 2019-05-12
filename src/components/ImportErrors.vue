<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Errors</p>
        </header>
        <section class="modal-card-body">
            <b-table :data="errors"
                    :row-class="(row,index) => row.error" :selected.sync="selected">
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
    errors: Array
  },
  filters: {
    overflow: function (value, selected) {
      console.log('halooo' + value.length)

      if (!value) return ''
      if (value.toString().length > 100 && !selected) {
        return value.toString().substring(0, 100) + '...'
      } else return value
    }
  },
  methods: {
    forceImport() {
        this.$parent.$parent.sendRequest(true);
        this.$parent.close();
    }
  },
  data () {
    return {
      selected: this.errors[1]
    }
  }
}
</script>

<style>
    tr.warning {
        background: #ffdd57;
        color: black;
    }
    tr.error {
        background: #ff3860;
        color: black;
    }
</style>
