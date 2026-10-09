import {
  db,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit
} from './firebase';

/**
 * Saves a scan result to Firestore under users/{userId}/scans/{scanId}
 * @param {string} userId
 * @param {object} scanResult
 */
export async function saveScanToFirestore(userId, scanResult) {
  if (!userId || !scanResult || !scanResult.id) return;
  try {
    const scanRef = doc(db, 'users', userId, 'scans', scanResult.id);
    
    // Clean and normalize scan payload for Firestore storage
    const payload = {
      id: scanResult.id,
      target: scanResult.target || '',
      category: scanResult.category || 'url',
      timestamp: Number(scanResult.timestamp) || Date.now(),
      riskScore: Number(scanResult.riskScore) || 0,
      threatLevel: scanResult.threatLevel || 'Safe',
      summary: scanResult.summary || '',
      indicators: Array.isArray(scanResult.indicators) ? scanResult.indicators : [],
      details: scanResult.details || null,
      savedAt: Date.now()
    };

    await setDoc(scanRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving scan to Firestore:', error);
  }
}

/**
 * Fetches the user's previous scan history from Firestore
 * @param {string} userId
 * @param {number} maxResults
 * @returns {Promise<Array>}
 */
export async function fetchUserScansFromFirestore(userId, maxResults = 50) {
  if (!userId) return [];
  try {
    const scansCol = collection(db, 'users', userId, 'scans');
    const q = query(scansCol, orderBy('timestamp', 'desc'), limit(maxResults));
    const snapshot = await getDocs(q);

    const scans = [];
    snapshot.forEach((docSnap) => {
      scans.push(docSnap.data());
    });
    return scans;
  } catch (error) {
    console.error('Error fetching user scans from Firestore:', error);
    return [];
  }
}

/**
 * Deletes all scan history for a user in Firestore
 * @param {string} userId
 */
export async function clearUserScansFromFirestore(userId) {
  if (!userId) return;
  try {
    const scansCol = collection(db, 'users', userId, 'scans');
    const snapshot = await getDocs(scansCol);
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing user scans from Firestore:', error);
  }
}

/**
 * Deletes a single scan by id for a user in Firestore
 * @param {string} userId
 * @param {string} scanId
 */
export async function deleteSingleScanFromFirestore(userId, scanId) {
  if (!userId || !scanId) return;
  try {
    const scanRef = doc(db, 'users', userId, 'scans', scanId);
    await deleteDoc(scanRef);
  } catch (error) {
    console.error('Error deleting single scan from Firestore:', error);
  }
}
