import { table } from '@/lib/airtable';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('GET /api/tasks called');
  try {
    const records = await table.select({}).all();
    const tasks = records.map(record => ({
      id: record.id,
      title: record.get('title') as string,
      status: record.get('status') as string,
      tag: record.get('tag') as 'personal' | 'work',
      dateCompleted: record.get('dateCompleted') as string,
      dateCreated: record.get('dateCreated') as string || record._rawJson.createdTime // fallback to Airtable's built-in creation time
    }));
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('POST /api/tasks called');
  try {
    const { title, tag, actionable } = await request.json();
    console.log('POST body:', { title, tag, actionable });
    
    const date = new Date();
    const dateCreated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    const records = await table.create([
      {
        fields: {
          title,
          tag,
          status: 'pending',
          dateCreated,
          actionable
        }
      }
    ]);
    return NextResponse.json(records[0]);
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}