import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Example, TestCase } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  // NEW: The two variables that control the lock screen
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Your original state variables
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState<string[]>(['']);
  const [examples, setExamples] = useState<Example[]>([{ input: '', output: '', explanation: '' }]);
  const [starterCodeCpp, setStarterCodeCpp] = useState('// Write your solution here');
  const [starterCodePython, setStarterCodePython] = useState('# Write your solution here');
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', expected: '' }]);
  const [isDaily, setIsDaily] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addConstraint = () => setConstraints([...constraints, '']);
  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };
  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const addExample = () => setExamples([...examples, { input: '', output: '', explanation: '' }]);
  const updateExample = (index: number, field: keyof Example, value: string) => {
    const updated = [...examples];
    updated[index] = { ...updated[index], [field]: value };
    setExamples(updated);
  };
  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const addTestCase = () => setTestCases([...testCases, { input: '', expected: '' }]);
  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };
  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      if (isDaily) {
        await supabase
          .from('challenges')
          .update({ is_daily: false })
          .eq('is_daily', true);
      }

      const { error: insertError } = await supabase
        .from('challenges')
        .insert({
          title,
          difficulty,
          description,
          constraints: constraints.filter(c => c.trim()),
          examples: examples.filter(e => e.input || e.output),
          starter_code_cpp: starterCodeCpp,
          starter_code_python: starterCodePython,
          test_cases: testCases.filter(t => t.input || t.expected),
          is_daily: isDaily,
          daily_date: isDaily ? new Date().toISOString().split('T')[0] : null,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTitle('');
      setDescription('');
      setConstraints(['']);
      setExamples([{ input: '', output: '', explanation: '' }]);
      setStarterCodeCpp('// Write your solution here');
      setStarterCodePython('# Write your solution here');
      setTestCases([{ input: '', expected: '' }]);
      setIsDaily(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
    }
  }

  // NEW: The lock screen logic. If they haven't typed the right password, show this.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              // THIS IS WHERE YOU CHANGE YOUR PASSWORD
              if (password === 'ebadiscool123') { 
                setIsAuthenticated(true);
              } else {
                alert('Incorrect password');
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Unlock Panel
          </button>
        </div>
      </div>
    );
  }

  // If they ARE authenticated, show the normal form
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Panel - Add Challenge</h1>

        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6">
            Challenge created successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Constraints</label>
              <button
                type="button"
                onClick={addConstraint}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {constraints.map((constraint, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(idx, e.target.value)}
                  placeholder="e.g., 1 <= n <= 10^5"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {constraints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Examples</label>
              <button
                type="button"
                onClick={addExample}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {examples.map((example, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Example {idx + 1}</span>
                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => updateExample(idx, 'input', e.target.value)}
                    placeholder="Input"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={example.output}
                    onChange={(e) => updateExample(idx, 'output', e.target.value)}
                    placeholder="Output"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={example.explanation || ''}
                    onChange={(e) => updateExample(idx, 'explanation', e.target.value)}
                    placeholder="Explanation (optional)"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">C++ Starter Code</label>
            <textarea
              value={starterCodeCpp}
              onChange={(e) => setStarterCodeCpp(e.target.value)}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Python Starter Code</label>
            <textarea
              value={starterCodePython}
              onChange={(e) => setStarterCodePython(e.target.value)}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {testCases.map((testCase, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                  placeholder="Input"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={testCase.expected}
                  onChange={(e) => updateTestCase(idx, 'expected', e.target.value)}
                  placeholder="Expected Output"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTestCase(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDaily"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isDaily" className="text-sm">
              Set as today's daily challenge
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            Create Challenge
          </button>
        </form>
      </div>
    </div>
  );
}