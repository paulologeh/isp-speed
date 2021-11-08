function compare(a, b) {
  let comparison = 0;
  if (a.utc_time > b.utc_time) {
    comparison = 1;
  } else if (a.utc_time < b.utc_time) {
    comparison = -1;
  }
  return comparison;
}

export function getAllTimeData(data) {
  if (data === undefined) {
    return null;
  }
  let dataNew = [];
  for (let i = 0; i < data.length; i++) {
    let refDate = new Date(data[i].utc_time);
    let year = refDate.getFullYear();
    let month = refDate.getMonth() + 1;

    if (isNaN(year) || isNaN(month)) {
      continue;
    }

    let key = `${year}${month}`;
    if (!(key in dataNew)) {
      dataNew[key] = [];
    }
    dataNew[key].push(data[i]);
  }

  let newData = [];
  for (const key in dataNew) {
    const dataObject = {
      download: 0,
      upload: 0,
      provider: null,
      utc_time: null,
    };
    dataObject.utc_time = dataNew[key][0].utc_time;
    dataObject.provider = dataNew[key][0].provider;
    for (let value in dataNew[key]) {
      dataObject.download += dataNew[key][value].download;
      dataObject.upload += dataNew[key][value].upload;
    }
    dataObject.download /= dataNew[key].length;
    dataObject.upload /= dataNew[key].length;
    dataObject.download = dataObject.download.toFixed(1);
    dataObject.upload = dataObject.upload.toFixed(1);
    newData.push(dataObject);
  }
  newData.sort(compare);
  return newData;
}
