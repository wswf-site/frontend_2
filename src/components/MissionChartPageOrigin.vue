<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue' // watch 추가
import ViewChart from './ViewChart.vue' // 이 ViewChart는 범용 차트 컴포넌트입니다.
import { fetchVideoHistoryStats } from '@/api/statsApi' // 새로운 API 호출 함수

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
    // const datesToFetch = generateDateRange(7) // 지난 7일간의 날짜
    const datesToFetch = ['2025-07-20', '2025-07-19', '2025-07-18', '2025-07-17', '2025-07-16']
    // 조회수 데이터 가져오기
    const viewResponse = await fetchVideoHistoryStats(videoId.value, 'view', datesToFetch)
    console.log('조회수 API 응답:', viewResponse)

    if (viewResponse.recentHourData && viewResponse.recentHourData.length > 0) {
      charts.value.push({
        mode: 'view',
        type: 'recent',
        date: null, // 최근 1시간 데이터는 특정 날짜에 종속되지 않음
        data: viewResponse.recentHourData,
        id: 'view-recent',
      })
      // 팀 이름 설정 (데이터가 있을 때 한 번만 설정)
      if (!teamName.value) {
        teamName.value = viewResponse.recentHourData[0].teamName || '팀 이름'
      }
    }

    if (viewResponse.dailyData) {
      for (const date in viewResponse.dailyData) {
        if (viewResponse.dailyData[date] && viewResponse.dailyData[date].length > 0) {
          charts.value.push({
            mode: 'view',
            type: 'daily',
            date: date,
            data: viewResponse.dailyData[date],
            id: `view-daily-${date}`,
          })
          if (!teamName.value) {
            // 아직 팀 이름이 설정되지 않았다면 설정
            teamName.value = viewResponse.dailyData[date][0].teamName || '팀 이름'
          }
        }
      }
    }

    // 좋아요 데이터 가져오기 (따로 호출)
    const likeResponse = await fetchVideoHistoryStats(videoId.value, 'like', datesToFetch)
    console.log('좋아요 API 응답:', likeResponse)

    if (likeResponse) {
      for (const date in likeResponse) {
        if (likeResponse[date] && likeResponse[date].length > 0) {
          charts.value.push({
            mode: 'like',
            type: 'daily', // 좋아요는 'recent' 타입이 없으므로 'daily'만 존재
            date: date,
            data: likeResponse[date],
            id: `like-daily-${date}`,
          })
        }
      }
    }

    // 생성된 차트 설정을 날짜 내림차순, 타입 (recent 먼저)으로 정렬 (선택 사항)
    charts.value.sort((a, b) => {
      if (a.type === 'recent' && b.type !== 'recent') return -1
      if (a.type !== 'recent' && b.type === 'recent') return 1
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date) // 최신 날짜가 먼저 오도록
      }
      return 0
    })
  } catch (error) {
    console.error(
      `API 미션 차트 데이터를 불러오는 데 실패했습니다 (Video ID: ${videoId.value}):`,
      error,
    )
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
    <router-link to="/crew-cheer" class="back-link">← 돌아가기</router-link>
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
