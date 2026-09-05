'use client';

import React, { useState } from 'react';
import { useForum } from '@/context/ForumContext';
import { POPULAR_TAGS } from '@/data/initialData';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  X,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Code,
  Quote,
  List,
  Link2,
  Image as ImageIcon,
  Send,
  Eye,
  Edit3,
  Table as TableIcon,
} from 'lucide-react';

export const ComposerDrawer: React.FC = () => {
  const {
    isComposerOpen,
    setIsComposerOpen,
    categories,
    addTopic,
    setActiveTopicId,
    showToast,
  } = useForum();

  const [title, setTitle] = useState('');
  const [selectedCat, setSelectedCat] = useState(categories[1]?.slug || 'tech');
  const [selectedTags, setSelectedTags] = useState<string[]>(['开源项目']);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isMaximized, setIsMaximized] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  if (!isComposerOpen) return null;

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('composer-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end) || '文本';
    const replacement = `${before}${selectedText}${after}`;

    const newContent =
      previousText.substring(0, start) + replacement + previousText.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      handleAddTag(customTagInput.trim());
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('请填写话题标题与正文内容', 'warning');
      return;
    }

    const newTopic = addTopic(title.trim(), selectedCat, selectedTags, content.trim());
    setIsComposerOpen(false);
    setTitle('');
    setContent('');
    setActiveTopicId(newTopic.id);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-5xl bg-white dark:bg-zinc-900 border-t sm:border-x border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-t-3xl transition-all duration-300 flex flex-col ${
          isMaximized ? 'h-[92vh]' : 'h-[68vh] min-h-[500px]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              发布新话题 (New Topic)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
              title={isMaximized ? '还原窗口' : '最大化窗口'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsComposerOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="p-4 space-y-3 flex-shrink-0 border-b border-zinc-100 dark:border-zinc-800/80">
          {/* Title & Category */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入一个清晰、具体的话题标题..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {categories
                .filter((c) => c.slug !== 'all')
                .map((c) => (
                  <option key={c.id} value={c.slug}>
                    频道: {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags row */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 text-xs">
            <span className="text-zinc-400 text-[11px] font-medium">标签：</span>
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-xs border border-indigo-500/20"
              >
                <span>#{tag}</span>
                <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-75 font-bold">
                  ×
                </button>
              </span>
            ))}

            {selectedTags.length < 5 && (
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleCustomTagKeyDown}
                placeholder="+ 回车添加自定义标签"
                className="px-2 py-0.5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-transparent text-xs text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
              />
            )}

            <div className="hidden lg:flex items-center space-x-1 ml-auto text-[11px] text-zinc-400">
              <span>热门推荐:</span>
              {POPULAR_TAGS.slice(0, 4).map((t) => (
                <button
                  key={t}
                  onClick={() => handleAddTag(t)}
                  className="hover:text-indigo-500 underline underline-offset-2 ml-1"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Markdown Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20 flex-shrink-0 text-zinc-600 dark:text-zinc-400 text-xs">
          <div className="flex items-center space-x-1 overflow-x-auto">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="加粗 (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="斜体 (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('`', '`')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="行内代码"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('```bash\n', '\n```')}
              className="px-2 py-1 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 font-mono text-[11px] transition-colors"
              title="代码块"
            >
              &lt;/&gt;
            </button>
            <button
              onClick={() => insertMarkdown('> ')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="引用块"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('- ')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="无序列表"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('[链接描述](', ')')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="超链接"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('![图片描述](', ')')}
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="插入图片"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                insertMarkdown('\n| 表头1 | 表头2 |\n| :--- | :--- |\n| 内容1 | 内容2 |\n')
              }
              className="p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="插入表格"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-1 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab('write')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>编辑</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>预览</span>
            </button>
          </div>
        </div>

        {/* Body Editor / Preview Area */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          {activeTab === 'write' ? (
            <textarea
              id="composer-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="请输入话题详细正文，支持完整 Markdown 语法、代码块高亮及表格..."
              className="w-full h-full p-4 resize-none bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm font-mono leading-relaxed focus:outline-none overflow-y-auto"
            />
          ) : (
            <div className="w-full h-full p-4 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/30">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-zinc-400 text-xs italic text-center py-10">
                  正文为空，暂无可预览的内容...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Submit Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 rounded-b-3xl flex-shrink-0">
          <div className="text-[11px] text-zinc-400">
            支持快捷键 <kbd className="font-mono px-1 py-0.5 rounded border dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">Ctrl + Enter</kbd> 极速发布
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsComposerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={!title.trim() || !content.trim()}
              className="inline-flex items-center space-x-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>立即发布</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
