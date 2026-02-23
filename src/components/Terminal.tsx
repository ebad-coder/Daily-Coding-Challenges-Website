import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  output: string[];
}

export default function Terminal({ output }: TerminalProps) {
  return (
    <div className="h-64 bg-gray-950 border-t border-gray-700 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700">
        <TerminalIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Terminal</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {output.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.includes('✓') ? 'text-green-400' :
              line.includes('✗') ? 'text-red-400' :
              line.includes('Sending') ? 'text-blue-400' :
              'text-gray-300'
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
