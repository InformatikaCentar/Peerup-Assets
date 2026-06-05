import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';

export const SCENE_DURATIONS = {
  intro: 4000,
  login: 5000,
  ucimo: 8000,
  biljeske: 8000,
  kviz: 7000,
  buvljak: 6500,
  bodovi: 7000,
  outro: 5500,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  login: Scene2,
  ucimo: Scene3,
  biljeske: Scene4,
  kviz: Scene5,
  buvljak: Scene6,
  bodovi: Scene7,
  outro: Scene8,
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

/* ---- Responsive scale context ---- */
export interface VideoScaleCtx { scale: number; isMobile: boolean; }
export const VideoScaleContext = createContext<VideoScaleCtx>({ scale: 1, isMobile: false });
export function useVideoScale() { return useContext(VideoScaleContext); }

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

  /* Track viewport for responsive scaling */
  const [videoScale, setVideoScale] = useState<VideoScaleCtx>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 960;
    return { scale: w < 960 ? 960 / w : 1, isMobile: w < 640 };
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVideoScale({ scale: w < 960 ? 960 / w : 1, isMobile: w < 640 });
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => { onSceneChange?.(currentSceneKey); }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-[#f7f3ee]">
        {/* Background blobs (persistent) */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute w-[45vw] h-[45vw] rounded-full blur-[100px] bg-[#1a8a72]/15 top-[-15vw] left-[-15vw]"
            animate={{ x: ['0vw', '8vw', '0vw'], y: ['0vw', '12vw', '0vw'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[35vw] h-[35vw] rounded-full blur-[80px] bg-[#d97706]/15 bottom-[-8vw] right-[-8vw]"
            animate={{ x: ['0vw', '-10vw', '0vw'], y: ['0vw', '-8vw', '0vw'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[20vw] h-[20vw] rounded-full blur-[60px] bg-[#7c3aed]/10 top-[40%] right-[15%]"
            animate={{ x: ['0vw', '5vw', '0vw'], y: ['0vw', '-6vw', '0vw'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating geometric accents */}
        <motion.div
          className="absolute w-[5vw] h-[5vw] rounded-2xl bg-[#7c3aed]/20 blur-sm z-10"
          animate={{
            x: (['82vw', '12vw', '55vw', '88vw', '25vw', '70vw', '18vw', '90vw'] as string[])[sceneIndex] ?? '50vw',
            y: (['18vh', '72vh', '12vh', '55vh', '78vh', '20vh', '60vh', '35vh'] as string[])[sceneIndex] ?? '50vh',
            rotate: ([0, 45, 90, 135, 180, 225, 270, 315] as number[])[sceneIndex] ?? 0,
          }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[7vw] h-[7vw] rounded-full border-4 border-[#e03e5c]/15 z-10"
          animate={{
            x: (['8vw', '72vw', '18vw', '12vw', '78vw', '40vw', '85vw', '20vw'] as string[])[sceneIndex] ?? '50vw',
            y: (['62vh', '18vh', '82vh', '28vh', '12vh', '70vh', '30vh', '15vh'] as string[])[sceneIndex] ?? '50vh',
            scale: ([1, 1.4, 0.8, 1.2, 1.5, 0.9, 1.1, 1] as number[])[sceneIndex] ?? 1,
          }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        <VideoScaleContext.Provider value={videoScale}>
          <AnimatePresence mode="popLayout">
            {SceneComponent && <SceneComponent key={currentSceneKey} />}
          </AnimatePresence>
        </VideoScaleContext.Provider>
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
