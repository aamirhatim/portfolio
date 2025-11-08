// backup-restore.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// --- CONFIGURATION ---
// 1. Emulator Host (must be running when script is executed)
const EMULATOR_HOST = 'localhost:5001'; 
// 2. Location to save the backup file
const BACKUP_FILE_PATH = './backups/full-backup.json';
// 3. Path to the Service Account Key for your LIVE project
const SERVICE_ACCOUNT_KEY_PATH = './serviceAccountKey.json'; 
// ---------------------

// Ensure the backups directory exists
if (!fs.existsSync(path.dirname(BACKUP_FILE_PATH))) {
    fs.mkdirSync(path.dirname(BACKUP_FILE_PATH), { recursive: true });
}

function runCommand(command, env = {}) {
    // Merge the process's current environment variables with any new ones passed in
    const finalEnv = { ...process.env, ...env };
    
    console.log(`\n> Executing: ${command}`);
    
    try {
        const output = execSync(command, {
            stdio: 'inherit', // Stream output to the console
            encoding: 'utf-8',
            env: finalEnv,
        });
        return output;
    } catch (error) {
        console.error(`\n❌ Command Failed.`);
        // console.error(error); // Optionally print full error object
        process.exit(1);
    }
}

async function runBackupAndRestore() {
    
    // --- STEP 1: EXPORT FROM EMULATOR ---
    console.log('='.repeat(40));
    console.log('1. Exporting data from Firestore Emulator...');
    console.log('='.repeat(40));

    // NOTE: The 'firestore-export' command automatically uses FIRESTORE_EMULATOR_HOST 
    // when it is set in the environment. We pass the variable directly.
    const exportCommand = `npx firestore-export -b "${BACKUP_FILE_PATH}" -p`;
    
    // Set FIRESTORE_EMULATOR_HOST for the EXPORT command
    runCommand(exportCommand, {
        FIRESTORE_EMULATOR_HOST: EMULATOR_HOST
    });
    
    console.log(`\n✅ Backup saved to: ${BACKUP_FILE_PATH}`);

    // --- STEP 2: IMPORT TO LIVE PROJECT ---
    console.log('\n' + '='.repeat(40));
    console.log('2. Importing data to LIVE Firestore project...');
    console.log('='.repeat(40));

    // NOTE: FIRESTORE_EMULATOR_HOST MUST be unset or it will try to import 
    // the data back into the emulator using the service account, which is confusing.
    // By not including it in the env object, we ensure it's unset for this command.
    
    if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
        console.error(`\nFATAL ERROR: Service Account Key not found at ${SERVICE_ACCOUNT_KEY_PATH}`);
        console.error("Please update SERVICE_ACCOUNT_KEY_PATH and try again.");
        process.exit(1);
    }

    // The 'firestore-import' command requires the credentials JSON file (-a flag)
    // and the backup file (-b flag). The -y flag skips the confirmation prompt.
    const importCommand = `npx firestore-import -a "${SERVICE_ACCOUNT_KEY_PATH}" -b "${BACKUP_FILE_PATH}" -y`;
    
    // IMPORTANT: FIRESTORE_EMULATOR_HOST is deliberately NOT set here.
    runCommand(importCommand);

    console.log(`\n🎉 Data successfully uploaded to live project using: ${SERVICE_ACCOUNT_KEY_PATH}`);
}

runBackupAndRestore();