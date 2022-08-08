import mongoose from 'mongoose';

interface App {
    listen(port: number, onInit: () => void): void;
}

export async function start(app: App,  databaseConnection: string, appPort: number): Promise<void> {
    await mongoose.connect(databaseConnection);
    app.listen(appPort, () => {
        console.log(`I'm listening on port ${appPort}`);
    });
}