import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { OrdinalNews } from '../lib/api-types';

export const Route = createFileRoute('/post')({
  component: PostNewsPage,
});

function PostNewsPage() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateJson = useCallback((): OrdinalNews | null => {
    if (!title.trim()) {
      setError('Title is required');
      return null;
    }

    if (!url.trim() && !body.trim()) {
      setError('Either URL or Body is required');
      return null;
    }

    setError('');

    const news: OrdinalNews = {
      p: 'ons',
      op: 'post',
      title: title.trim(),
      ...(url.trim() && { url: url.trim() }),
      ...(author.trim() && { author: author.trim() }),
      ...(body.trim() && { body: body.trim() }),
    };

    return news;
  }, [title, url, body, author]);

  const handleGenerate = () => {
    const json = generateJson();
    if (json) {
      setShowJson(true);
    }
  };

  const handleCopy = async () => {
    const json = generateJson();
    if (!json) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const jsonOutput = generateJson();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Inscribe the News</h1>
        <p className="text-brand-gray">
          on Bitcoin, forever{' '}
          <span className="text-bitcoin-orange">&#8383;</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-brand-darkgray rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title <span className="text-brand-orange">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The main headline"
                className="w-full px-4 py-2 bg-brand-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-4 py-2 bg-brand-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                Author
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or handle"
                className="w-full px-4 py-2 bg-brand-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-1">
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your article content (supports Markdown)"
                rows={8}
                className="w-full px-4 py-2 bg-brand-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange resize-y font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 px-4 py-2 border border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-colors"
              >
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-bitcoin-orange transition-colors"
              >
                Generate JSON
              </button>
            </div>
          </div>
        </div>

        {/* Preview / JSON Output */}
        <div>
          {showPreview && (
            <div className="bg-brand-darkgray rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Preview</h2>
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {title || 'Untitled'}
                </h3>
                {author && (
                  <p className="text-sm text-brand-gray mb-4">By {author}</p>
                )}
                {url && (
                  <p className="text-sm text-brand-orange mb-4 break-all">{url}</p>
                )}
                {body && (
                  <div className="prose-news">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {body}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {showJson && jsonOutput && (
            <div className="bg-brand-darkgray rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Ordinal News JSON</h2>
                <button
                  onClick={handleCopy}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-dark text-brand-orange hover:bg-brand-orange hover:text-white'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-brand-dark p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300">
                {JSON.stringify(jsonOutput, null, 2)}
              </pre>
              <div className="mt-4 p-4 bg-brand-dark rounded-lg text-sm text-brand-gray">
                <p className="mb-2">
                  <strong className="text-white">Next steps:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy the JSON above</li>
                  <li>
                    Go to an inscription service like{' '}
                    <a
                      href="https://ordinalsbot.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-orange hover:text-bitcoin-orange"
                    >
                      OrdinalsBot
                    </a>
                  </li>
                  <li>Paste the JSON as a text inscription</li>
                  <li>Complete the inscription process</li>
                </ol>
              </div>
            </div>
          )}

          {!showPreview && !showJson && (
            <div className="bg-brand-darkgray rounded-xl p-6 text-center text-brand-gray">
              <p className="mb-4">
                Fill out the form and click <strong className="text-white">Generate JSON</strong> to
                create your ordinal news inscription.
              </p>
              <p className="text-sm">
                Learn more about the{' '}
                <a
                  href="https://inscribe.news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:text-bitcoin-orange"
                >
                  Ordinal News Standard
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
