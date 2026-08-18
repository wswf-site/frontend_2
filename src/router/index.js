import { createRouter, createWebHistory } from 'vue-router'
import MissionMain from '../components/MissionMain.vue' // 가제 미션 페이지 메인 컴포넌트
import VideoList from '../components/VideoList.vue' // 기존 VideoList (dance-film용)
import ViewChartPage from '../components/ViewChartPage.vue' // 기존 ViewChartPage (dance-film용)
import APIMissionList from '../components/APIMissionList.vue' // 새 API 미션 페이지 리스트 컴포넌트
import APIMissionChartPage from '../components/APIMissionChartPage.vue' // 새 API 미션 페이지 차트 컴포넌트
import CrewCheerMissionList from '../components/CrewCheerMissionList.vue' // 새 Crew Cheer 미션 페이지 리스트 컴포넌트
import CrewCheerChartPage from '../components/CrewCheerMissionChartPage.vue' // 새 Crew Cheer 미션 페이지 차트 컴포넌트

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 메인 페이지: 가제 미션 페이지 선택 또는 소개
      path: '/',
      name: 'home',
      component: MissionMain,
    },
    {
      // DANCE FILM MISSION 페이지
      path: '/dance-film',
      name: 'dance-film-list',
      component: VideoList, // 기존 VideoList 재사용
    },
    {
      // DANCE FILM MISSION 상세 차트 페이지
      path: '/dance-film/video/:videoId',
      name: 'dance-film-chart',
      component: ViewChartPage, // 기존 ViewChartPage 재사용
      props: true,
    },
    {
      // 새로운 API 미션 페이지
      path: '/api-mission',
      name: 'api-mission-list',
      component: APIMissionList, // 새롭게 만들 컴포넌트
    },
    {
      // 새로운 API 미션 상세 차트 페이지
      path: '/api-mission/video/:videoId',
      name: 'api-mission-chart',
      component: APIMissionChartPage, // 새롭게 만들 컴포넌트
      props: true,
    },
    {
      // 새로운 Crew Cheer 미션 페이지
      path: '/crew-cheer',
      name: 'crew-cheer-list',
      component: CrewCheerMissionList, // 새롭게 만들 컴포넌트
    },
    {
      // 새로운 Crew Cheer 미션 상세 차트 페이지
      path: '/crew-cheer/video/:videoId',
      name: 'crew-cheer-chart',
      component: CrewCheerChartPage, // 새롭게 만들 컴포넌트
      props: true,
    },
  ],
})

export default router
