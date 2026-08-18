<script setup>
const megaCrewData = [
  { team: 'BUMSUP', views: '1221만', actualLike: 1664854, estimatedLike: 5731, weight: 290 },
  { team: 'OSAKA_OjoGang', views: '678만', actualLike: 698600, estimatedLike: 2756, weight: 253 },
  { team: 'MOTIV', views: '425만', actualLike: 440094, estimatedLike: 1989, weight: 221 },
  { team: 'AGSQUAD', views: '391만', actualLike: 385064, estimatedLike: 1535, weight: 250 },
  { team: 'RHTokyo', views: '360만', actualLike: 145873, estimatedLike: 717, weight: 203 },
]
const kpopMissionData = [
  { team: 'BUMSUP', views: '320만', actualLike: 188059, estimatedLike: 1171, weight: 160 },
  { team: 'AGSQUAD', views: '161만', actualLike: 120516, estimatedLike: 1009, weight: 119 },
  { team: 'RHTokyo', views: '168만', actualLike: 111884, estimatedLike: 792, weight: 141 },
  { team: 'ROYAL_FAMILY', views: '185만', actualLike: 92887, estimatedLike: 617, weight: 150 },
  { team: 'MOTIV', views: '119만', actualLike: 97420, estimatedLike: 790, weight: 123 },
  { team: 'OSAKA_OjoGang', views: '138만', actualLike: 80092, estimatedLike: 737, weight: 108 },
]
</script>

<template>
  <main class="likes-info-page">
    <h1>좋아요 수 추정 방법</h1>
    <section class="accuracy-info-box">
      <p>
        <strong>⚠️ 좋아요 수는 공식 수치가 아닌 추정치입니다.</strong><br />본 데이터는 YouTube 공식
        API가 아닌 외부 수집 데이터를 바탕으로 계산되므로, 실제 좋아요 수와 차이가 있을 수 있습니다.
      </p>
      <div class="details">
        <b>가중치 기준 안내</b>
        <p>
          실제 좋아요 수와의 차이를 줄이기 위해 ×200 가중치를 적용했습니다. 다만 단기간 좋아요가
          매우 집중되는 경우에는 ×200을 한 결과가 실제 수치보다 크게 계산될 수도 있어 ×100을
          참고하시는 것이 좋을 수 있습니다.
        </p>
        <h2>MEGA CREW 미션 결과</h2>
        <table>
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
        <h2>K-POP 미션 결과</h2>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Views</th>
              <th>실제 Likes</th>
              <th>추정 Likes (7/2 기준)</th>
              <th>가중치</th>
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
          이전 미션들을 기준으로 보면, MEGA CREW 미션에는 약 200배 이상의 가중치가 적용되었고 K-POP
          미션은 약 100~150배 수준입니다. <br />
          본 사이트에서는 좋아요 수 데이터에 기본적으로 <strong>×200 가중치</strong>를 적용하였고,
          ×100 버전 표에서만 <strong>×100 가중치</strong>로 계산한 결과를 제공합니다. 실제 수치와
          차이가 발생할 수 있으므로, 상황에 따라 참고해 확인해 주세요.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.likes-info-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 20px;
}
h1 {
  color: #333;
}
.accuracy-info-box {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 20px;
  color: #664d03;
  line-height: 1.6;
}
.accuracy-info-box strong {
  color: #993300;
}
.toggle-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #444;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.toggle-button span {
  display: inline-block;
  margin-left: 5px;
  transition: transform 0.2s;
}
.toggle-button span.rotated {
  transform: rotate(180deg);
}
.details {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed rgba(102, 77, 3, 0.3);
}
h2 {
  margin-top: 24px;
  font-size: 1.1rem;
  color: #444;
}
table {
  width: 100%;
  margin-bottom: 24px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 0.8rem;
}
th,
td {
  padding: 9px 6px;
  border: 1px solid #ddd;
  text-align: center;
  word-break: break-word;
}
th {
  background: #f0f0f0;
  color: #555;
}
@media (max-width: 768px) {
  .likes-info-page {
    padding: 32px 15px;
  }
}
</style>
