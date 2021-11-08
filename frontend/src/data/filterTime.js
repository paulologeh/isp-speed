export function filterTime(data, timeDuration) {
  let new_data = [];
  const today = new Date();
  for (let i in data) {
    let refDate = new Date(data[i].utc_time);
    if (timeDuration === "30 days") {
      let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 30) {
        new_data.push(data[i]);
      }
    } else if (timeDuration === "7 days") {
      let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 7) {
        new_data.push(data[i]);
      }
    } else if (timeDuration === "24 hours") {
      let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60);
      if (diff <= 24) {
        new_data.push(data[i]);
      }
    }
  }
  return new_data;
}
