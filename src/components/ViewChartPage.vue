<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import ViewChart from './ViewChart.vue' // 이 ViewChart는 범용 차트 컴포넌트입니다.

const route = useRoute()
const videoId = route.params.videoId

const charts = ref([])
const teamName = ref('')
const dates = ['2025-06-27', '2025-06-26', '2025-06-25'] // 정적 데이터 날짜

const activeTab = ref('view') // 'view' or 'like'

// 차트 필터링
const filteredCharts = computed(() =>
  charts.value.filter((chart) => chart.mode === activeTab.value),
)

const loadCharts = async () => {
  charts.value = []

  // 📈 조회수 recent
  try {
    const recentModule = await import(`@/data/danceFilm/${videoId}/viewers/recent.json`)
    const recentData = recentModule.default
    if (recentData.length) {
      charts.value.push({ mode: 'view', type: 'recent', data: recentData })
      teamName.value = recentData[0].teamName
    }
  } catch {
    console.warn(`조회수 recent 데이터 없음: ${videoId}/viewers/recent.json`)
  }

  for (const date of dates) {
    // 📈 조회수 daily
    try {
      const viewModule = await import(`@/data/danceFilm/${videoId}/viewers/${date}.json`)
      const viewData = viewModule.default
      if (viewData.length) {
        charts.value.push({ mode: 'view', type: 'daily', date, data: viewData })
        if (!teamName.value) teamName.value = viewData[0].teamName
      }
    } catch {
      console.warn(`조회수 daily 데이터 없음: ${videoId}/viewers/${date}.json`)
    }

    // ❤️ 좋아요 daily
    try {
      const likeModule = await import(`@/data/danceFilm/${videoId}/likes/${date}.json`)
      const likeData = likeModule.default
      if (likeData.length) {
        charts.value.push({ mode: 'like', type: 'daily', date, data: likeData })
      }
    } catch {
      console.warn(`좋아요 daily 데이터 없음: ${videoId}/likes/${date}.json`)
    }
  }
}

onMounted(() => {
  loadCharts()
})
</script>

<template>
  <div class="page-wrapper">
    <router-link to="/wswf/dance-film" class="back-link">← 돌아가기</router-link>
    <div class="blank" style="margin-bottom: 10px"></div>
    <h2 class="page-title">
      <span class="stat-label"> DANCE FILM MISSION 상세 통계</span><br />
      <span class="team-name">{{ teamName }} </span>
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

    <ViewChart
      v-for="chart in filteredCharts"
      :key="`${chart.mode}-${chart.type}-${chart.date || 'recent'}`"
      :videoId="videoId"
      :mode="chart.mode"
      :type="chart.type"
      :date="chart.date"
      :rawData="chart.data"
    />
  </div>
</template>

<style scoped>
.page-wrapper {
  padding: 10px;
  max-width: 700px; /* 차트 컨테이너의 최대 너비는 유지 */
  /* margin: 0 auto; 제거하여 중앙 정렬 해제. 필요하다면 margin-left를 설정 */
  margin-left: 0; /* 왼쪽으로 붙이려면 이렇게 설정할 수 있습니다. */
}
/* 나머지 스타일은 이전과 동일 */
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
</style>
