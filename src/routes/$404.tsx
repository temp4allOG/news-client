import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$404')({
  component: NotFound,
});

function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-brand-orange mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-brand-orange text-white font-semibold rounded-lg hover:bg-bitcoin-orange transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}
