const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDir = path.join(__dirname, '..', 'backups');

const runDatabaseBackup = () => {
    console.log('Database backup process started...');

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(today)
    const backupFileName = `backup-${today}.sql`;

    const dbUser = process.env.DB_USER || 'postgres';
    const dbName = process.env.DB_NAME || 'chat-system';
    const dbPassword = process.env.DB_PASSWORD;
    const pgDumpBin = process.env.PG_DUMP_PATH || 'pg_dump';

    const destinationPath = path.join(backupDir, backupFileName);
    const backupCommand = `set PGPASSWORD=${dbPassword} && "${pgDumpBin}" -U ${dbUser} -d ${dbName} -f "${destinationPath}"`;

    exec(backupCommand, { shell: true }, (err) => {
        if (err) {
            console.error('Backup Error:', err.message);
            return;
        }
        console.log(`[Success]: Backup created successfully: ${backupFileName}`);
    });
};

const checkAndRecoverBackup = (scheduledHour = 0) => {
    const now = new Date();
    console.log(now)
    const currentHour = now.getHours();
    console.log(currentHour)

    if (currentHour >= scheduledHour) {
        const today = now.toISOString().split('T')[0];
        const expectedFile = path.join(backupDir, `backup-${today}.sql`);

        if (!fs.existsSync(expectedFile)) {
            console.log('Missed backup detected due to downtime! Running recovery backup now...');
            runDatabaseBackup();
        } else {
            console.log('Today’s backup already exists. No recovery needed.');
        }
    }
};

const initDatabaseBackup = () => {
    cron.schedule('0 0 * * *', () => {
        runDatabaseBackup();
    });

    checkAndRecoverBackup(0);
};

module.exports = initDatabaseBackup;
