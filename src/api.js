const baseHost = "https://wedev-api.sky.pro/api/v2/leaderboard";

// Получить список лидеров
export async function getLeaders() {
  const response = await fetch(baseHost, { method: "GET" });

  if (response.status === 500) {
    throw new Error("Не удалось загрузить данные, попробуйте позже");
  }

  return await response.json();
}

// Добавить лидера в список
export async function addLeader({ name, time, achievements }) {
  const response = await fetch(baseHost, { method: "POST", body: JSON.stringify({ name, time, achievements }) });

  if (response.status === 400) {
    throw new Error("Введены неправильные данные");
  }

  return await response.json();
}
