import express from 'express';

function getRootRoutes() {
    const router = express.Router();
    router.get('/', helloWorld);
    return router;
}

async function helloWorld(req, res) {
    res.send('Hello World');
}

export { getRootRoutes };
