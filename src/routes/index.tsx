import { createFileRoute } from '@tanstack/react-router';
import type { NewsItem } from '../lib/api-types';
import { isVerifiedAuthor, formatDate, truncate } from '../lib/utils';
import { VerifiedBadge } from '../components/verified-badge';

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

  pendingComponent: LoadingState,
  errorComponent: ErrorState,
  component: HomePage,
});

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-9 w-48 bg-brand-darkgray rounded animate-pulse mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-brand-darkgray rounded-lg p-6">
            <div className="h-6 w-3/4 bg-brand-darkgray rounded animate-pulse mb-3" />
            <div className="h-4 w-1/2 bg-brand-darkgray rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-brand-darkgray rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="text-brand-orange text-6xl mb-4">!</div>
      <h1 className="text-2xl font-bold text-white mb-2">Failed to load news</h1>
      <p className="text-brand-gray mb-6">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-bitcoin-orange transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

function HomePage() {
  const { items } = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent News</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-gray mb-4">No news inscriptions found.</p>
          <a
            href="/post"
            className="inline-block px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-bitcoin-orange transition-colors"
          >
            Be the first to post
          </a>
        </div>
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
  const verified = isVerifiedAuthor(news.author);

  return (
    <article className="border border-brand-darkgray rounded-lg p-6 hover:border-brand-orange/50 transition-colors">
      <a href={`/article/${meta.id}`} className="block group">
        <h2 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors mb-2">
          {news.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-gray">
          {news.author && (
            <span className="flex items-center gap-1.5">
              By {news.author}
              {verified && <VerifiedBadge />}
            </span>
          )}
          <span>{formatDate(meta.timestamp)}</span>
          {meta.news_number && (
            <span className="text-brand-orange">#{meta.news_number}</span>
          )}
        </div>
        {news.body && (
          <p className="mt-3 text-gray-400 line-clamp-2">{truncate(news.body, 200)}</p>
        )}
      </a>
    </article>
  );
}
