import React from 'react';
import { Song } from '../data/songs/songs';

interface SongLyricsProps {
  song: Song;
}

const SongLyrics: React.FC<SongLyricsProps> = ({ song }) => {
  // Fungsi untuk memproses lirik dan mengesan korus
  const renderLyrics = () => {
    const lines = song.lyrics.split('\n');
    const formattedLines: React.ReactNode[] = [];
    
    let inChorus = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Kesan permulaan korus
      if (line.match(/^(\*\*)??(Chorus|Cho|Kor|Ref|Refain|Korus|Choros|Ant|Dend):\s??(\*\*)?/)) {
        inChorus = true;
        formattedLines.push(
          <div key={i} style={{ fontWeight: 'bold' }}>
            {line}
          </div>
        );
      } 
      // Kesan akhir korus (baris kosong)
      else if (inChorus && (line.trim() === '' || i === lines.length - 1)) {
        inChorus = false;
        if (line.trim() !== '') {
          formattedLines.push(
            <div key={i} style={{ fontWeight: 'bold' }}>
              {line}
            </div>
          );
        } else {
          formattedLines.push(<div key={i}>{line}</div>);
        }
      }
      // Baris dalam korus
      else if (inChorus) {
        formattedLines.push(
          <div key={i} style={{ fontWeight: 'bold' }}>
            {line}
          </div>
        );
      }
      // Baris biasa
      else {
        formattedLines.push(<div key={i}>{line}</div>);
      }
    }
    
    return formattedLines;
  };
  
  return (
    <div className="song-lyrics">
      {renderLyrics()}
    </div>
  );
};

export default SongLyrics; 