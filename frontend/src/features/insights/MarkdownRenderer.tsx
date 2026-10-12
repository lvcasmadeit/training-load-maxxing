import { AlertTriangle, Calendar, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  if (!markdown) return null;

  const lines = markdown.split('\n');
  const renderedElements: ReactElement<{ className?: string }>[] = [];

  let listItems: string[] = [];
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      const isWeaknessList = renderedElements.some(el =>
        el.props && el.props.className && el.props.className.includes('header-improvement')
      ) && !renderedElements.some(el =>
        el.props && el.props.className && el.props.className.includes('header-schedule')
      );

      renderedElements.push(
        <ul key={`list-${key}`} className="markdown-list" data-status={isWeaknessList ? 'warning' : 'success'}>
          {listItems.map((item, itemIdx) => {
            const boldMatch = item.match(/^\*\*(.*?)\*\*:(.*)/);
            let boldContent: ReactNode = item;

            if (boldMatch) {
              boldContent = (
                <span>
                  <strong>{boldMatch[1]}:</strong>
                  {boldMatch[2]}
                </span>
              );
            }

            return (
              <li key={itemIdx}>
                <span className="markdown-list__mark">
                  {isWeaknessList ? '!' : '✓'}
                </span>
                <span>{boldContent}</span>
              </li>
            );
          })}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: number) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      renderedElements.push(
        <div key={`table-wrapper-${key}`} className="table-responsive">
          <table className="markdown-table">
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th key={idx}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => {
                    const cleanCell = cell.replace(/\*\*/g, '');

                    return <td key={cellIdx}>{cleanCell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('|-') || trimmed.startsWith('| -') || trimmed === '---') {
      return;
    }

    if (trimmed.startsWith('|')) {
      flushList(idx);
      const cells = trimmed.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);

      if (cells.every(c => c.startsWith(':---') || c.startsWith('---') || c.startsWith(':--') || c.endsWith('---:'))) {
        return;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else {
      flushTable(idx);
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      listItems.push(trimmed.substring(2));
      return;
    } else {
      flushList(idx);
    }

    if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h2 key={idx}>
          {trimmed.substring(2)}
        </h2>
      );
    }
    else if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      const text = trimmed.startsWith('## ') ? trimmed.substring(3) : trimmed.substring(4);
      let icon = <FileText size={16} />;
      let className = '';
      let status = 'neutral';

      if (text.includes('Status Summary')) {
        icon = <Sparkles size={16} />;
        className = 'header-status';
        status = 'info';
      } else if (text.includes('Strengths')) {
        icon = <CheckCircle2 size={16} />;
        className = 'header-strengths';
        status = 'success';
      } else if (text.includes('Improvement')) {
        icon = <AlertTriangle size={16} />;
        className = 'header-improvement';
        status = 'warning';
      } else if (text.includes('Calendar') || text.includes('Schedule')) {
        icon = <Calendar size={16} />;
        className = 'header-schedule';
        status = 'info';
      }

      renderedElements.push(
        <h3 key={idx} className={className} data-status={status}>
          {icon}
          <span>{text.replace(/\(.*\)/g, '')}</span>
        </h3>
      );
    }
    else {
      const isGreen = trimmed.includes('🟢') || trimmed.includes('FIT & AVAILABLE');
      const isRed = trimmed.includes('🔴') || trimmed.includes('EXTREME INJURY RISK') || trimmed.includes('CRITICAL');
      const isAmber = trimmed.includes('🟡') || trimmed.includes('MONITOR CLOSELY');

      let status = '';
      if (isGreen) {
        status = 'success';
      } else if (isRed) {
        status = 'danger';
      } else if (isAmber) {
        status = 'warning';
      }

      const cleanText = trimmed.replace(/\*\*(.*?)\*\*/g, '$1');

      renderedElements.push(
        <p
          key={idx}
          className={status ? 'markdown-banner' : undefined}
          data-status={status || undefined}
        >
          {cleanText}
        </p>
      );
    }
  });

  flushList(lines.length);
  flushTable(lines.length);

  return <div className="markdown-body">{renderedElements}</div>;
}
