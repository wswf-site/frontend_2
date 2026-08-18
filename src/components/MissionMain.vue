<template>
  <div class="mission-selection">
    <h2>미션을 선택해주세요.</h2>
    <div class="mission-cards">
      <router-link to="/crew-cheer" class="mission-card">
        <h3>Crew Cheer Theme Performance</h3>
      </router-link>
      <router-link to="/api-mission" class="mission-card">
        <h3>Global Artist Performance MISSION</h3>
      </router-link>
      <router-link to="/dance-film" class="mission-card">
        <h3>
          DANCE FILM<br />
          MISSION
        </h3>
      </router-link>
    </div>
    <div style="margin: 30px"></div>
  </div>
</template>

<style scoped>
.mission-selection {
  text-align: center;
  margin-top: 50px;
}

.mission-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
}

.mission-card {
  display: block;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.mission-card h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #007bff;
}

.mission-card p {
  font-size: 1rem;
  color: #666;
}

/* --- 모바일 반응형 디자인 --- */
@media (max-width: 768px) {
  /* 태블릿 및 모바일 */
  .mission-cards {
    flex-direction: column; /* 카드를 세로로 쌓음 */
    align-items: center; /* 세로로 쌓을 때 가운데 정렬 */
    gap: 20px; /* 세로 간격 조절 */
  }

  .mission-card {
    width: 80%; /* 모바일 화면에 맞게 너비 조절 */
    max-width: 300px; /* 너무 커지지 않도록 최대 너비 설정 */
    padding: 20px; /* 모바일에서 패딩 조절 */
  }

  .mission-card h3 {
    font-size: 1.5rem; /* 모바일에서 폰트 크기 조절 */
  }
}
</style>
