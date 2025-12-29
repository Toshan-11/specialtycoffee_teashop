'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Coffee, Leaf, Sparkles } from 'lucide-react';
import { submitQuiz } from '@/actions';
import ProductCard from '@/components/shop/ProductCard';

const steps = [
  {
    question: 'What calls to you?',
    subtitle: 'Tell us your beverage of choice',
    field: 'prefersCoffee',
    options: [
      { value: true, label: 'Coffee', icon: '☕', desc: 'Bold, roasted, energizing' },
      { value: false, label: 'Tea', icon: '🍵', desc: 'Delicate, nuanced, soothing' },
    ],
  },
  {
    question: 'What flavors excite you?',
    subtitle: 'Select all that appeal to you',
    field: 'flavorProfile',
    multi: true,
    options: [
      { value: 'chocolate', label: 'Chocolate', desc: 'Rich & indulgent' },
      { value: 'fruity', label: 'Fruity', desc: 'Bright & vibrant' },
      { value: 'floral', label: 'Floral', desc: 'Delicate & aromatic' },
      { value: 'nutty', label: 'Nutty', desc: 'Warm & toasty' },
      { value: 'spice', label: 'Spicy', desc: 'Bold & exotic' },
      { value: 'earthy', label: 'Earthy', desc: 'Deep & grounding' },
      { value: 'sweet', label: 'Sweet', desc: 'Caramel & honey' },
      { value: 'citrus', label: 'Citrus', desc: 'Zesty & refreshing' },
    ],
  },
  {
    question: 'How strong do you like it?',
    subtitle: 'Your ideal intensity level',
    field: 'strengthPref',
    options: [
      { value: 'mild', label: 'Mild', desc: 'Gentle & smooth' },
      { value: 'medium', label: 'Medium', desc: 'Balanced & versatile' },
      { value: 'strong', label: 'Strong', desc: 'Bold & powerful' },
    ],
  },
  {
    question: 'How adventurous are you?',
    subtitle: 'Do you prefer classics or discoveries?',
    field: 'adventureLevel',
    options: [
      { value: 'classic', label: 'Classic', desc: 'Tried & true favorites' },
      { value: 'balanced', label: 'Balanced', desc: 'Open to new things' },
      { value: 'adventurous', label: 'Adventurous', desc: 'Surprise me!' },
    ],
  },
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    prefersCoffee: null,
    flavorProfile: [],
    strengthPref: '',
    adventureLevel: '',
  });
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    const value = answers[step.field];
    if (step.multi) return value.length > 0;
    if (typeof value === 'boolean') return value !== null;
    return !!value;
  };

  const handleSelect = (value: any) => {
    if (step.multi) {
      setAnswers((prev) => ({
        ...prev,
        [step.field]: prev[step.field].includes(value)
          ? prev[step.field].filter((v: any) => v !== value)
          : [...prev[step.field], value],
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [step.field]: value }));
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit
      setLoading(true);
      try {
        const recommended = await submitQuiz(answers);
        setResults(recommended);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Results view
  if (results) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <Sparkles className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl text-brand-cream mb-4">
            Your Perfect Match
          </h1>
          <p className="text-brand-light text-lg max-w-lg mx-auto">
            Based on your taste preferences, we think you&apos;ll love these
          </p>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {results.map((product: any, i: number) => (
            <div key={product.id} className="relative">
              {i === 0 && (
                <div className="absolute -top-3 left-4 z-10 px-3 py-1 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider">
                  Top Pick
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setResults(null);
              setCurrentStep(0);
              setAnswers({
                prefersCoffee: null,
                flavorProfile: [],
                strengthPref: '',
                adventureLevel: '',
              });
            }}
            className="btn-secondary"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16">
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-brand-muted uppercase tracking-wider">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-brand-gold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-brand-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-brand-cream mb-2">
          {step.question}
        </h1>
        <p className="text-brand-muted">{step.subtitle}</p>
        {step.multi && (
          <p className="text-xs text-brand-gold mt-1">Select multiple</p>
        )}
      </div>

      {/* Options */}
      <div className={`grid gap-4 w-full max-w-2xl mb-12 ${
        step.options.length <= 3
          ? 'grid-cols-1 sm:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-4'
      }`}>
        {step.options.map((option: any) => {
          const isSelected = step.multi
            ? answers[step.field].includes(option.value)
            : answers[step.field] === option.value;

          return (
            <button
              key={String(option.value)}
              onClick={() => handleSelect(option.value)}
              className={`p-6 border text-center transition-all duration-200 ${
                isSelected
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                  : 'border-brand-gray bg-brand-dark text-brand-light hover:border-brand-light'
              }`}
            >
              {option.icon && (
                <span className="text-3xl block mb-2">{option.icon}</span>
              )}
              <span className="block font-medium text-sm mb-1">
                {option.label}
              </span>
              <span className="block text-xs text-brand-muted">
                {option.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading
            ? 'Finding your perfect brew...'
            : currentStep === steps.length - 1
            ? 'See My Results'
            : 'Next'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
