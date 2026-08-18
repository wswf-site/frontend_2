// api/statsApi.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchCurrentStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats/current`)
    return response.data
  } catch (error) {
    console.error('현재 통계 데이터를 불러오는 데 실패했습니다:', error)
    throw error
  }
}

/**
 * 특정 비디오의 조회수 또는 좋아요 이력 데이터를 가져옵니다.
 * @param {string} videoId - 비디오 ID
 * @param {'view' | 'like'} mode - 'view' 또는 'like'
 * @param {string[]} dates - 'YYYY-MM-DD' 형식의 날짜 배열
 * @returns {Promise<object>} API 응답 데이터
 */
export const fetchVideoHistoryStats = async (videoId, mode, dates) => {
  try {
    const datesParam = dates.join(',') // 날짜 배열을 콤마로 구분된 문자열로 변환
    const endpoint = mode === 'view' ? 'views/with-recent' : 'likes'
    const response = await axios.get(
      `${API_BASE_URL}/history/${endpoint}/${videoId}?dates=${datesParam}`,
    )
    return response.data
  } catch (error) {
    console.error(
      `비디오 이력 데이터를 불러오는 데 실패했습니다 (ID: ${videoId}, Mode: ${mode}):`,
      error,
    )
    throw error
  }
}
