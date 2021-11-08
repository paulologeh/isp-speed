function getYesterdaysData(data) {
  let yestData = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (data === undefined) return;
  for (let i = 0; i < data.length; i++) {
    let refDate = new Date(data[i].utc_time);
    if (
      refDate.getDate() === yesterday.getDate() &&
      refDate.getMonth() === yesterday.getMonth() &&
      refDate.getFullYear() === yesterday.getFullYear()
    ) {
      yestData.push(data[i]);
    }
  }
  return yestData;
}

function propAverage(data, prop) {
  let avg = 0;
  let N = data.length;
  for (let i = 0; i < data.length; i++) {
    avg += data[i][prop];
  }
  avg = avg / N;
  return avg.toFixed(1);
}

function countTestsToday(data) {
  let count = 0;
  const today = new Date();
  for (let i = data.length - 1; i >= 0; i--) {
    let refDate = new Date(data[i].utc_time);
    if (
      refDate.getDate() === today.getDate() &&
      refDate.getMonth() === today.getMonth() &&
      refDate.getFullYear() === today.getFullYear()
    ) {
      count++;
    }
  }
  return count;
}

export function getSummary(
  summary,
  data,
  minimumDownload,
  minimumUpload,
  allData
) {
  let yestData = getYesterdaysData(allData);
  if (yestData === undefined) return;

  let avgDownloadToday = propAverage(data, "download");
  avgDownloadToday = isNaN(avgDownloadToday) ? 0 : avgDownloadToday;
  let avgDownloadYesterday = propAverage(yestData, "download");
  avgDownloadYesterday = isNaN(avgDownloadYesterday) ? 0 : avgDownloadYesterday;
  let pctChangeDownload = avgDownloadYesterday
    ? ((avgDownloadToday - avgDownloadYesterday) / avgDownloadYesterday) * 100
    : 0;
  pctChangeDownload = isNaN(pctChangeDownload) ? 0 : pctChangeDownload;
  let avgUploadToday = propAverage(data, "upload");
  avgUploadToday = isNaN(avgUploadToday) ? 0 : avgUploadToday;
  let avgUploadYesterday = propAverage(yestData, "upload");
  avgUploadYesterday = isNaN(avgUploadYesterday) ? 0 : avgUploadYesterday;
  let pctChangeUpload = avgUploadYesterday
    ? ((avgUploadToday - avgUploadYesterday) / avgUploadYesterday) * 100
    : 0;
  pctChangeUpload = isNaN(pctChangeUpload) ? 0 : pctChangeUpload;
  let testsToday = countTestsToday(data);
  testsToday = isNaN(testsToday) ? 0 : testsToday;

  summary[0].description = avgDownloadToday + " Mbps";
  summary[0].meta =
    "Change Since Yesterday: " + pctChangeDownload.toFixed(1) + " %";
  summary[1].description = avgUploadToday + " Mbps";
  summary[1].meta =
    "Change Since Yesterday: " + pctChangeUpload.toFixed(1) + " %";
  summary[2].description = data.length;
  summary[2].meta = "Tests Today: " + testsToday;
  let count = 0;
  for (let i in data) {
    if (
      data[i].download >= minimumDownload &&
      data[i].upload >= minimumUpload
    ) {
      count++;
    }
  }
  let threshold = (count / data.length) * 100;
  threshold = threshold.toFixed(0);
  summary[3].description = `${threshold}%`;
  if (threshold >= 90) {
    summary[3].meta = "Excellent Service!";
  } else if (threshold >= 80) {
    summary[3].meta = "Good Service";
  } else if (threshold >= 50) {
    summary[3].meta = "Average Service";
  } else if (threshold >= 30) {
    summary[3].meta = "Poor Service";
  } else {
    summary[3].meta = "Unusable";
  }
  return summary;
}
