export default function (delay, retry) {
    const minInterval = retry * delay;
    const maxInterval = (retry + 1) * delay;
    return Math.floor((Math.random() * maxInterval) + minInterval);
}
