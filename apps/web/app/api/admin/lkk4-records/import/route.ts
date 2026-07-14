import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

interface LKK4Record {
  year: number;
  competitionGroup: string;
  teamName: string | null;
  rank: number | null;
  name: string;
  gender: string;
  bodyWeight: number | null;
  firstAttempt: number | null;
  firstAttemptResult: string | null;
  secondAttempt: number | null;
  secondAttemptResult: string | null;
  thirdAttempt: number | null;
  thirdAttemptResult: string | null;
  finalScore: number;
  ipfGlPoint: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

function parseNumber(value: string): number | null {
  if (!value || value === '' || value === 'n') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function parseRank(value: string): number | null {
  if (!value || value === '') return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

// Helper function to delete all records
async function deleteAllRecords(): Promise<number> {
  const recordsRef = db.collection('lkk4_records');
  const snapshot = await recordsRef.get();

  if (snapshot.empty) {
    return 0;
  }

  const batchSize = 500;
  let totalDeleted = 0;
  const docs = snapshot.docs;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + batchSize);

    for (const doc of chunk) {
      batch.delete(doc.ref);
    }

    await batch.commit();
    totalDeleted += chunk.length;
  }

  return totalDeleted;
}

export async function POST(request: Request) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const { csvData } = await request.json();

    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json(
        { error: '請提供 CSV 資料' },
        { status: 400 }
      );
    }

    // Parse CSV
    const lines = csvData.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV 資料格式錯誤' },
        { status: 400 }
      );
    }

    // Skip header row
    const dataLines = lines.slice(1);
    const records: LKK4Record[] = [];

    for (const line of dataLines) {
      const fields = parseCSVLine(line);
      if (fields.length < 15) continue;

      const [
        year,
        competitionGroup,
        teamName,
        rank,
        name,
        gender,
        bodyWeight,
        firstAttempt,
        firstAttemptResult,
        secondAttempt,
        secondAttemptResult,
        thirdAttempt,
        thirdAttemptResult,
        finalScore,
        ipfGlPoint,
      ] = fields;

      // Skip empty names
      if (!name || name.trim() === '') continue;

      records.push({
        year: parseInt(year) || 0,
        competitionGroup: competitionGroup || '',
        teamName: teamName || null,
        rank: parseRank(rank),
        name: name.trim(),
        gender: gender || '',
        bodyWeight: parseNumber(bodyWeight),
        firstAttempt: parseNumber(firstAttempt),
        firstAttemptResult: firstAttemptResult || null,
        secondAttempt: parseNumber(secondAttempt),
        secondAttemptResult: secondAttemptResult || null,
        thirdAttempt: parseNumber(thirdAttempt),
        thirdAttemptResult: thirdAttemptResult || null,
        finalScore: parseNumber(finalScore) || 0,
        ipfGlPoint: parseNumber(ipfGlPoint) || 0,
      });
    }

    if (records.length === 0) {
      return NextResponse.json(
        { error: '沒有有效的資料可匯入' },
        { status: 400 }
      );
    }

    // Delete existing records first (auto-overwrite mode)
    const deletedCount = await deleteAllRecords();

    // Write to Firestore in batches (max 500 per batch)
    const batchSize = 500;
    let totalWritten = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = db.batch();
      const chunk = records.slice(i, i + batchSize);

      for (const record of chunk) {
        const docRef = db.collection('lkk4_records').doc();
        batch.set(docRef, {
          ...record,
          createdAt: new Date(),
        });
      }

      await batch.commit();
      totalWritten += chunk.length;
    }

    return NextResponse.json({
      success: true,
      message: deletedCount > 0
        ? `已覆蓋 ${deletedCount} 筆舊資料，成功匯入 ${totalWritten} 筆新資料`
        : `成功匯入 ${totalWritten} 筆資料`,
      count: totalWritten,
      deletedCount,
    });
  } catch (error) {
    console.error('Error importing LKK4 records:', error);
    return NextResponse.json(
      { error: '匯入失敗，請稍後再試' },
      { status: 500 }
    );
  }
}

// Delete all records (for manual cleanup)
export async function DELETE() {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const totalDeleted = await deleteAllRecords();

    return NextResponse.json({
      success: true,
      message: totalDeleted > 0 ? `成功刪除 ${totalDeleted} 筆資料` : '沒有資料需要刪除',
      count: totalDeleted,
    });
  } catch (error) {
    console.error('Error deleting LKK4 records:', error);
    return NextResponse.json(
      { error: '刪除失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
