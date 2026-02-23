import { useState, useEffect } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { supabase } from '../lib/supabase';
import type { Challenge } from '../lib/database.types';
import Terminal from './Terminal';

type Language = 'cpp' | 'python';

export default function ChallengeWorkspace() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [language, setLanguage] = useState<Language>('cpp');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  useEffect(() => {
    if (challenge) {
      setCode(language === 'cpp' ? challenge.starter_code_cpp : challenge.starter_code_python);
    }
  }, [language, challenge]);

  async function loadDailyChallenge() {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_daily', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setChallenge(data);
        setCode(data.starter_code_cpp);
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunCode() {
    if (!challenge) return;

    setIsRunning(true);
    setShowTerminal(true);
    setTerminalOutput(['Compiling...']);

    await new Promise(resolve => setTimeout(resolve, 800));

    const outputs: string[] = ['Compilation successful!\n'];

    for (let i = 0; i < challenge.test_cases.length; i++) {
      const testCase = challenge.test_cases[i];
      outputs.push(`Test Case ${i + 1}:`);
      outputs.push(`Input: ${testCase.input}`);
      outputs.push(`Expected: ${testCase.expected}`);

      await new Promise(resolve => setTimeout(resolve, 300));

      const passed = Math.random() > 0.3;
      if (passed) {
        outputs.push(`✓ Passed\n`);
      } else {
        outputs.push(`✗ Failed: Got different output\n`);
      }
      setTerminalOutput([...outputs]);
    }

    setIsRunning(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Daily Challenge Available</h2>
          <p className="text-gray-400">Check back later or contact an admin to add challenges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daily Coding Challenge</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">{challenge.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                challenge.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {challenge.difficulty}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{challenge.description}</p>
              </div>

              {challenge.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Examples</h3>
                  {challenge.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-3">
                      <div className="mb-2">
                        <span className="text-gray-400 font-medium">Input:</span>
                        <pre className="text-gray-300 mt-1">{example.input}</pre>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-400 font-medium">Output:</span>
                        <pre className="text-gray-300 mt-1">{example.output}</pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-gray-400 font-medium">Explanation:</span>
                          <p className="text-gray-300 mt-1">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {challenge.constraints.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Constraints</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {challenge.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          {showTerminal && (
            <Terminal output={terminalOutput} />
          )}
        </div>
      </div>
    </div>
  );
}
