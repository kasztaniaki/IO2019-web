<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left"/>
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="machines" :columns="columns" :loading="loading">
      <template slot-scope="props">
        <b-table-column field="poolID" label="ID">{{props.row.ID}}</b-table-column>
        <b-table-column field="displayName" label="Name">{{props.row.Name}}</b-table-column>
        <b-table-column
          field="operatingSystem"
          label="OS"
        >{{props.row.OSName}} {{props.row.OSVersion}}</b-table-column>
        <b-table-column field="maximumCount" label="Maximum Count">{{props.row.MaximumCount}}</b-table-column>
        <b-table-column field="enabled" label="Enabled">
          <b-icon
            id="enabled-icon"
            v-if="props.row.Enabled"
            pack="fas"
            icon="check-circle"
            size="is-small"
          ></b-icon>
          <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle" size="is-small"></b-icon>
        </b-table-column>
        <b-table-column field="description" label="Description">
          <MachineDescription :description="props.row.InstalledSoftware"/>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
import ImportButton from '@/components/ImportButton.vue'
export default {
  methods: {
    loadMachinesData () {
      this.loading=true
      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          console.log(response.data.pools)

          this.machines = response.data.pools
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    resetDB () {
      this.$http
        .get('http://127.0.0.1:5000/init_db')
        .then(response => {
          this.$toast.open({
            message: `Db reset`,
            position: 'is-bottom',
            type: 'is-success'
          })
        })
        .catch(error => {
          if (error) {
            this.$toast.open({
              message: `db reset error`,
              position: 'is-bottom',
              type: 'is-success'
            })
          }
        })
    }
  },
  watch: {
    machines: function (oldValue, newValue) {}
  },
  data () {
    return {
      machines: [],
      columns: [
        {
          field: 'poolID',
          label: 'ID',
          width: '40'
        },
        {
          field: 'displayName',
          label: 'Name'
        },
        {
          field: 'maximumCount',
          label: 'Maximum count'
        },
        {
          field: 'enabled',
          label: 'Enabled',
          centered: true
        },
        {
          field: 'description',
          label: 'Description'
        }
      ],
      loading: false
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  components: {
    MachineDescription,
    ImportButton
  }
}
</script>

<style lang="scss">
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
