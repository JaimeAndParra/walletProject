const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(
    (   
        { level, message, timestamp }: {level: string, message: string, timestamp: string}
    ) => {
        return `${timestamp}-${level}: ${message}`
    }
)

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/combine.log'}),
    ]
})

export default logger;