<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left"/>
      <div class="level-right">
        <b-input class="level-item" v-model=query placeholder="filter"></b-input>
        <b-checkbox class="level-item" v-model="highlighting"></b-checkbox>
      </div>
    </div>
    <b-table class="container" :data=machines>
      <template slot-scope="props">
        <b-table-column sortable v-if="match(props.row)"
          field="ID"
          label="ID"
          width="120">
            <div v-highlight="highlightOptions">
              {{props.row.ID}}
            </div>
          </b-table-column>
        <b-table-column sortable v-if="match(props.row)"
          field="Name"
          label="Name"
          width="500">
          <div v-highlight="highlightOptions">
            {{props.row.Name}}
            </div>
        </b-table-column>
        <b-table-column sortable v-if="match(props.row)"
          field="OSName"
          label="OS"
          width="100">
          <div v-highlight="highlightOptions">
            {{props.row.OSName}}
            </div>
        </b-table-column>
        <b-table-column sortable v-if="match(props.row)"
          field="MaximumCount"
          label="Maximum Count"
          width="100">
            {{props.row.MaximumCount}}
        </b-table-column>
        <b-table-column v-if="match(props.row)"
          field="Enabled"
          label="Enabled"
          width="100">
            <b-icon
              id="enabled-icon"
              v-if="props.row.Enabled"
              pack="fas"
              icon="check-circle"
              size="is-small">
            </b-icon>
            <b-icon v-else
              id="disabled-icon"
              pack="fas"
              icon="times-circle"
              size="is-small">
            </b-icon>
        </b-table-column>
        <b-table-column v-if="match(props.row)"
          field="Description"
          label="Description"
          width="500">
            <MachineDescription :description="props.row.InstalledSoftware" :query="query"/>
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
      this.loading = true
      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          this.machines = response.data.pools
          console.log(this.machines)
        })
        .catch(error => {
          console.log(error)
        })
    },
    match (row) {
      if(this.query.length < 3) return true
      var re = RegExp(this.query, 'i')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const field = row[key]
          if (field.toString().match(re)) return true
        }
      }
      return false
    }
  },
  data () {
    return {
      machines: [],
      query: '',
      loading: false,
      highlighting: true
    }
  },
  computed: {
    highlightOptions() {
      return (this.query.length >= 3 && this.highlighting) ? {keyword: this.query, sensitive: false, overWriteStyle: {backgroundColor: 'indianred', color: 'white'}} : null
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  filters: {
    highlight: function (value, query) {
      var re = RegExp(query, 'i')
      var result = value.toString().replace(re, function (matchedText, a, b) {
        if (matchedText !== '') {
          var res = '<span class="highlight has-background-success">' + matchedText + '</span>'
          return res
        } else return ''
      })
      return result
    }
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
.highlight{
  padding: 3px 0px;
  border-color:hsl(141, 71%, 48%);
  border-style: solid;
  border-width: 0px 2px 0px 2px;
  margin: 0px -2px 0px -2px;
}
</style>
