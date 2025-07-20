import { cw } from '@/utils/tailwind';
import katex from 'katex';
import Image from 'next/image';
import React from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import RehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import RemarkMathPlugin from 'remark-math';

import ClipboardButton from './clipboard-button';

import 'katex/dist/katex.min.css';

type MarkdownDisplayProps = {
  children: string;
  maxWidth: number;
};

function preprocessMathDelimiters(markdown: string) {
  return (
    markdown
      // Replace \( ... \) with $ ... $ for inline math
      .replace(/\\\((.*?)\\\)/gs, (_, content) => `$${content}$`)
      // Replace \[ ... \] with $$ ... $$ for block math
      .replace(/\\\[(.*?)\\\]/gs, (_, content) => `$$${content}$$`)
  );
}

export default function MarkdownDisplay({ children: _children, maxWidth }: MarkdownDisplayProps) {
  const children = preprocessMathDelimiters(_children);

  return (
    <Markdown
      className="break-words text-base"
      remarkPlugins={[RemarkMathPlugin, remarkGfm]}
      rehypePlugins={[RehypeKatex]}
      components={{
        a({ href, children, ...props }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cw('text-blue-600 hover:underline dark:text-blue-200')}
              {...props}
            >
              {children}
            </a>
          );
        },
        // @ts-expect-error plugin errors
        inlineMath({ value }) {
          return (
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(value, { displayMode: false }),
              }}
            />
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hr({ ...props }) {
          return <div className="py-1" />;
        },
        th({ children, ...props }) {
          return (
            <th {...props} className="border-[1px] bg-slate-100 p-2 text-left font-medium">
              {children}
            </th>
          );
        },
        td({ children, ...props }) {
          return (
            <td {...props} className="border-[1px] p-2">
              {children}
            </td>
          );
        },
        tr({ children, ...props }) {
          return <tr {...props}>{children}</tr>;
        },
        table({ children, ...props }) {
          return (
            <table
              {...props}
              className="my-4 w-full border-collapse border-[1px] first:mt-0 last:mb-0"
            >
              {children}
            </table>
          );
        },
        strong({ children, ...props }) {
          return (
            <strong className="font-semibold" {...props}>
              {children}
            </strong>
          );
        },
        img({ src, alt, ...props }) {
          return (
            <Image
              src={src ?? ''}
              alt={alt ?? ''}
              //@ts-expect-error - weird typescript error
              width={400}
              //@ts-expect-error - weird typescript error
              height={400}
              className="my-2 rounded-lg"
              {...props}
            />
          );
        },
        ul({ children, ...props }) {
          return (
            <ul className="list-square ml-6 space-y-2 py-1" {...props}>
              {children}
            </ul>
          );
        },
        ol({ children, ...props }) {
          return (
            <ol className="ml-6 list-decimal space-y-2 py-1" {...props}>
              {children}
            </ol>
          );
        },
        li({ children, ...props }) {
          return <li {...props}>{children}</li>;
        },
        p({ children, ...props }) {
          return (
            <p className="whitespace-pre-wrap pb-3 pt-1 first:pt-0 last:pb-0" {...props}>
              {children}
            </p>
          );
        },
        code({ className, children, ...props }) {
          const sanitizedText = String(children).replace(/\n$/, '');
          const match = /language-(\w+)/.exec(className || '');

          const language = match?.[1];

          if (language === undefined) {
            return (
              <code className={cw(className, 'bg-main-200 text-wrap break-words px-0.5 text-sm')}>
                {children}
              </code>
            );
          }

          return (
            <div className="flex w-fit flex-col overflow-x-hidden py-2 text-sm">
              <div className="flex items-center justify-center rounded-lg rounded-b-none bg-primary px-2 py-2 text-primary-foreground">
                {language !== undefined && (
                  <span className="text-primary-foreground">{language}</span>
                )}
                <div className="flex-grow" />

                <ClipboardButton text={sanitizedText} />
              </div>
              <SyntaxHighlighter
                // @ts-expect-error for somer reason those styles are not compatible with the library definitions
                style={nightOwl}
                language={language}
                PreTag="pre"
                {...props}
                customStyle={{
                  overflowX: 'scroll',
                  margin: '0rem',
                  maxWidth: maxWidth - 99,
                  minWidth: maxWidth - 101,
                }}
              >
                {sanitizedText}
              </SyntaxHighlighter>
            </div>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
