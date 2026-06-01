import { readDB } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  if (!q || !q.trim()) {
    return Response.json([]);
  }

  const keyword = q.trim().toLowerCase();
  const db = readDB();
  const results = [];

  const sources = [
    {
      key: 'posts',
      type: '貼文',
      items: db.posts || [],
      searchFields: ['title', 'content'],
      link: (item) => `/social#${item.id}`,
    },
    {
      key: 'products',
      type: '商品',
      items: db.products || [],
      searchFields: ['name', 'description'],
      link: () => '/shop',
    },
    {
      key: 'emails',
      type: '信件',
      items: db.emails || [],
      searchFields: ['subject', 'body'],
      link: () => '/email',
    },
    {
      key: 'courses',
      type: '課程',
      items: db.courses || [],
      searchFields: ['name'],
      link: () => '/school',
    },
    {
      key: 'projects',
      type: '專案',
      items: db.projects || [],
      searchFields: ['name', 'description'],
      link: (item) => `/projects?project=${item.id}`,
    },
  ];

  for (const source of sources) {
    if (type && source.type !== type) continue;

    for (const item of source.items) {
      const match = source.searchFields.some((field) => {
        const value = item[field];
        return value && value.toLowerCase().includes(keyword);
      });

      if (match) {
        results.push({
          id: item.id,
          type: source.type,
          title: item.title || item.name || item.subject || '',
          description: item.content || item.description || item.body || '',
          link: source.link(item),
        });
      }
    }
  }

  return Response.json(results);
}
