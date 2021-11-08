export function getRecentTests(data) {
  const now = new Date();
  let newData = [];

  for (let i = data.length - 1; i > data.length - 5; i--) {
    newData.push({ ...data[i] });
  }

  for (let i in newData) {
    let timeLapsed =
      now.getTime() - new Date(newData[i].utc_time * 1000).getTime();
    timeLapsed /= 1000 * 60 * 60;
    if (timeLapsed <= 1) {
      timeLapsed = "Less than 1 hour ago";
    } else if (timeLapsed <= 1.5) {
      timeLapsed = "About 1 hour ago";
    } else if (timeLapsed > 24) {
      timeLapsed = "More than a day ago";
    } else {
      timeLapsed = `About ${timeLapsed.toFixed(0)} hours ago`;
    }

    newData[i].date = timeLapsed;
    newData[i].meta = newData[i].host;
    newData[i].summary = `Download: ${newData[i].download.toFixed(
      2
    )} Mbps   Upload: ${newData[i].upload.toFixed(2)} Mbps`;

    if (newData[i].provider.includes("EE")) {
      newData[i].image = process.env.PUBLIC_URL + "/EE.jpg";
    } else if (newData[i].provider.includes("Three")) {
      newData[i].image = process.env.PUBLIC_URL + "/Three.png";
    } else if (newData[i].provider.includes("Virgin")) {
      newData[i].image = process.env.PUBLIC_URL + "/virginfibre.png";
    } else {
      console.log(newData[i].provider);
      newData[i].image = process.env.PUBLIC_URL + "/vpn.png";
    }
    delete newData[i].utc_time;
    delete newData[i].provider;
    delete newData[i].download;
    delete newData[i].upload;
  }
  return newData;
}
