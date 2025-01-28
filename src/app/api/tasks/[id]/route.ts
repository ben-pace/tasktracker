import { table } from '@/lib/airtable';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await table.destroy(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    
    const fields: any = { status };
    if (status === 'completed') {
      const date = new Date();
      fields.dateCompleted = date.toISOString().split('T')[0];
    }
    
    const records = await table.update([
      {
        id: params.id,
        fields
      }
    ]);
    
    return NextResponse.json(records[0]);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}