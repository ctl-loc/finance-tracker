import app from "./app";
import { SERVER } from "./config/config";

app.listen(SERVER.port, () => {
    console.info(`Server running on http://localhost:${SERVER.port}`);
});
