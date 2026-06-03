import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = { open: 3500, learn: 4000, swap: 4000, points: 4000, close: 3500 };

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open: Scene1,
  learn: Scene2,
  swap: Scene3,
  points: Scene4,
  close: Scene5,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-[#f7f3ee]">
        {/* Background Layer (Persistent) */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute w-[40vw] h-[40vw] rounded-full blur-[80px] bg-[#1a8a72]/20 top-[-10vw] left-[-10vw]"
            animate={{ x: ['0vw', '10vw', '0vw'], y: ['0vw', '10vw', '0vw'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[30vw] h-[30vw] rounded-full blur-[60px] bg-[#d97706]/20 bottom-[-5vw] right-[-5vw]"
            animate={{ x: ['0vw', '-10vw', '0vw'], y: ['0vw', '-10vw', '0vw'] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Midground Layer (Persistent shapes that transform with scene) */}
        <motion.div
          className="absolute w-[6vw] h-[6vw] rounded-2xl bg-[#7c3aed]/30 blur-sm z-10"
          animate={{
            x: (['80vw', '15vw', '50vw', '85vw', '20vw'] as string[])[sceneIndex] ?? '50vw',
            y: (['20vh', '70vh', '15vh', '50vh', '80vh'] as string[])[sceneIndex] ?? '50vh',
            rotate: ([0, 45, 90, 135, 180] as number[])[sceneIndex] ?? 0,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[8vw] h-[8vw] rounded-full border-4 border-[#e03e5c]/20 z-10"
          animate={{
            x: (['10vw', '70vw', '20vw', '15vw', '75vw'] as string[])[sceneIndex] ?? '50vw',
            y: (['60vh', '20vh', '80vh', '30vh', '15vh'] as string[])[sceneIndex] ?? '50vh',
            scale: ([1, 1.5, 0.8, 1.2, 1] as number[])[sceneIndex] ?? 1,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        <AnimatePresence mode="popLayout">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </>
  );
}
