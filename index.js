const { readFileInput, splitConfigContent, getNextAppointmentFormat } = require('./scripts');
const [ nodePath, scriptPath, time ] = process.argv;
const [ currentHour, currentMinute ] = time.split(':');

const getNextHour = () => {
    return +currentHour + 1 > 23 ? 0 : +currentHour + 1;
}

const getMinute = (nextHour) => {
    return nextHour !== '*' && currentHour === nextHour ? +currentMinute : 0;
}

const getNextRunningTime = (minute, hour) => {
    const nextMinute = minute === '*' ? getMinute(hour) : +minute;
    const nextHour = hour === '*' ? (minute >= currentMinute ? currentHour : getNextHour()) : hour;
    return { hour: nextHour, minute: nextMinute }
}

const getDay = (nextAppointedHour) => {
    return nextAppointedHour < +currentHour ? 'tomorrow' : 'today';
}

const getNextAppointedRunningTime = (config) => {
    let { hour, minute } = config;

    if (hour === '*' && minute === '*') {
        return getNextAppointmentFormat(currentHour, currentMinute, 'today');
    }

    const nextRunningTime = getNextRunningTime(minute, hour);
    const nextRunningDay = getDay(nextRunningTime.hour);
    return getNextAppointmentFormat(nextRunningTime.hour, nextRunningTime.minute, nextRunningDay);
}

(async function() {
    const fileContent = await readFileInput();
    const splitContent = splitConfigContent(fileContent);
    splitContent.forEach(configLine => {
        const nextRun = getNextAppointedRunningTime(configLine);
        console.log(`${nextRun} - ${configLine.path}`);
    });
})();