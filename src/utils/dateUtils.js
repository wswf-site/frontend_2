export const getFixedDates = (baseDateStr = '', days = 3) => {
  const result = []
  const todayKST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })) // KST 기준 오늘 날짜 생성
  todayKST.setHours(0, 0, 0, 0) // 자정으로 설정

  // baseDateStr이 없으면 오늘 날짜를 기준
  const base = baseDateStr ? new Date(baseDateStr) : todayKST
  base.setHours(0, 0, 0, 0) // 혹시 baseDateStr에 시간이 포함되어 있다면 자정으로 설정

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)

    // 오늘 날짜 이후의 미래 날짜는 포함하지 않기
    // 비교 시 같은 날짜의 자정 기준을 사용해야 정확
    const currentIteratedDate = new Date(d)
    currentIteratedDate.setHours(0, 0, 0, 0)

    if (currentIteratedDate > todayKST) {
      continue // 미래 날짜는 건너뛰기
    }

    const yyyy = currentIteratedDate.getFullYear()
    const mm = String(currentIteratedDate.getMonth() + 1).padStart(2, '0')
    const dd = String(currentIteratedDate.getDate()).padStart(2, '0')
    result.push(`${yyyy}-${mm}-${dd}`)
  }
  return result
}

export const formatDateSimple = (dateStr) => {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${min}`
}

export const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr)
  const mm = d.getMonth() + 1
  const dd = d.getDate()
  return `${mm}/${dd}`
}

export const formatTimeLabel = (dateStr) => {
  const d = new Date(dateStr)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
// export const formatDateSimple = (dateString) => {
//   const date = new Date(dateString)
//   return date.toLocaleString('ko-KR', {
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//   })
// }

// export const formatDateLabel = (dateString) => {
//   const date = new Date(dateString)
//   return date.toLocaleString('ko-KR', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     weekday: 'short',
//   })
// }
