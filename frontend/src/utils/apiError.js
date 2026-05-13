export function getApiErrorMessage(error, fallback = '요청을 처리하지 못했습니다.') {
  const data = error.response?.data;

  if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
    return Object.values(data.fieldErrors)[0];
  }

  return data?.message || fallback;
}
