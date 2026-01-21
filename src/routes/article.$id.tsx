import { createFileRoute } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { NewsDataResponse } from '../lib/api-types';
import { isVerifiedAuthor, formatDate, getReadingTime } from '../lib/utils';
import { VerifiedBadge } from '../components/verified-badge';

const API_BASE = 'https://inscribe.news/api';

export const Route = createFileRoute('/article/$id')({
  loader: async ({ params }) => {
    const response = await fetch(`${API_BASE}/data/${params.id}`);
    if (!response.ok) {
      throw new Error('Article not found');
    }
    const data: NewsDataResponse = await response.json();
    return data;
  },

  head: ({ loaderData }) => {
    const { news, meta } = loaderData;
    const title = `${news.title} | 1btc.news`;
    const description = news.body
      ? news.body.slice(0, 160).replace(/\n/g, ' ')
      : 'News inscribed on Bitcoin ordinals';

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: news.title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `https://1btc.news/article/${meta.id}` },
        { property: 'og:site_name', content: '1btc.news' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: news.title },
        { name: 'twitter:description', content: description },
        // Article metadata
        ...(news.author ? [{ property: 'article:author', content: news.author }] : []),
        { property: 'article:published_time', content: meta.timestamp },
      ],
    };
  },

  pendingComponent: LoadingState,
  errorComponent: ErrorState,
  component: ArticlePage,
});

function LoadingState() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="h-10 w-3/4 bg-brand-darkgray rounded animate-pulse mb-4" />
        <div className="h-5 w-1/2 bg-brand-darkgray rounded animate-pulse" />
      </header>
      <div className="space-y-4">
        <div className="h-4 w-full bg-brand-darkgray rounded animate-pulse" />
        <div className="h-4 w-full bg-brand-darkgray rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-brand-darkgray rounded animate-pulse" />
        <div className="h-4 w-full bg-brand-darkgray rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-brand-darkgray rounded animate-pulse" />
      </div>
    </article>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-brand-orange text-6xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Article not found</h1>
      <p className="text-brand-gray mb-6">{error.message}</p>
      <a
        href="/"
        className="inline-block px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-bitcoin-orange transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}

function ArticlePage() {
  const { news, meta } = Route.useLoaderData();
  const verified = isVerifiedAuthor(news.author);
  const readingTime = news.body ? getReadingTime(news.body) : 0;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{news.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-brand-gray text-sm">
          {news.author && (
            <span className="flex items-center gap-1.5">
              By <span className="text-white">{news.author}</span>
              {verified && <VerifiedBadge />}
            </span>
          )}
          <span>{formatDate(meta.timestamp)}</span>
          {meta.news_number && <span className="text-brand-orange">#{meta.news_number}</span>}
          {readingTime > 0 && <span>{readingTime} min read</span>}
        </div>
      </header>

      {news.body && (
        <div className="prose-news">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {news.body}
          </ReactMarkdown>
        </div>
      )}

      {news.url && (
        <div className="mt-8 pt-8 border-t border-brand-darkgray">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-orange hover:text-bitcoin-orange"
          >
            Read original source
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}

      <footer className="mt-8 pt-8 border-t border-brand-darkgray">
        <div className="text-sm text-brand-gray space-y-2">
          <p>
            <span className="text-gray-500">Inscription ID:</span>{' '}
            <a
              href={`https://ordinals.com/inscription/${meta.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs break-all"
            >
              {meta.id}
            </a>
          </p>
          {meta.genesis_tx_id && (
            <p>
              <span className="text-gray-500">Genesis TX:</span>{' '}
              <a
                href={`https://mempool.space/tx/${meta.genesis_tx_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all"
              >
                {meta.genesis_tx_id}
              </a>
            </p>
          )}
        </div>
      </footer>
    </article>
  );
}
