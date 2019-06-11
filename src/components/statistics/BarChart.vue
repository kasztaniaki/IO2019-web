
<script>
import { HorizontalBar, mixins } from 'vue-chartjs'
export default {
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  data () {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            barPercentage: 0.8,
            maxBarThickness: 40,
            minBarLength: 2
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
    chartData: {
      handler: function () {
        this.$data._chart.update()
      },
      deep: true
    }
  }
}
</script>
