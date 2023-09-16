import express from 'express';
import cors from 'cors';
import {previewPaste, generatePreview} from './api-modules.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({
   origin: 'http://127.0.0.1:5500' 
}))

app.listen(
    PORT, 
    () => console.log(`it's alive on http://localhost:${PORT}`) 
);

app.post('/submit', async (request, response) => {
    const monRequest = request.body;
    const paste = monRequest.teamPaste;
    const preview = previewPaste(paste);
    const opponentPreviews = await generatePreview (
        monRequest.gen,
        monRequest.megathreadReplays,
        monRequest.specificReplaysPaste,
        monRequest.usernameFilter,
    );

    response.status(200).send({
        paste: paste, 
        preview: preview,
        opponentPreviews: opponentPreviews
    });

});