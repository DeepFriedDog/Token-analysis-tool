import { TokenAnalysis } from '../components/TokenAnalysis';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          DCA Strategy Analysis
        </h2>
        <TokenAnalysis />
      </div>
    </main>
  );
} 