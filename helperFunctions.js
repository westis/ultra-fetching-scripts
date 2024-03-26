// helperFunctions.js
export function timeStringToSeconds(timeString) {
  const parts = timeString.split(":").map((part) => parseFloat(part));
  const totalSeconds = parts[0] * 3600 + parts[1] * 60 + Math.ceil(parts[2]);
  return totalSeconds;
}

export function extractKmFromString(kmString) {
  return parseFloat(kmString.replace("Km ", ""));
}

export function kmToMiles(meters) {
  return meters / 1.60934;
}

export function calculatePace(distanceInKm, timeInSeconds) {
  return distanceInKm > 0 ? timeInSeconds / distanceInKm : 0;
}

export function secondsToHMS(seconds) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function calculateEventEndTime(startDateTime, duration) {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  const startTime = new Date(startDateTime);
  return new Date(
    startTime.getTime() +
      hours * 3600 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000
  );
}
