
<script>
import { HorizontalBar, mixins } from 'vue-chartjs'
import * as Datalabels from 'chartjs-plugin-datalabels'

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
            maxBarThickness: 50,
            minBarLength: 50,
            gridLines: {
              lineWidth: 0,
              drawTicks: false
            },
            ticks: {
              fontSize: 18,
              fontStyle: 'bold',
              padding: 15
            }
          }],
          xAxes: [{
            barPercentage: 0.9,
            minBarLength: 5
          }]
        },
        plugins: {
          datalabels: {
            color: '#36A2EB',
            anchor: 'end',
            align: 'right',
            font: {
              weight: 'bold',
              size: 15
            }
          }
        },
        events: ['click'],
        onclick (click) {
          console.log(click)
        }
      }
    }
  },
  mounted () {
    this.addPlugin(Datalabels)
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
