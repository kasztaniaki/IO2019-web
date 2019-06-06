<template>
  <div>
    <div class="columns">
        <div class="column is-4">
          <div class="level">
            <b-button class="level-item my-button"
              icon-left="chevron-left"
              @click.native="weekChange(-1)" ></b-button>
            <div v-if="weekstart" class="level-item">
              {{this.weekstart.toLocaleString('pl-PL', dateOptions)}} - {{this.weekend.toLocaleString('pl-PL', dateOptions)}}
            </div>
            <b-button class="level-item my-button"
              icon-left="chevron-right"
              @click.native="weekChange(1)" ></b-button>
          </div>
        </div>
        <div class="column">
          <b-button :class="(onlyUserInSelected($store.getters.getUserData.email)) ? 'is-primary' : 'is-default'"
            @click="showOnlyUser($store.getters.getUserData.email)">
            Show only mine
          </b-button>
        </div>
        <b-taginput class="column"
          v-model="selectedPools"
          :data="filteredPools"
          autocomplete
          field="Name"
          placeholder="Filter by pool"
          closable
          expanded
          open-on-focus
          @typing="getFilteredPools">
        </b-taginput>
        <b-taginput class="column"
          v-model="selectedUsers"
          :data="filteredUsers"
          autocomplete
          field="Email"
          placeholder="Filter by user"
          closable
          expanded
          open-on-focus
          @typing="getFilteredUsers">
          <template slot-scope="props">
            {{props.option.Name}} {{props.option.Surname}}
          </template>
        </b-taginput>
    </div>
    <b-table class="container reservation-table" :data=reservations :loading="isLoading">
      <template slot-scope="props">
        <b-table-column
          label="Mon"
          style="width: 14.28%">
            <ReservationCard @edit="loadReservations()"
              @user="(Email) => toggleUserSelected(Email)"
              @pool="(id) => togglePoolSelected(id)"
              :reservationData="props.row.mon"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.mon,1)"/>
          </b-table-column>
        <b-table-column
          label="Tue"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @user="(Email) => toggleUserSelected(Email)"
              @pool="(id) => togglePoolSelected(id)"
              :reservationData="props.row.tue"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.tue,2)"/>
          </b-table-column>
        <b-table-column
          label="Wed"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @user="(Email) => toggleUserSelected(Email)"
              @pool="(id) => togglePoolSelected(id)"
              :reservationData="props.row.wed"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.wed,3)"/>
          </b-table-column>
        <b-table-column
          label="Thu"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @pool="(id) => togglePoolSelected(id)"
              @user="(Email) => toggleUserSelected(Email)"
              :reservationData="props.row.thu"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.thu,4)"/>
          </b-table-column>
        <b-table-column
          label="Fri"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @pool="(id) => togglePoolSelected(id)"
              @user="(Email) => toggleUserSelected(Email)"
              :reservationData="props.row.fri"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.fri,5)"/>
          </b-table-column>
        <b-table-column
          label="Sat"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @user="(Email) => toggleUserSelected(Email)"
              @pool="(id) => togglePoolSelected(id)"
              :reservationData="props.row.sat"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.sat,6)"/>
          </b-table-column>
        <b-table-column
          label="Sun"
          style="width:14.28%">
            <ReservationCard @edit="loadReservations()"
              @pool="(id) => togglePoolSelected(id)"
              @user="(Email) => toggleUserSelected(Email)"
              :reservationData="props.row.sun"
              :selectedUsers.sync="selectedUsers"
              :selectedPools.sync="selectedPools"
              v-if="filterReservations(props.row.sun,0)"/>
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import { loadPoolsReq, loadUsersReq, loadReservationsReq } from '@/api'
import ReservationCard from '@/components/ReservationCard.vue'

export default {
  methods: {
    loadReservations (startDate, endDate, showCancelled) {
      this.isLoading = true
      loadReservationsReq(startDate, endDate, showCancelled)
        .then(response => {
          this.reservations = this.processResponse(response)
          this.isLoading = false
        })
        .catch(error => {
          if (error) {
            console.log(error)
          }
        })
    },
    processResponse (response) {
      var reservations = this.sortReservations(response.data.reservation)
      let weekdays = [ [], [], [], [], [], [], [] ]
      var names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      for (const res of reservations) {
        res.StartDate = new Date(res.StartDate)
        res.EndDate = new Date(res.EndDate)
        var weekday = new Date(res.StartDate).getUTCDay()
        weekdays[(weekday + 7 - 1) % 7].push(res)
      }
      let slots = []
      let inserted = true
      let j = 0
      while (inserted) {
        inserted = false
        let slot = {}
        for (let i = 0; i < 7; i++) {
          if (weekdays[i].length > j) {
            slot[names[i]] = weekdays[i][j]
            inserted = true
          }
        }
        if (inserted) slots.push(slot)
        j += 1
      }
      return slots
    },
    sortReservations (reservations) {
      return reservations.sort(function (a, b) {
        return new Date(a.StartDate) - new Date(b.StartDate)
      })
    },
    filterReservations (res, weekday) {
      return this.isWeekday(res, weekday) && this.filterPools(res) && this.filterUsers(res)
    },
    isWeekday (res, weekday) {
      if (res) {
        var isThisWeek = new Date(res.StartDate) > new Date(this.weekstart) && new Date(res.StartDate) < new Date(this.weekend)
        return new Date(res.StartDate).getUTCDay() === weekday && isThisWeek
      }
    },
    getFilteredPools (text) {
      this.filteredPools = this.pools.filter((pool) => {
        return (text === '' || pool.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0)
      })
    },
    getFilteredUsers (text) {
      this.filteredUsers = this.users.filter((user) => {
        return (text === '' || (user.Name + ' ' + user.Surname).toLowerCase().indexOf(text.toLowerCase()) >= 0)
      })
    },
    filterPools (res) {
      if (this.selectedPools && this.selectedPools.length > 0) {
        return this.selectedPools.filter(pool => { return pool.ID === res.PoolID }).length > 0
      } else return true
    },
    filterUsers (res) {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        return this.selectedUsers.filter(user => { return user.Email === res.UserEmail }).length > 0
      } else return true
    },
    toggleUserSelected (Email) {
      let userToToggle = this.users.find(user => user.Email === Email)
      if (!this.selectedUsers.includes(userToToggle)) this.selectedUsers.push(userToToggle)
      else {
        let index = this.selectedUsers.findIndex((element) => element === userToToggle)
        this.selectedUsers.splice(index, 1)
      }
    },
    togglePoolSelected (id) {
      let poolToToggle = this.pools.find(pool => pool.ID === id)
      if (!this.selectedPools.includes(poolToToggle)) this.selectedPools.push(poolToToggle)
      else {
        let index = this.selectedPools.findIndex((element) => element === poolToToggle)
        this.selectedPools.splice(index, 1)
      }
    },
    weekChange (diff) {
      diff = diff * 7
      this.weekstart = new Date(this.weekstart.setDate(this.weekstart.getDate() + diff))
      this.weekend = new Date(this.weekend.setDate(this.weekend.getDate() + diff))
      this.loadReservations(this.weekstart, this.weekend, false)
    },
    loadPools () { // todo error handling
      loadPoolsReq()
        .then(response => {
          this.pools = response.data.pools
          this.getFilteredPools('')
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadUsers () { // todo error handling
      loadUsersReq()
        .then(response => {
          this.users = response.data.users
          this.getFilteredUsers('')
        })
        .catch(error => {
          console.log(error)
        })
    },
    onlyUserInSelected (email) {
      return this.selectedUsers.filter(user => { return user.Email === email }).length === 1 && this.selectedUsers.length === 1
    },
    showOnlyUser (email) {
      if (this.onlyUserInSelected(email)) {
        this.selectedUsers = []
      } else this.selectedUsers = this.users.filter(user => { return user.Email === email })
    }
  },
  mounted () {
    var d = new Date()
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    d.setHours(0, 0, 0, 0)
    this.weekstart = new Date(d.setDate(diff))
    this.weekend = new Date(d.setDate(diff + 7))

    this.loadReservations(this.weekstart, this.weekend, false)
    this.loadPools()
    this.loadUsers()
  },
  data () {
    return {
      slots: [],
      isLoading: false,
      weekstart: null,
      weekend: null,
      dateOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
      pools: [],
      users: [],
      selectedPools: [],
      selectedUsers: [],
      filteredPools: [],
      filteredUsers: [],
      reservations: []
    }
  },
  components: {
    ReservationCard
  },
  props: {
    editable: {
      type: Boolean
    }
  }

}
</script>

<style lang="scss" scoped>
  .my-button {
    border-color: transparent !important;
  }
  td {
  border: 0px !important;
  padding: 2px !important;
}
</style>
