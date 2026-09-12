import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Scale, Trash2, Plus } from 'lucide-react';
import Button from '../components/Button';
import BackLink from '../components/BackLink';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';

const rows = [
  { key: 'duration', label: 'Duration' },
  { key: 'fit', label: 'Fit for you', render: (v) => <span className="font-bold text-brand-700">{v}%</span> },
  { key: 'growth', label: 'Growth', render: (v) => <span className="text-success font-semibold">{v}</span> },
  { key: 'salary', label: 'Avg. salary' },
  { key: 'note', label: 'Note' },
];

export default function Compare() {
  useScrollTop();
  const { userType, comparisonItems, setComparisonItems, answers, setAnswers } = useUser();
  const navigate = useNavigate();
  const recPath = userType ? `/recommendations/${userType}` : '/get-started';

  const handleSaveAndContinue = () => {
    setAnswers({ ...answers, lastSavedAt: new Date().toISOString() });
    navigate('/dashboard');
  };

  const removeItem = (index) => {
    setComparisonItems(comparisonItems.filter((_, i) => i !== index));
  };

  if (comparisonItems.length === 0) {
    return (
      <div className="min-h-screen bg-paper-gradient flex items-center justify-center py-16">
        <FadeIn className="text-center max-w-md mx-auto px-5">
          <span className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-6 shadow-brand">
            <Scale className="w-7 h-7 text-white" strokeWidth={1.5} />
          </span>
          <h1 className="font-ui font-bold text-3xl text-ink tracking-[-0.03em]">
            Nothing to compare yet
          </h1>
          <p className="mt-3 text-ink-2 leading-relaxed">
            As you explore recommendations, add the options you&rsquo;re torn between.
            You&rsquo;ll be able to weigh them side by side here.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={recPath} className="w-full sm:w-auto">
              <Button fullWidth className="sm:w-auto">
                See recommendations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/advisor" className="w-full sm:w-auto">
              <Button variant="secondary" fullWidth className="sm:w-auto">
                Ask the advisor instead
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        <div className="flex items-center justify-between mb-8">
          <BackLink />
          <Link to={recPath}>
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4" />
              Add more
            </Button>
          </Link>
        </div>

        <FadeIn className="mb-10">
          <p className="inline-flex items-center gap-2 eyebrow text-brand-600 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 glow-dot" />
            Side by side
          </p>
          <h1 className="font-ui font-bold text-4xl text-ink tracking-[-0.03em] text-balance">
            Compare your options
          </h1>
          <p className="mt-3 text-ink-2 leading-relaxed">
            The same facts, laid out plainly. Decide on the things that actually differ.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-[1.6rem] bg-white border border-line shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-paper">
                    <th className="p-5 text-left w-44 align-bottom">
                      <span className="eyebrow text-ink-3">Feature</span>
                    </th>
                    {comparisonItems.map((item, index) => (
                      <th key={index} className="p-5 text-left min-w-[200px] align-top">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-ui font-semibold text-ink text-lg leading-snug">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1.5 -mr-1.5 rounded-lg text-ink-3 hover:text-error hover:bg-error-soft transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.key} className={i % 2 === 1 ? 'bg-paper/50' : ''}>
                      <td className="p-4 text-sm font-medium text-ink-3 border-t border-line">
                        {row.label}
                      </td>
                      {comparisonItems.map((item, index) => (
                        <td key={index} className="p-4 border-t border-line text-sm text-ink-2">
                          {row.render
                            ? row.render(item[row.key] || '\u2014')
                            : (item[row.key] || '\u2014')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" fullWidth className="sm:w-auto" onClick={handleSaveAndContinue}>
            Save and continue
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Link to="/advisor" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" fullWidth className="sm:w-auto">
              Ask a follow-up
            </Button>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}