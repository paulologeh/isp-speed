function compare(a, b) {
  let comparison = 0;
  if (a.Count > b.Count) {
    comparison = 1;
  } else if (a.Count < b.Count) {
    comparison = -1;
  }
  return comparison;
}

export function getHostData(data) {
  let hostData = {};
  for (let i in data) {
    let key = data[i].host;
    if (null in data[i] || key === null) {
      continue;
    }
    let idx = key.indexOf("[");
    key = key.slice(0, idx);
    if (!(key in hostData)) {
      hostData[key] = { Host: key, Count: 0 };
    }
    hostData[key].Count += 1;
  }

  let _data = [];

  for (const key in hostData) {
    _data.push(hostData[key]);
  }
  _data.sort(compare);
  let n = _data.length;
  return _data.slice(n - 4, n);
}
