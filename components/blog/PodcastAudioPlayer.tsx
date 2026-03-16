'use client'

import { useRef, useState, useEffect } from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'
import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import SecureImage from '@/components/ui/SecureImage'

interface PodcastAudioPlayerProps {
  src: string
  thumbnailUrl?: string | null
  title?: string
  className?: string
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PodcastAudioPlayer({ src, thumbnailUrl, title, className = '' }: PodcastAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onDurationChange = () => setDuration(el.duration)
    const onEnded = () => setPlaying(false)
    const onCanPlay = () => setLoaded(true)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('durationchange', onDurationChange)
    el.addEventListener('ended', onEnded)
    el.addEventListener('canplay', onCanPlay)
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('durationchange', onDurationChange)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('canplay', onCanPlay)
    }
  }, [src])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
    } else {
      el.play()
    }
    setPlaying(!playing)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current
    const value = parseFloat(e.target.value)
    if (el) {
      el.currentTime = value
      setCurrentTime(value)
    }
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl bg-secondary-50 border border-secondary-200 shadow-sm ${className}`}
      role="region"
      aria-label="Episode audio player"
    >
      {thumbnailUrl ? (
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-secondary-200 shadow-sm">
          <SecureImage
            src={thumbnailUrl}
            alt={title ?? 'Episode'}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-secondary-200 flex items-center justify-center">
          <MusicalNoteIcon className="w-10 h-10 text-secondary-400" />
        </div>
      )}
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        type="button"
        onClick={togglePlay}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6 ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 rounded-full appearance-none bg-secondary-200 cursor-pointer accent-primary-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
          aria-label="Seek"
        />
        <div className="flex justify-between text-sm text-secondary-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{loaded ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>
    </div>
  )
}
