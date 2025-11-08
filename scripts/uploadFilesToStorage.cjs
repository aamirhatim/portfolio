// restoreStorage.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// 1. Path to your downloaded Service Account Key JSON file
const SERVICE_ACCOUNT_PATH = '../serviceAccountKey.json'; 
// 2. The root folder where you exported your emulator data
const EXPORT_ROOT = './emulators_data/storage_export'; 
// ---------------------

// Initialize Firebase Admin SDK
try {
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // This is your bucket name, found in your buckets.json or Firebase Console
        storageBucket: serviceAccount.project_id + '.firebasestorage.app'
    });
} catch (error) {
    console.error("Error initializing Admin SDK. Check SERVICE_ACCOUNT_PATH and ensure the key is valid.");
    console.error(error.message);
    process.exit(1);
}

const bucket = admin.storage().bucket();
const METADATA_DIR = path.join(EXPORT_ROOT, 'metadata');
const BLOBS_DIR = path.join(EXPORT_ROOT, 'blobs');

async function restoreStorage() {
    console.log(`Starting storage restore to bucket: ${bucket.name}`);
    
    // 1. Get list of all metadata files
    let metadataFiles;
    try {
        metadataFiles = fs.readdirSync(METADATA_DIR).filter(f => f.endsWith('.json'));
    } catch (e) {
        console.error(`Error reading metadata directory: ${METADATA_DIR}`);
        console.error("Make sure your export path is correct and the directory exists.");
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const metadataFileName of metadataFiles) {
        try {
            const metadataPath = path.join(METADATA_DIR, metadataFileName);
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            
            // The file name in the metadata is the original file path (e.g., 'images/profile.jpg')
            const originalFilePath = metadata.name;
            // The blob name (the hash) is the file name without the .json extension
            const blobFileName = metadataFileName.replace('.json', '');
            
            const localBlobPath = path.join(BLOBS_DIR, blobFileName);

            // Check if the physical blob file exists
            if (!fs.existsSync(localBlobPath)) {
                console.warn(`[WARN] Blob file not found for metadata ${originalFilePath}. Skipping.`);
                failCount++;
                continue;
            }
            
            // 2. Upload the file using the original path and metadata
            const [file] = await bucket.upload(localBlobPath, {
                destination: originalFilePath,
                metadata: {
                    contentType: metadata.contentType,
                    cacheControl: metadata.cacheControl || 'no-cache',
                    // Preserve custom metadata if any
                    metadata: metadata.metadata
                }
            });

            console.log(`[SUCCESS] Restored: ${originalFilePath}`);
            successCount++;

        } catch (error) {
            console.error(`[FAIL] Could not restore file: ${metadataFileName}`);
            console.error(error.message);
            failCount++;
        }
    }

    console.log(`\n--- RESTORE COMPLETE ---`);
    console.log(`Successful uploads: ${successCount}`);
    console.log(`Failed uploads: ${failCount}`);
}

restoreStorage();