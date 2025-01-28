import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base(process.env.AIRTABLE_TABLE_NAME!);

export { table };