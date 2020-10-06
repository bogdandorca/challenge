const readFileInput = () => {
    return new Promise((resolve) => {
        let input = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (chunk !== null) {
                input += chunk;
            }
        });
        process.stdin.on('end', () => resolve(input));
    });
}

const splitConfigContent = (config) => {
    const splitConfig = config.split('\r\n').map(line => {
        const [ minute, hour, path ] = line.split(' ');
        return line ? { minute, hour, path } : null;
    });
    const lastConfigLine = splitConfig[splitConfig.length - 1];
    if (!lastConfigLine) {
        return splitConfig.splice(0, splitConfig.length - 1);
    }
    return splitConfig;
}

const addNumberPadding = (number) => {
    return (''+number).length === 1 ? `0${number}` : number;
}

const getNextAppointmentFormat = (hour, minute, day) => {
    return `${hour}:${addNumberPadding(minute)} ${day}`;
}

module.exports = {
    readFileInput,
    splitConfigContent,
    getNextAppointmentFormat
}