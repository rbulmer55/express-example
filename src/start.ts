import express from 'express';
import 'express-async-errors';
import { AddressInfo } from 'net';
import { getRoutes } from './routes';

function startServer({ port = process.env.PORT || 3030 } = {}) {
    const app = express();

    app.use('/api', getRoutes());

    app.use(errorMiddleware);

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            const { port: serverPort } = server.address() as AddressInfo;
            console.log(`Listening on port ${serverPort}`);

            // this block of code turns `server.close` into a promise API
            const originalClose = server.close.bind(server);
            server.close = (): any => {
                return new Promise((resolveClose) => {
                    originalClose(resolveClose);
                });
            };

            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(server);

            // resolve the whole promise with the express server
            resolve(server);
        });
    });
}

function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        next(error);
    } else {
        console.log(error);
        res.status(500);
        res.json({
            message: error.message,
        });
    }
}

// ensures we close the server in the event of an error.
function setupCloseOnExit(server) {
    // https://stackoverflow.com/a/14032965/971592
    async function exitHandler(options: any = {}) {
        await server
            .close()
            .then(() => {
                console.log('Server successfully closed');
            })
            .catch((e) => {
                console.log('Something went wrong closing the server', e.stack);
            });

        if (options.exit) process.exit();
    }

    // do something when app is closing
    process.on('exit', exitHandler);

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

export { startServer };
