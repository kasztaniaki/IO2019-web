<template>
  <div>
    <div class="level">
      <div class="level-right">
        <b-input class="level-item" v-model="text" @keydown.enter.native="filterPools" placeholder="Search"></b-input>
        <b-button class="level-item" @click.native="clearFilter" >Clear</b-button>
      </div>
    </div>
    <b-table class="container" :data=reservations :loading="isLoading">
      <template slot-scope="props">
        <b-table-column
          label="Mon">
            <ReservationCard v-if="isWeekday(props.row,1)"/>
          </b-table-column>
        <b-table-column
          label="Tue">
            <ReservationCard v-if="isWeekday(props.row,2)"/>
          </b-table-column>
        <b-table-column
          label="Wed">
            <ReservationCard v-if="isWeekday(props.row,3)"/>
          </b-table-column>
        <b-table-column
          label="Thu">
            <ReservationCard v-if="isWeekday(props.row,4)"/>
          </b-table-column>
        <b-table-column
          label="Fri">
            <ReservationCard v-if="isWeekday(props.row,5)"/>
          </b-table-column>
        <b-table-column
          label="Sat">
            <ReservationCard v-if="isWeekday(props.row,6)"/>
          </b-table-column>
        <b-table-column
          label="Sun">
            <ReservationCard v-if="isWeekday(props.row,7)"/>
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
// import { loadReservationsReq } from '@/api'
import ReservationCard from '@/components/ReservationCard.vue'

export default {
  methods: {
    loadReservations () {
      let weekdays = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ]
      for (const res of this.reservations) {
        res.StartDate = parseInt(res.StartDate)
        res.EndDate = parseInt(res.EndDate)

        var weekday = new Date(res.StartDate).getUTCDay()
        weekdays[weekday-1].push(res)
        
      }
      let slots = []
      let inserted = true
      let j = 0
      while(inserted){
        inserted = false
        let row = {}
        for(let i = 0; i < 7; i++){
          if(weekdays[i].length > j){
            row[i.toString()]=weekdays[i][j]
            inserted = true
          }
        }
        if (inserted) slots.push(row)
        j+=1
      }

      console.log(slots);
      
      
      this.reservations = slots

    //   this.isLoading = true
    //   loadReservationsReq()
    //     .then(response => {
    //       this.isLoading = false
    //       this.reservations = response.data.reservations
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    },
    isWeekday(date,weekday) {
      // console.log(weekday);
      // console.log(date);
      
      return new Date(date).getUTCDay()==weekday
      
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
      this.query = ''
      this.text = ''
    }
  },
  data () {
    return {
      slots: [

      ],
      reservations: [
        {
          Name: 'Jacek',
          Surname: 'Dajda',
          UserID: '1',

          PoolName: 'Green Lights 4 Girls',
          PoolID: 's7n-girls',

          StartDate: '1558512000000',
          EndDate: '1558515600000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Michał',
          Surname: 'Idzik',
          UserID: '2',

          PoolName: 'Gramatyki grafowe',
          PoolID: 's7n-gram',

          StartDate: '1558522800000',
          EndDate: '1558526400000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Jolanta',
          Surname: 'Konieczna',
          UserID: '3',

          PoolName: 'Programowanie aplikacji z baza danych',
          PoolID: 's7n-dbprog',

          StartDate: '1558598400000',
          EndDate: '1558602000000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Łukasz',
          Surname: 'Zając',
          UserID: '4',

          PoolName: 'Technologie Aplikacji Internetowych',
          PoolID: 's7n-tai-auto',

          StartDate: '1559116800000',
          EndDate: '1559120400000',
          Count: 13,
          Cancelled: false
        }
      ],
      dateOptions: { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' },
      timeOptions: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
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
    this.loadReservations()
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
.tags, .tag {
    margin-bottom: 0px !important;
}
</style>
