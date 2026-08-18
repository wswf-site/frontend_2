<template>
  <main class="service-select" aria-labelledby="service-select-title">
    <h1 id="service-select-title">서비스를 선택해 주세요</h1>
    <div class="service-buttons">
      <button type="button" class="service-button sdf-button" disabled>SDF</button>
      <router-link to="/wswf" class="service-button wswf-button">WSWF</router-link>
    </div>
    <p class="coming-soon">SDF는 준비 중입니다.</p>
  </main>
</template>

<style scoped>
.service-select {
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(72px, 14vh, 160px) 24px 24px;
  box-sizing: border-box;
  text-align: center;
}
h1 {
  margin: 0 0 40px;
  color: #333;
  font-size: 2.25rem;
}
.service-buttons {
  display: flex;
  gap: 16px;
}
.service-button {
  min-width: 240px;
  padding: 26px 36px;
  border: 0;
  border-radius: 12px;
  font: inherit;
  font-size: 1.7rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
}
.wswf-button {
  background: #007bff;
  color: #fff;
}
.wswf-button:hover,
.wswf-button:focus-visible {
  background: #0069d9;
}
.sdf-button {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}
.coming-soon {
  min-height: 24px;
  margin: 16px 0 0;
  color: #6c757d;
}
@media (max-width: 480px) {
  .service-buttons {
    width: 100%;
    flex-direction: column;
  }
  .service-button {
    width: 100%;
  }
}
</style>
