import { useAudio } from '@/contexts/AudioContext';
import { VerticalFader } from './VerticalFader';
import { X } from 'lucide-react';

export function AudioMixer() {
  const { 
    musicVolume, 
    sfxVolume, 
    masterVolume,
    setMusicVolume,
    setSfxVolume,
    setMasterVolume,
    isMixerOpen,
    setIsMixerOpen
  } = useAudio();

  if (!isMixerOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center" style={{zIndex: 200}}>
      {/* Overlay для закрытия */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsMixerOpen(false)}
      ></div>

      {/* Микшер */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎛️ AUDIO MIXER
          </h2>
          <button
            onClick={() => setIsMixerOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Фейдеры */}
        <div className="flex">
          {/* Music Channel */}
          <div className="border-r border-gray-700">
            <VerticalFader
              value={musicVolume}
              onChange={setMusicVolume}
              label="MUSIC"
            />
          </div>

          {/* SFX Channel */}
          <div className="border-r border-gray-700">
            <VerticalFader
              value={sfxVolume}
              onChange={setSfxVolume}
              label="SFX"
            />
          </div>

          {/* Master Channel (красный) */}
          <div>
            <VerticalFader
              value={masterVolume}
              onChange={setMasterVolume}
              label="MASTER"
              isMaster={true}
            />
          </div>
        </div>

        {/* Информация внизу */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="text-xs text-gray-400 text-center space-y-1">
            <div>🎵 <span className="text-yellow-400">MUSIC</span>: Background + Project Audio</div>
            <div>🔊 <span className="text-yellow-400">SFX</span>: Sound Design & Ambient</div>
            <div>🔴 <span className="text-red-400">MASTER</span>: Overall Output Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}