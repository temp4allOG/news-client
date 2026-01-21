import { Link, createFileRoute } from '@tanstack/react-router';
import type { NewsItem } from '../lib/api-types';
import { API_BASE } from '../lib/constants';
import { formatDate, truncate } from '../lib/utils';
import { AuthorDisplay } from '../components/author-display';
import { ErrorState } from '../components/error-state';
import { NewsListSkeleton } from '../components/loading-skeleton';

export const Route = createFileRoute('/')({
  loader: async () => {
    const response = await fetch(`${API_BASE}/data/`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return { items: data as NewsItem[] };
  },

  pendingComponent: NewsListSkeleton,
  errorComponent: ({ error }) => (
    <ErrorState
      title="Failed to load news"
      message={error.message}
      ctaText="Try Again"
      onRetry={() => window.location.reload()}
    />
  ),
  component: HomePage,
});

function HomePage() {
  const { items } = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent News</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-gray mb-4">No news inscriptions found.</p>
          <Link to="/post" className="btn-primary inline-block">
            Be the first to post
          </Link>
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

  return (
    <article className="border border-brand-darkgray rounded-lg p-6 hover:border-brand-orange/50 transition-colors">
      <Link to="/article/$id" params={{ id: meta.id }} className="block group">
        <h2 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors mb-2">
          {news.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-gray">
          {news.author && <AuthorDisplay author={news.author} />}
          <span>{formatDate(meta.timestamp)}</span>
          {meta.news_number && (
            <span className="text-brand-orange">#{meta.news_number}</span>
          )}
        </div>
        {news.body && (
          <p className="mt-3 text-gray-400 line-clamp-2">{truncate(news.body, 200)}</p>
        )}
      </Link>
    </article>
  );
}
