<template>
  <div>
    <div class="level">
      <div class="level-left">
        <ImportButton v-on:import="loadMachinesData()" class="level-item" :disabled="isLoading"/>
        <b-button v-if="editable" class="level-item" icon-left="plus" type="is-success" :disabled="isLoading" @click.native="showPoolForm()">New pool</b-button>
      </div>
      <div class="level-right">
        <b-input class="level-item" v-model="text" @keydown.enter.native="filterPools" placeholder="Search"></b-input>
        <b-button class="level-item" @click.native="clearFilter" >Clear</b-button>
        <b-button @click="resetDB()">
        db reset
        </b-button>
      </div>
    </div>
    <b-table class="container" :data=machines :loading="isLoading">
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
            <MachineDescription :description="props.row.InstalledSoftware" :query="query" :highlightOptions="highlightOptions"/>
        </b-table-column>
        <b-table-column v-if="match(props.row)" field="edit" :visible="editable">
          <b-button icon-left="edit" type="is-light" @click.native="showPoolForm(props.row.ID, props.row)"></b-button>
        </b-table-column>
        <b-table-column v-if="match(props.row)" field="remove" :visible="editable">
          <b-button icon-left="trash" type="is-danger" @click.native="confirmPoolDelete(props.row.ID)">
          </b-button>
        </b-table-column>
        <b-button @click.native="showReservationForm(props.row.ID, props.row.MaximumCount)">Reserve</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
import ImportButton from '@/components/ImportButton.vue'
import EditPoolForm from '@/components/EditPoolForm.vue'
import SingleReservationForm from '@/components/SingleReservationForm.vue'
import { loadPoolsReq, addPoolReq, editPoolReq, removePoolReq, resetDBReq } from '@/api'

export default {
  methods: {
    loadMachinesData () {
      this.isLoading = true
      loadPoolsReq()
        .then(response => {
          this.isLoading = false
          this.machines = response.data.pools
        })
        .catch(error => {
          console.log(error)
        })
    },
    match (row) {
      if (this.query.length < 3) return true
      var re = RegExp(this.query, 'i')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const field = row[key]
          if (field.toString().match(re)) return true
        }
      }
      return false
    },
    filterPools () {
      this.query = this.text
    },
    clearFilter () {
      console.log('halko')

      this.query = ''
      this.text = ''
    },
    showPoolForm (poolId = '', poolProps = {}) {
      this.$modal.open({
        parent: this,
        component: EditPoolForm,
        hasModalCard: true,
        props: poolProps,
        events: {
          'poolRequest': (poolProps) => {
            if (poolId !== '') {
              this.editPool(poolId, poolProps)
            } else {
              this.addPool(poolProps)
            }
          }
        }
      })
    },
    confirmPoolDelete (poolId) {
      this.$dialog.confirm({
        title: 'Deleting pool',
        message: `Are you sure you want to <b>delete</b> pool ${poolId}? This action cannot be undone.`,
        confirmText: 'Delete Pool',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.removePool(poolId)
      })
    },
    addPool (poolProps) {
      addPoolReq(poolProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool added successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
    editPool (poolId, poolProps) {
      console.log(poolProps)
      editPoolReq(poolId, poolProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool edited successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
    removePool (poolId) {
      removePoolReq(poolId).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool removed successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
    resetDB () {
      resetDBReq().then(response => {
        this.$toast.open({
          message: `Db reset`,
          position: 'is-bottom',
          type: 'is-success'
        })
        loadMachinesData()
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
    },
    showReservationForm (poolID, poolMaxCount) {
      const reservationProps = {
        poolID,
        poolMaxCount
      }

      this.$modal.open({
        parent: this,
        props: reservationProps,
        component: SingleReservationForm,
        hasModalCard: true,
        events: {
          'saveReservation': (reservationProps) => {
            console.log(reservationProps)
          }
        }
      })
    }
  },
  data () {
    return {
      machines: [],
      isLoading: false,
      text: '',
      query: '',
      highlighting: true
    }
  },
  computed: {
    highlightOptions () {
      return { keyword: this.query, sensitive: false, overWriteStyle: { backgroundColor: 'indianred', color: 'white' } }
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
    ImportButton,
    // eslint-disable-next-line
    EditPoolForm
  },
  props: {
    editable: {
      type: Boolean
    }
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
