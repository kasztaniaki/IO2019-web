<template>
  <div>
    <div class="columns">
      <div class="column is-5">
        <div class="level">
          <b-button class="level-item my-button"
                icon-left="chevron-left"
                @click="dateChange(-1)" ></b-button>
              <div class="level-item" v-if="startTime">
                {{timeRangeString}}
              </div>
              <b-button class="level-item my-button"
                icon-left="chevron-right"
                @click="dateChange(1)" ></b-button>
        </div>
      </div>
      <div class="column">
        <b-field>
          <b-radio-button
            v-model="timeRange"
            native-value='week'
            >
            Week
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='month'
            >
            Month
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='year'
            >
            Year
          </b-radio-button>
        </b-field>
      </div>
    </div>
    <BarChartWrap
      ref="chart1"
      @hey='loadData(0)'
      :loading='charts[0].loading'
      :tooltip='charts[0].tooltip'
      :chartTitle='charts[0].title'
      :number.sync="chartNumbers[0]"
      :labels='charts[0].labels'
      :dataPoints='charts[0].data' />
    <BarChartWrap
      ref="chart2"
      @hey='loadData(1)'
      :loading='charts[1].loading'
      :tooltip='charts[1].tooltip'
      :chartTitle='charts[1].title'
      :number.sync="chartNumbers[1]"
      :labels='charts[1].labels'
      :dataPoints='charts[1].data'
      />
    <BarChartWrap
      ref="chart3"
      @hey='loadData(2)'
      :loading='charts[2].loading'
      :tooltip='charts[2].tooltip'
      :chartTitle='charts[2].title'
      :number.sync="chartNumbers[2]"
      :threshold.sync="threshold"
      :labels='charts[2].labels'
      :dataPoints='charts[2].data'
      />
    <BarChartWrap
      ref="chart4"
      @hey='loadData(3)'
      :loading='charts[3].loading'
      :tooltip='charts[3].tooltip'
      :chartTitle='charts[3].title'
      :number.sync="chartNumbers[3]"
      :labels='charts[3].labels'
      :dataPoints='charts[3].data'
      />
  </div>
</template>

<script>
import BarChartWrap from '@/components/statistics/BarChartWrap.vue'
import { getPopularPoolsReq, getPopularUsersReq, getBottleneckedPoolsReq, getUnusedPoolsReq } from '@/api'

export default {
  data () {
    return {
      pools: [
        'Gramatyki',
        'Programowanie aplikacji z baza danych',
        'Systemy ekspertowe i sztuczna inteligencja'
      ],
      stats: [
        133, 242, 17
      ],
      timeRange: 'week',
      startTime: null,
      endTime: null,
      isLoading: false,
      chartNumbers: [5, 5, 5, 5],
      threshold: 0.8,
      charts: [
        {
          title: 'Popular Pools',
          tooltip: 'Hours * machine count for reservation',
          labels: [],
          data: [],
          loading: false,
          getter: getPopularPoolsReq
        },
        {
          title: 'Popular Users',
          tooltip: 'Hours * machine count for reservation',
          labels: [],
          data: [],
          loading: false,
          getter: getPopularUsersReq
        },
        {
          title: 'Bottlenecked Pools',
          tooltip: 'Number of hours in bottlenecked state (more than [Threshold] machines in use at a given moment)',
          labels: [],
          data: [],
          loading: false,
          getter: getBottleneckedPoolsReq
        },
        {
          title: 'Unused Pools',
          tooltip: 'Lowest peak percent of machines in use for a given pool',
          labels: [],
          data: [],
          loading: false,
          getter: getUnusedPoolsReq
        }
      ]
    }
  },
  computed: {
    timeRangeString () {
      switch (this.timeRange) {
        case 'week':
          return this.startTime.toLocaleString('pl-PL', { year: 'numeric', month: 'numeric', day: 'numeric' }) + ' - ' +
          this.endTime.toLocaleString('pl-PL', { year: 'numeric', month: 'numeric', day: 'numeric' })
        case 'month':
          return this.startTime.toLocaleString('pl-PL', { year: 'numeric', month: 'long' })
        case 'year':
          return this.startTime.toLocaleString('pl-PL', { year: 'numeric' })
        default:
          return ''
      }
    },
    arguments () {
      return [
        [
          this.startTime,
          this.endTime,
          this.chartNumbers[0]
        ],
        [
          this.startTime,
          this.endTime,
          this.chartNumbers[1]
        ],
        [
          this.startTime,
          this.endTime,
          this.chartNumbers[2],
          this.threshold
        ],
        [
          this.startTime,
          this.endTime,
          this.chartNumbers[3]
        ]
      ]
    }
  },
  methods: {
    loadData (chartIndex) {
      var chart = this.charts[chartIndex]
      chart.loading = true
      chart.getter(...this.arguments[chartIndex])
        .then(response => {
          chart.data = response.data.data
          var labels = []
          for (const label of response.data.labels) {
            labels.push(label.display)
          }
          chart.labels = labels
          chart.loading = false
        })
    },
    loadAll () {
      this.loadData(0)
      this.loadData(1)
      this.loadData(2)
      this.loadData(3)
    },
    chartData (dataLabels, dataPoints, label) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, label: label, data: dataPoints }] }
    },
    dateChange (offset) {
      switch (this.timeRange) {
        case 'week':
          this.startTime = new Date(this.startTime.setDate(this.startTime.getDate() + offset * 7))
          this.endTime = new Date(this.endTime.setDate(this.endTime.getDate() + offset * 7))
          break

        case 'month':
          this.startTime = new Date(this.startTime.setMonth(this.startTime.getMonth() + offset))
          this.endTime = new Date(this.endTime.setMonth(this.endTime.getMonth() + offset))
          break

        case 'year':
          this.startTime = new Date(this.startTime.setFullYear(this.startTime.getFullYear() + offset))
          this.endTime = new Date(this.endTime.setFullYear(this.endTime.getFullYear() + offset))
          break
        default:
          break
      }
    },
    setTime (range) {
      switch (range) {
        case 'week':
          var d = new Date()
          var day = d.getDay()
          var diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
          d.setHours(0, 0, 0, 0)

          this.startTime = new Date(d.setDate(diff))
          this.endTime = new Date(d.setDate(diff + 7))
          break

        case 'month':
          var now = new Date()
          var month = new Date(now.getFullYear(),
            now.getMonth(),
            1, 0, 0, 0, 0)
          var monthStart = new Date(month + 1)
          var monthEnd = new Date(month.setMonth(month.getMonth() + 1))

          this.startTime = monthStart
          this.endTime = monthEnd
          break

        case 'year':
          var now2 = new Date()
          var year = new Date(now2.getFullYear(),
            0, 1, 0, 0, 0, 0)
          var yearStart = new Date(year)
          var yearEnd = new Date(year.setFullYear(year.getFullYear() + 1))

          this.startTime = yearStart
          this.endTime = yearEnd
          break
        default:
          break
      }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    }
  },
  watch: {
    timeRange: function (value) {
      this.setTime(value)
    },
    chartNumbers: {
      handler: function (oldValue, newValue) {
        // if (oldValue !== null && newValue !== null) this.loadAll()
      },
      deep: true
    },

    startTime: function (oldValue, newValue) {
      if (oldValue !== null && newValue !== null) this.loadAll()
    },

    threshold: function (oldValue, newValue) {
      if (oldValue !== null && newValue !== null) this.loadData(2)
    }
  },
  mounted () {
    this.setTime('week')
    this.loadAll()
    // this.loadData(3)
  },
  components: {
    BarChartWrap
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.my-button {
  border-color: transparent !important;
}
</style>
