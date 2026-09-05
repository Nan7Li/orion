import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<{
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}> = ({ children, className, inline }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (inline) {
    return (
      <code className="bg-zinc-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-zinc-200 dark:border-zinc-700/60">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 dark:bg-zinc-900/90 border-b border-zinc-700/50 text-xs text-zinc-400 font-mono">
        <span className="uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs"
          title="复制全部代码"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13.5px] font-mono leading-relaxed text-zinc-200">
        <pre>{children}</pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose-forum ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
            return (
              <CodeBlock inline={inline} className={className} {...props}>
                {children}
              </CodeBlock>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-6 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-5 mb-2.5 pb-1 border-b border-zinc-100 dark:border-zinc-800/60">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed my-2 text-[15px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2 text-zinc-700 dark:text-zinc-300 text-[15px] pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 text-zinc-700 dark:text-zinc-300 text-[15px] pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500/80 pl-4 py-1.5 my-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r-lg text-zinc-600 dark:text-zinc-300 italic text-[14.5px]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left border-collapse text-[14px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 font-semibold border-b border-zinc-200 dark:border-zinc-700">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="py-2.5 px-4">{children}</th>,
          td: ({ children }) => (
            <td className="py-2.5 px-4 border-t border-zinc-100 dark:border-zinc-800/70 text-zinc-600 dark:text-zinc-300">
              {children}
            </td>
          ),
          hr: () => <hr className="my-6 border-zinc-200 dark:border-zinc-800" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ''}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-full my-4 shadow-sm"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
