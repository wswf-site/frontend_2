<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import ViewChart from './ViewChart.vue'

// src/data/crewCheer/ 하위의 모든 views.json 및 likes.json 파일을 가져옵니다.
// 번들링 시점에 해당 경로에 있는 모든 .json 파일을 포함시키고,
// 런타임에 필요에 따라 동적으로 접근할 수 있게 합니다.
const allViewsData = import.meta.glob('@/data/crewCheer/*/views.json', { eager: true })
const allLikesData = import.meta.glob('@/data/crewCheer/*/likes.json', { eager: true })

const route = useRoute()
const videoId = ref(route.params.videoId) // ref로 변경하여 watch 가능하게

const charts = ref([])
const teamName = ref('')
const activeTab = ref('view') // 'view' or 'like'

// 차트 필터링
const filteredCharts = computed(() =>
  charts.value.filter((chart) => chart.mode === activeTab.value),
)

const loadCharts = async () => {
  charts.value = []
  teamName.value = '' // 데이터 로드 전 초기화

  if (!videoId.value) {
    console.warn('Video ID가 없어 차트 데이터를 불러올 수 없습니다.')
    return
  }

  try {
    // Crew Cheer 데이터에 맞게 표시할 날짜 범위 설정
    // 예시에서 제공된 날짜를 사용하거나, 필요에 따라 동적으로 생성할 수 있습니다.
    const datesToDisplay = ['2025-07-20', '2025-07-19', '2025-07-18', '2025-07-17', '2025-07-16']

    // 해당 videoId에 맞는 views.json 데이터를 찾습니다.
    const viewsJsonPath = `/src/data/crewCheer/${videoId.value}/views.json`
    const viewsJsonData = allViewsData[viewsJsonPath]?.default // .default를 통해 실제 JSON 데이터를 가져옵니다.

    if (viewsJsonData) {
      // recentHourData 처리 (views.json에 이 데이터가 있다면)
      if (viewsJsonData.recentHourData && viewsJsonData.recentHourData.length > 0) {
        charts.value.push({
          mode: 'view',
          type: 'recent',
          date: null, // 최근 1시간 데이터는 특정 날짜에 종속되지 않음
          data: viewsJsonData.recentHourData,
          id: 'view-recent',
        })
        // 팀 이름 설정 (데이터가 있을 때 한 번만 설정)
        if (!teamName.value) {
          teamName.value = viewsJsonData.recentHourData[0].teamName || '팀 이름'
        }
      }

      // dailyData 처리
      if (viewsJsonData.dailyData) {
        for (const date of datesToDisplay) {
          // 지정된 날짜만 표시
          if (viewsJsonData.dailyData[date] && viewsJsonData.dailyData[date].length > 0) {
            charts.value.push({
              mode: 'view',
              type: 'daily',
              date: date,
              data: viewsJsonData.dailyData[date],
              id: `view-daily-${date}`,
            })
            if (!teamName.value) {
              teamName.value = viewsJsonData.dailyData[date][0].teamName || '팀 이름'
            }
          }
        }
      }
    } else {
      console.warn(
        `Video ID ${videoId.value}에 대한 views.json 데이터가 없거나 형식이 올바르지 않습니다.`,
      )
    }

    // 해당 videoId에 맞는 likes.json 데이터를 찾습니다.
    const likesJsonPath = `/src/data/crewCheer/${videoId.value}/likes.json`
    const likesJsonData = allLikesData[likesJsonPath]?.default // .default를 통해 실제 JSON 데이터를 가져옵니다.

    if (likesJsonData) {
      for (const date of datesToDisplay) {
        // 지정된 날짜만 표시
        if (likesJsonData[date] && likesJsonData[date].length > 0) {
          charts.value.push({
            mode: 'like',
            type: 'daily', // 좋아요는 'recent' 타입이 없으므로 'daily'만 존재
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

    // 생성된 차트 설정을 날짜 내림차순, 타입 (recent 먼저)으로 정렬
    charts.value.sort((a, b) => {
      if (a.type === 'recent' && b.type !== 'recent') return -1
      if (a.type !== 'recent' && b.type === 'recent') return 1
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date) // 최신 날짜가 먼저 오도록
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

// videoId가 변경되면 차트를 다시 로드합니다.
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
    <router-link to="/wswf/crew-cheer" class="back-link">← 돌아가기</router-link>
    <div class="blank" style="margin-bottom: 10px"></div>
    <h2 class="page-title">
      <span class="stat-label"> Crew Cheer Theme Performance 상세 통계</span>
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
  /* H2 컨테이너 자체의 여백만 설정 */
  margin: 15px 0 25px 0; /* 위 아래 여백을 더 늘려 주변 요소와의 간격 확보 */
  line-height: 1.2; /* 줄 간격 약간 조절 */
  text-align: left; /* 왼쪽 정렬 명시 */
}

.stat-label {
  display: block; /* 줄 바꿈이 잘 작동하도록 블록 요소로 만듦 */
  font-size: 1.5rem; /* 부제목처럼 보이도록 크기 조절 */
  font-weight: 500; /* 기존보다 얇은 글씨체 */
  color: #666; /* 부드러운 회색으로 색상 변경 */
  margin-bottom: 8px; /* 통계 레이블과 팀 이름 사이 간격 */
  letter-spacing: 0.03em; /* 글자 간격 약간 추가 */
}

.team-name {
  display: block; /* 블록 요소로 만듦 */
  font-size: 2.3rem; /* 팀 이름을 더 크고 강조 */
  font-weight: 800; /* 아주 굵은 글씨체로 강조 */
  color: #2c3e50; /* 기존 진한 회색을 유지하여 대비 */
  /* text-shadow: 1px 1px 2px rgba(0,0,0,0.1); */ /* 선택 사항: 미묘한 그림자로 입체감 추가 */
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
