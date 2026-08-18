<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import ViewChart from './ViewChart.vue'

// src/data/globalArtist/ 하위의 모든 views.json 및 likes.json 파일을 가져옵니다.
// 번들링 시점에 해당 경로에 있는 모든 .json 파일을 포함시키고,
// 런타임에 필요에 따라 동적으로 접근할 수 있게 합니다.
const allViewsData = import.meta.glob('@/data/globalArtist/*/views.json', { eager: true })
const allLikesData = import.meta.glob('@/data/globalArtist/*/likes.json', { eager: true })

const route = useRoute()
const videoId = ref(route.params.videoId)

const charts = ref([])
const teamName = ref('')
const activeTab = ref('view')

const filteredCharts = computed(() =>
  charts.value.filter((chart) => chart.mode === activeTab.value),
)

const loadCharts = async () => {
  charts.value = []
  teamName.value = ''

  if (!videoId.value) {
    console.warn('Video ID가 없어 차트 데이터를 불러올 수 없습니다.')
    return
  }

  try {
    const datesToDisplay = ['2025-07-05', '2025-07-04', '2025-07-03', '2025-07-02']

    // 해당 videoId에 맞는 views.json 데이터를 찾습니다.
    const viewsJsonPath = `/src/data/globalArtist/${videoId.value}/views.json`
    const viewsJsonData = allViewsData[viewsJsonPath]?.default // .default를 통해 실제 JSON 데이터를 가져옵니다.

    if (viewsJsonData && viewsJsonData.dailyData) {
      for (const date of datesToDisplay) {
        if (viewsJsonData.dailyData[date] && viewsJsonData.dailyData[date].length > 0) {
          charts.value.push({
            mode: 'view',
            type: 'daily',
            date: date,
            data: viewsJsonData.dailyData[date],
            id: `view-daily-${date}`,
          })
          if (!teamName.value && viewsJsonData.dailyData[date][0]?.teamName) {
            teamName.value = viewsJsonData.dailyData[date][0].teamName
          }
        }
      }
    } else {
      console.warn(
        `Video ID ${videoId.value}에 대한 views.json 데이터가 없거나 형식이 올바르지 않습니다.`,
      )
    }

    // 해당 videoId에 맞는 likes.json 데이터를 찾습니다.
    const likesJsonPath = `/src/data/globalArtist/${videoId.value}/likes.json`
    const likesJsonData = allLikesData[likesJsonPath]?.default // .default를 통해 실제 JSON 데이터를 가져옵니다.

    if (likesJsonData) {
      for (const date of datesToDisplay) {
        if (likesJsonData[date] && likesJsonData[date].length > 0) {
          charts.value.push({
            mode: 'like',
            type: 'daily',
            date: date,
            data: likesJsonData[date],
            id: `like-daily-${date}`,
          })
        }
      }
    } else {
      console.warn(
        `Video ID ${videoId.value}에 대한 likes.json 데이터가 없거나 형식이 올바르지 않습니다.`,
      )
    }

    charts.value.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date)
      }
      return 0
    })
  } catch (error) {
    console.error(`차트 데이터를 불러오는 데 실패했습니다 (Video ID: ${videoId.value}):`, error)
  }
}

onMounted(() => {
  loadCharts()
})

watch(
  () => route.params.videoId,
  (newVideoId) => {
    videoId.value = newVideoId
    loadCharts()
  },
)
</script>

<template>
  <div class="page-wrapper">
    <router-link to="/wswf/api-mission" class="back-link">← 돌아가기</router-link>
    <div class="blank" style="margin-bottom: 10px"></div>
    <h2 class="page-title">
      <span class="stat-label"> Global Artist Performance MISSION 상세 통계</span>
      <span class="team-name">{{ teamName || '로딩 중...' }} </span><br />
    </h2>
    <div class="header"></div>

    <div class="tabs">
      <button :class="['tab', activeTab === 'view' ? 'active' : '']" @click="activeTab = 'view'">
        🎞️ Views
      </button>
      <button :class="['tab', activeTab === 'like' ? 'active' : '']" @click="activeTab = 'like'">
        ❤️ Likes
      </button>
    </div>

    <template v-if="filteredCharts.length > 0">
      <ViewChart
        v-for="chart in filteredCharts"
        :key="chart.id"
        :videoId="videoId"
        :mode="chart.mode"
        :type="chart.type"
        :date="chart.date"
        :rawData="chart.data"
      />
    </template>
    <div v-else class="no-data-message">데이터가 없습니다.</div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.page-wrapper {
  padding: 10px;
  max-width: 700px;
  margin-left: 0;
}
.blank {
  margin-bottom: 5px;
}
.header {
  align-items: center;
  margin-bottom: 10px;
}

.back-link {
  font-size: 0.95rem;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0056b3;
}
.page-title {
  margin: 15px 0 25px 0;
  line-height: 1.2;
  text-align: left;
}

.stat-label {
  display: block;
  font-size: 1.5rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: 0.03em;
}

.team-name {
  display: block;
  font-size: 2.3rem;
  font-weight: 800;
  color: #2c3e50;
}

.tabs {
  display: flex;
  margin-bottom: 16px;
}

.tab {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}

.tab:hover {
  color: #000;
}

.tab.active {
  color: #000;
  border-bottom: 3px solid #007bff;
}

.no-data-message {
  text-align: center;
  color: #888;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
