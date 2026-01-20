import { createFileRoute } from '@tanstack/react-router';
import type { NewsItem } from '../lib/api-types';

const API_BASE = 'https://inscribe.news/api';

export const Route = createFileRoute('/')({
  loader: async () => {
    const response = await fetch(`${API_BASE}/data/`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return { items: data as NewsItem[] };
  },
  component: HomePage,
});

function HomePage() {
  const { items } = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent News</h1>

      {items.length === 0 ? (
        <p className="text-brand-gray">No news inscriptions found.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <NewsCard key={item.meta.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const { meta, news } = item;
  const date = new Date(meta.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="border border-brand-darkgray rounded-lg p-6 hover:border-brand-orange/50 transition-colors">
      <a href={`/article/${meta.id}`} className="block group">
        <h2 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors mb-2">
          {news.title}
        </h2>
        <div className="flex items-center gap-4 text-sm text-brand-gray">
          {news.author && <span>By {news.author}</span>}
          <span>{date}</span>
          {meta.news_number && <span>#{meta.news_number}</span>}
        </div>
        {news.body && (
          <p className="mt-3 text-gray-400 line-clamp-2">
            {news.body.slice(0, 200)}
            {news.body.length > 200 ? '...' : ''}
          </p>
        )}
      </a>
    </article>
  );
}
