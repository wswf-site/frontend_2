<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'

const showMegaCrewTable = ref(false)
const route = useRoute()

// K-POP 미션 데이터 추가
const kpopMissionData = ref([
  { team: 'BUMSUP', views: '320만', actualLike: 188059, estimatedLike: 1171, weight: 160 },
  { team: 'AGSQUAD', views: '161만', actualLike: 120516, estimatedLike: 1009, weight: 119 },
  { team: 'RHTokyo', views: '168만', actualLike: 111884, estimatedLike: 792, weight: 141 },
  { team: 'ROYAL_FAMILY', views: '185만', actualLike: 92887, estimatedLike: 617, weight: 150 },
  { team: 'MOTIV', views: '119만', actualLike: 97420, estimatedLike: 790, weight: 123 },
  { team: 'OSAKA_OjoGang', views: '138만', actualLike: 80092, estimatedLike: 737, weight: 108 },
])

// MEGA CREW 미션 데이터 기존 ref에 조회수 추가 (제공된 데이터에 조회수 컬럼이 있었으므로)
const megaCrewData = ref([
  { team: 'BUMSUP', views: '1221만', actualLike: 1664854, estimatedLike: 5731, weight: 290 },
  { team: 'OSAKA_OjoGang', views: '678만', actualLike: 698600, estimatedLike: 2756, weight: 253 },
  { team: 'MOTIV', views: '425만', actualLike: 440094, estimatedLike: 1989, weight: 221 },
  { team: 'AGSQUAD', views: '391만', actualLike: 385064, estimatedLike: 1535, weight: 250 },
  { team: 'RHTokyo', views: '360만', actualLike: 145873, estimatedLike: 717, weight: 203 },
])
</script>

<template>
  <nav class="global-nav" aria-label="주요 메뉴">
    <RouterLink to="/" class="nav-home-link">HOME</RouterLink>
    <span class="nav-link nav-link-disabled" aria-disabled="true">SDF</span>
    <RouterLink to="/wswf" class="nav-link">WSWF</RouterLink>
    <RouterLink to="/likes-info" class="nav-link nav-likes-info">좋아요 수 추정 방법</RouterLink>
  </nav>

  <RouterView v-if="!route.path.startsWith('/wswf')" />

  <div v-else class="main-container">
    <div style="padding: 20px">
      <h1>🎬 MISSION DASHBOARD</h1>
      <RouterView />
    </div>

    <div class="info-box-small">
      <b>팀 이름</b>을 클릭하면 상세 통계를 볼 수 있습니다.<br />
      조회수는 약 5분마다 집계 (youtube data API)
      <br />
      좋아요 수는 약 30분마다 집계 (returnyoutubedislike.com) - <b>각 likes 값</b>을 클릭하면 수집한
      시각이 나옵니다.
    </div>

    <div v-if="false" class="accuracy-info-box">
      <p>
        <strong>⚠️ 좋아요 수는 값이 정확하지 않습니다.</strong>
        <br />
        본 데이터는 YouTube 공식 API를 기반으로 한 값이 아니며, 타 사이트로부터 수집한 정보를
        기준으로 약 200배를 적용하여 추정한 수치입니다. <br />
      </p>

      <div class="x200-explanation-group">
        <button
          @click="showMegaCrewTable = !showMegaCrewTable"
          class="toggle-button minimal-toggle-button"
        >
          X200을 하는 이유
          <span :class="['arrow-icon', { rotated: showMegaCrewTable }]">▼</span>
        </button>

        <div v-if="showMegaCrewTable" class="toggle-content-area minimal-content-area">
          <p class="x200-reason-text">
            추정값에 &times;200을 할 때 그나마 좋아요 수가 실제와 비슷하게 나오는 것 같아
            &times;200으로 계산했습니다.<br />
          </p>

          <h3 class="mission-table-title">MEGA CREW 미션 결과</h3>
          <table class="mega-crew-table no-background-table-rows">
            <thead>
              <tr>
                <th>Team</th>
                <th>Views</th>
                <th>실제 Likes</th>
                <th>추정 Likes (7/1 기준)</th>
                <th>가중치</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in megaCrewData" :key="data.team">
                <td>{{ data.team }}</td>
                <td>{{ data.views }}</td>
                <td>{{ data.actualLike.toLocaleString() }}</td>
                <td>{{ data.estimatedLike.toLocaleString() }}</td>
                <td>
                  <b>{{ data.weight }}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 class="mission-table-title">K-POP 미션 결과</h3>
          <table class="mission-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Views</th>
                <th>실제 Likes</th>
                <th>추정 Likes (7/2 기준)</th>
                <th><b>가중치</b></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in kpopMissionData" :key="data.team">
                <td>{{ data.team }}</td>
                <td>{{ data.views }}</td>
                <td>{{ data.actualLike.toLocaleString() }}</td>
                <td>{{ data.estimatedLike.toLocaleString() }}</td>
                <td>
                  <b>{{ data.weight }}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            이전 미션들을 기준으로 보면, MEGA CREW 미션에는 약 200배 이상의 가중치가 적용되었고,
            K-POP 미션은 약 100~150배 수준입니다. (K-POP 미션의 경우, 좋아요를 추정한 날짜가 평가
            마감일보다 이후이므로, 마감 당시 실제 가중치는 150배 이상일 가능성이 있습니다.)<br />
            절대적이진 않지만 조회수가 높아질수록 가중치도 함께 높아지는 경향이 있는 것으로
            보입니다.<br />
            본 사이트에서는 좋아요 수 데이터에 기본적으로 <strong>200배 가중치</strong>를
            적용했으며, &times;100 버전 표에서만 <strong>100배 가중치</strong>로 계산한 결과를
            제공합니다.<br />
            원하시는 기준에 따라 비교해서 보면 좋을 것 같습니다!
          </p>

          <p class="explanation-note"></p>
        </div>
      </div>
    </div>
    페이지가 뜨지 않는다면 새로고침 해주세요! <br />

    <div class="contact-info left-aligned-contact">
      혹시나 오류가 생긴다면
      <a href="https://open.kakao.com/o/sht5aJDh" target="_blank" rel="noopener noreferrer">
        https://open.kakao.com/o/sht5aJDh
      </a>
      로 연락 바랍니다!
    </div>
  </div>
</template>

<style scoped>
.global-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 56px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.nav-home-link,
.nav-link {
  padding: 8px 12px;
  border-radius: 6px;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-home-link {
  color: #007bff;
}
.nav-home-link:hover,
.nav-link:hover {
  background: #f1f3f5;
}
.nav-link-disabled {
  color: #adb5bd;
  cursor: not-allowed;
}
.nav-likes-info {
  margin-left: auto;
  color: #9aa0a6;
}
/* --- 전체 레이아웃 및 기본 스타일 --- */
.main-container {
  max-width: 800px;
  margin: 0 auto; /* 중앙 정렬 */
  padding: 0 20px; /* 좌우 여백 */
}
/* @media 쿼리를 추가하여 모바일 화면에 최적화 */
@media (max-width: 768px) {
  /* 화면 너비가 768px 이하일 때 적용 */
  .main-container {
    max-width: 100%; /* 모바일에서는 최대 너비를 100%로 설정 */
    padding: 0 15px; /* 모바일에서는 양옆 패딩을 15px로 줄여 공간 확보 */
  }
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #333;
}

/* --- 정보 박스 스타일 --- */
.info-box-small {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin-top: 10px;
  margin-bottom: 15px; /* 하단 여백 추가 */
}

/* 좋아요 정확도 정보 박스 (X200 이유와 표를 포함) */
.accuracy-info-box {
  background-color: #fff3cd; /* 연한 노란색 배경 */
  border: 1px solid #ffeeba; /* 노란색 테두리 */
  border-radius: 8px;
  padding: 15px 20px; /* 기본 패딩 */
  margin-bottom: 20px;
  font-size: 1rem;
  color: #664d03;
  line-height: 1.6;
}

.accuracy-info-box strong {
  color: #993300;
}

/* --- X200 이유 토글 그룹 (accuracy-info-box 내부) --- */
.x200-explanation-group {
  margin-top: 15px; /* 정확도 설명 텍스트와의 상단 간격 */
  padding-top: 15px; /* 내부 내용의 상단 패딩 */
  /* 위에 있는 정보와 구분하기 위한 점선 */
  border-top: 1px dashed rgba(102, 77, 3, 0.3);
}

/* 최소한의 스타일을 가진 토글 버튼 (X200을 하는 이유) */
.toggle-button.minimal-toggle-button {
  width: auto; /* 내용에 따라 너비 조절 */
  background-color: transparent; /* 배경색 없음 */
  border: none;
  padding: 0; /* 패딩 없음 */
  font-size: 1rem; /* 글자 크기 조정 */
  font-weight: bold; /* 굵게 */
  color: #444; /* 덜 튀는 어두운 회색으로 변경 */
  text-align: left;
  cursor: pointer;
  display: inline-flex; /* 텍스트 너비만큼만 차지 */
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
}

.toggle-button.minimal-toggle-button:hover {
  color: #222; /* 호버 시 더 어두운 회색으로 변경 */
  text-decoration: underline; /* 호버 시 밑줄 유지 */
}

.toggle-button.minimal-toggle-button .arrow-icon {
  margin-left: 5px; /* 화살표와 텍스트 사이 간격 */
  font-size: 0.8em; /* 화살표 크기 조정 */
  color: inherit; /* 부모 색상 (버튼 텍스트 색상)을 따르도록 변경 */
}

/* 최소한의 스타일을 가진 토글 내용 영역 */
.toggle-content-area.minimal-content-area {
  background-color: transparent; /* 배경색 없음 */
  border-top: none; /* 상단 테두리 없음 */
  padding-top: 15px; /* 상단 패딩 유지 */
  padding-left: 0;
  padding-right: 0;
}

.x200-reason-text {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #664d03; /* 부모 박스 색상 상속 */
}

.mission-table-title {
  font-size: 1.1rem; /* 더 작은 제목 */
  color: #444;
  margin-top: 0;
  margin-bottom: 15px;
  text-align: left; /* 표 제목 왼쪽 정렬 */
  font-weight: bold;
}

/* --- 공통 테이블 스타일 --- */
.mission-table,
.mega-crew-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px; /* 표 아래 여백 */
  font-size: 0.95rem;
  table-layout: fixed; /* 셀 너비를 고정하여 내용 길이에 따라 늘어나지 않도록 함 */
}

.mission-table th,
.mission-table td,
.mega-crew-table th,
.mega-crew-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  text-align: center;
  word-break: break-word; /* 긴 단어가 셀 너비를 초과할 경우 줄바꿈 허용 */
  font-size: 0.75rem; /* 글자 크기 줄이기 */
}

.mission-table th,
.mega-crew-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #555;
}

/* K-POP 미션 테이블 스타일 (행 배경색 및 호버 효과 제거) */
/* .mission-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
} */
.mission-table tbody tr:nth-child(even), /* 짝수 행 배경색 제거 */
.mission-table tbody tr:nth-child(odd) {
  /* 홀수 행 배경색 제거 */
  background-color: transparent;
}
.mission-table tbody tr:hover {
  background-color: transparent; /* 호버 시 배경색 제거 */
}

/* MEGA CREW 표 행 배경색 제거 */
.mega-crew-table.no-background-table-rows tbody tr:nth-child(odd) {
  background-color: transparent;
}

.mega-crew-table.no-background-table-rows tbody tr:hover {
  background-color: transparent;
}

.explanation-note {
  font-size: 0.85rem;
  color: #888;
  text-align: right;
  margin-top: 10px;
}

/* --- 연락처 정보 스타일 --- */
.contact-info {
  margin-top: 50px;
  color: #aaa;
  font-size: 0.9rem;
  text-align: left; /* 왼쪽 정렬 유지 */
}

.contact-info a {
  color: #999;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
  color: #777;
}
</style>
