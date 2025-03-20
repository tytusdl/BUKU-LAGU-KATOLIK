import React from 'react';
import ReactMarkdown from 'react-markdown';

function CustomizedMarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="judul-utama" {...props} />,
        h2: ({ node, ...props }) => <h2 className="sub-judul" {...props} />,
        a: ({ node, ...props }) => <a className="pautan" target="_blank" {...props} />,
        // Sesuaikan komponen lain seperti yang diperlukan
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default CustomizedMarkdownRenderer; 