<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns' // date-fns의 format 함수는 계속 사용합니다.
import { formatDateLabel } from '@/utils/dateUtils' // 차트 제목 포맷팅에 필요할 수 있으니 유지

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale, // CategoryScale 유지
  Tooltip,
  Title, // Title 플러그인 등록
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title,
)

const props = defineProps({
  videoId: String,
  mode: String, // 'view' or 'like'
  type: String, // 'recent' or 'daily'
  date: String, // 'YYYY-MM-DD' for daily data (차트 제목용)
  rawData: Array, // APIMissionChartPage에서 전달받는 데이터
})

const canvas = ref(null)
let chartInstance = null

const drawChart = () => {
  if (!props.rawData || props.rawData.length === 0) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    const ctx = canvas.value ? canvas.value.getContext('2d') : null
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.font = '16px Arial'
      ctx.fillStyle = '#888'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('데이터가 없습니다.', canvas.value.width / 2, canvas.value.height / 2)
    }
    return
  }

  // 데이터 정렬: 항상 collectedAt/dateCreated를 기준으로 오름차순 정렬
  const sortedRawData = [...props.rawData].sort((a, b) => {
    const timeA = new Date(props.mode === 'view' ? a.collectedAt : a.dateCreated)
    const timeB = new Date(props.mode === 'view' ? b.collectedAt : b.dateCreated)
    return timeA.getTime() - timeB.getTime()
  })

  // X축 레이블 (월/일 시:분 형식으로 간결하게)
  const labels = sortedRawData.map(
    (d) =>
      props.mode === 'view'
        ? format(new Date(d.collectedAt), 'M/d HH:mm') // !!! 'M/d HH:mm' 형식으로 변경 !!!
        : format(new Date(d.dateCreated), 'M/d HH:mm'), // !!! 'M/d HH:mm' 형식으로 변경 !!!
  )

  // Y축 값
  const values =
    props.mode === 'view'
      ? sortedRawData.map((d) => d.viewCount)
      : sortedRawData.map((d) => d.rawLikes)

  // 차트 제목 구성
  const chartTitle =
    props.type === 'recent'
      ? `🕒 최근 1시간 ${props.mode === 'view' ? '조회수' : '좋아요'}`
      : `📅 ${formatDateLabel(props.date)} ${props.mode === 'view' ? '조회수' : '좋아요'}`

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = canvas.value ? canvas.value.getContext('2d') : null
  if (!ctx) {
    console.error('Canvas context를 가져올 수 없습니다.')
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: props.mode === 'view' ? '조회수' : '좋아요',
          data: values,
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderColor: props.mode === 'view' ? '#007bff' : '#ff4500',
          backgroundColor: props.mode === 'view' ? '#007bff' : '#ff4500',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          align: 'start',
        },
        tooltip: {
          callbacks: {
            // 툴팁 제목도 X축 레이블과 동일하게 간결한 날짜/시간으로 표시
            title: function (context) {
              // context[0].label은 이미 'M/d HH:mm' 형식으로 포맷되어 있습니다.
              return context[0].label
            },
            label: (context) => {
              const label = context.dataset.label || ''
              return `${label}: ${context.raw.toLocaleString()}`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: '시간',
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 45,
          },
          grid: {
            display: true,
          },
        },
        y: {
          ticks: {
            callback: function (value) {
              return value.toLocaleString()
            },
          },
          beginAtZero: false,
          grid: {
            display: true,
          },
        },
      },
    },
  })
}

onMounted(() => {
  drawChart()
})

watch(
  () => props.rawData,
  () => {
    drawChart()
  },
  { deep: true },
)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<template>
  <div class="chart-wrapper">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  padding: 18px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  height: 350px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

canvas {
  max-height: 100%;
  max-width: 100%;
}
</style>
