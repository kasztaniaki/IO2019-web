<template>
  <b-table :data="data.machines" :columns="columnss">
    <template slot-scope="props">
      <b-table-column field="poolID" label="ID">{{props.row.poolID}}</b-table-column>
      <b-table-column field="displayName" label="Name">{{props.row.displayName}}</b-table-column>
      <b-table-column field="operatingSystem" label="OS">{{props.row.operatingSystem}}</b-table-column>
      <b-table-column field="maximumCount" label="Maximum Count">{{props.row.maximumCount}}</b-table-column>
      <b-table-column field="enabled" label="Enabled">
        <b-icon
          id="enabled-icon"
          v-if="props.row.enabled"
          pack="fas"
          icon="check-circle"
          size="is-small"
        ></b-icon>
        <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle" size="is-small"></b-icon>
      </b-table-column>
      <b-table-column field="description" label="Description">
        <MachineDescription :description="props.row.description"/>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
export default {
  methods: {
    loadMachinesData () {
      this.data = {
        machines: [
          {
            poolID: 1,
            displayName: 'Mobilne aplikacje webowe',
            operatingSystem: 'Windows 7',
            maximumCount: '2',
            enabled: false,
            description: [
              { name: 'chrome', version: '49.0' },
              { name: 'Firefox', version: '12.0' }
            ]
          },
          {
            poolID: 2,
            displayName: 'Gramatyki grafowe',
            operatingSystem: 'Windows 7',
            maximumCount: '2',
            enabled: true,
            description: []
          },
          {
            poolID: 3,
            displayName: 'Programowanie aplikacji z baza danych',
            operatingSystem: 'Windows 7',
            maximumCount: '2',
            enabled: false,
            description: []
          },
          {
            poolID: 4,
            displayName: 'Technologie Aplikacji Internetowych',
            operatingSystem: 'Windows 7',
            maximumCount: '2',
            enabled: true,
            description: []
          },
          {
            poolID: 5,
            displayName: 'Software Modeling',
            operatingSystem: 'Windows 10',
            maximumCount: '2',
            enabled: true,
            description: []
          }
        ]
      }
    }
  },
  watch: {
    machines: function (oldValue, newValue) {}
  },
  data () {
    return {
      data: [],
      columnss: [
        {
          field: 'poolID',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'displayName',
          label: 'Name'
        },
        {
          field: 'maximumCount',
          label: 'Maximum count',
          width: '40'
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
      ]
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  components: {
    MachineDescription
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