import { useAudio } from '@/contexts/AudioContext';
import { SkipBack, SkipForward } from 'lucide-react';

export function PlaylistControls() {
  const { 
    currentPlaylist, 
    currentTrackIndex, 
    setCurrentTrackIndex, 
    nextTrack, 
    prevTrack,
    isGlobalAudioEnabled
  } = useAudio();

  // Если нет плейлиста, только один трек или звук отключен - не показываем контролы
  if (!currentPlaylist || currentPlaylist.length <= 1 || !isGlobalAudioEnabled) {
    return null;
  }

  const currentTrack = currentPlaylist[currentTrackIndex];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-effect rounded-xl p-4 min-w-[400px] border border-primary/20">
        
        {/* Название трека */}
        <div className="text-center mb-4">
          <h4 className="text-sm font-medium text-primary">Музыка из спектакля</h4>
          <p className="text-white font-semibold">{currentTrack.title}</p>
        </div>

        {/* Контролы */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={prevTrack}
            disabled={currentTrackIndex === 0}
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack size={20} className="text-white" />
          </button>

          <div className="px-4 py-2 bg-primary/20 rounded-lg">
            <span className="text-primary font-medium">
              {currentTrackIndex + 1} / {currentPlaylist.length}
            </span>
          </div>

          <button
            onClick={nextTrack}
            disabled={currentTrackIndex === currentPlaylist.length - 1}
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward size={20} className="text-white" />
          </button>
        </div>

        {/* Список треков */}
        <div className="space-y-1">
          {currentPlaylist.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrackIndex(index)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                index === currentTrackIndex
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {index + 1}. {track.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}