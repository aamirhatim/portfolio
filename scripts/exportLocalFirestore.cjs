const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ====================================================================
// --- CONFIGURATION ---
// ====================================================================

// 1. Google Cloud Storage Bucket Name (The destination for your backup files)
const GCS_BUCKET_NAME = 'gs://portfolio-emulator-data';

// 2. Local directory where the emulator snapshot MUST BE saved (Assumed to be pre-exported)
const LOCAL_EXPORT_DIR = './emulators_data/firestore_export';

// 3. Emulator Host (Not used directly, but kept for context if needed later)
const EMULATOR_HOST = 'localhost:5001'; 

// 4. Combined GCS URI (This variable defines the *desired* staging path)
// NOTE: The actual path used for gcloud import will be GCS_BUCKET_NAME/temp_firestore_export
const GCS_EXPORT_URI = `${GCS_BUCKET_NAME}/firestore_export`; 

// ====================================================================
// --- UTILITY FUNCTION ---
// ====================================================================

/**
 * Executes a shell command, streams output, and handles errors.
 * @param {string} command - The shell command to execute.
 * @param {object} env - Environment variables specific to this command.
 */
function runCommand(command, env = {}) {
    const finalEnv = { ...process.env, ...env };
    
    console.log(`\n> Executing: ${command}`);
    
    try {
        execSync(command, {
            stdio: 'inherit', // Stream output to the console
            encoding: 'utf-8',
            env: finalEnv,
        });
        console.log(`\n✅ Command Succeeded.`);
    } catch (error) {
        console.error(`\n❌ Command Failed.`);
        console.error(`Please check the logs above for details.`);
        process.exit(1);
    }
}

// ====================================================================
// --- MAIN PROCESS ---
// ====================================================================

async function migrateData() {
    
    // --- VALIDATION: Check for pre-exported data ---
    if (!fs.existsSync(LOCAL_EXPORT_DIR)) {
        console.error(`\nFATAL ERROR: Local export directory not found at ${LOCAL_EXPORT_DIR}`);
        console.error("The script assumes the data has already been exported to this path. Please export the emulator data first.");
        process.exit(1);
    }
    
    // NOTE: GCS path structure: gs://portfolio-emulator-data/temp_firestore_export
    // The GCS directory will have the same name as the local source directory.
    const GCS_FINAL_IMPORT_PATH = `${GCS_BUCKET_NAME}/${path.basename(LOCAL_EXPORT_DIR)}`;

    // --- STEP 1: UPLOAD LOCAL EXPORT TO GOOGLE CLOUD STORAGE (GCS) ---
    console.log('='.repeat(40));
    console.log(`1. Uploading local data from ${LOCAL_EXPORT_DIR} to GCS bucket: ${GCS_BUCKET_NAME}`);
    console.log('='.repeat(40));
    
    // The gsutil cp -r command copies the entire directory into the bucket.
    const uploadCommand = `gsutil cp -r ${LOCAL_EXPORT_DIR} ${GCS_BUCKET_NAME}`;
    
    runCommand(uploadCommand);
    
    console.log(`\nLocal files now staged at GCS path: ${GCS_FINAL_IMPORT_PATH}`);

    
    // --- STEP 2: IMPORT DATA FROM GCS TO LIVE FIRESTORE ---
    console.log('\n' + '='.repeat(40));
    console.log('2. Importing data from GCS into LIVE Firestore...');
    console.log('='.repeat(40));

    // The gcloud firestore import command uses the full GCS path to the exported data directory.
    const importCommand = `gcloud firestore import ${GCS_FINAL_IMPORT_PATH}`;
    
    // IMPORTANT: FIRESTORE_EMULATOR_HOST is deliberately NOT set here, 
    // ensuring the command targets the live project.
    runCommand(importCommand);

    console.log(`\n🎉🎉 Data successfully migrated from local files to live Firestore! 🎉🎉`);
    
    // --- STEP 3: CLEANUP GCS BUCKET ---
    console.log('\n' + '='.repeat(40));
    console.log('3. Cleaning up temporary files in GCS bucket...');
    console.log('='.repeat(40));

    // Remove the entire temporary directory from the GCS bucket
    const cleanupGCSCommand = `gsutil rm -r ${GCS_FINAL_IMPORT_PATH}`;
    runCommand(cleanupGCSCommand);
    
    console.log(`✅ Cleaned up GCS directory: ${GCS_FINAL_IMPORT_PATH}`);


    // --- NOTE: LOCAL CLEANUP SKIPPED ---
    console.log('\n' + '='.repeat(40));
    console.log(`Local export data has been preserved at: ${LOCAL_EXPORT_DIR}`);
    console.log('='.repeat(40));
}

migrateData();