import express from "express";
import logger from "./utils/logger";
import routes from "./api/routes"

const app = express();
const port = 8086;

app.use(express.json());
app.use('/api/v1', routes);

app.listen(port, ()=>{
    logger.info(`Server is running on port ${port}`);
})