import React from 'react';

// Contoh komponen yang boleh memproses format khusus
const Lyrics = ({ lyrics }: { lyrics: string }) => {
  // Ubah teks yang mempunyai tag [BOLD] kepada komponen dengan kelas CSS
  let formattedLyrics = lyrics.replace(/\[BOLD\](.*?)\[\/BOLD\]/g, '<span class="bold-text">$1</span>');
  
  // Ubah tag <strong> kepada span dengan kelas CSS yang sama
  formattedLyrics = formattedLyrics.replace(/<strong>(.*?)<\/strong>/g, '<span class="bold-text">$1</span>');
  
  return (
    <div>
      <div className="lyrics-container" dangerouslySetInnerHTML={{ __html: formattedLyrics }} />
      <style>{`
        .bold-text {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Lyrics; 