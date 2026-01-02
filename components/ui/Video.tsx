"use client"
import { useState, useRef } from "react";
import Image from "next/image";
import Playbutton from "../animations/Playbutton";

interface VideoProps {
  poster?: string;
  videoSrc?: string;
}

export default function Video({ poster = "/videos/video-1.jpg", videoSrc = "https://www.youtube.com/watch?v=ZOoCrTORmaw" }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(videoSrc);

  const handlePlayClick = () => {
    if (youtubeId) {
      setIsPlaying(true);
    } else if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  return (
    <div className="max-w-6xl mx-2 sm:mx-4 md:mx-5 xl:mx-auto rounded-sm overflow-hidden -mt-10 sm:-mt-28 md:-mt-56 lg:-mt-72 2xl:-mt-96">
      <div className="relative group cursor-pointer" onClick={handlePlayClick}>
        {!isPlaying && (
          <>
            <Image
              src={poster}
              alt="Video preview"
              width={1920}
              height={1080}
              className="w-full rounded-sm"
              priority
              fetchPriority="high"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNjY2NjY2MiLz48L3N2Zz4="
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Playbutton className="w-26 h-26" />
            </div>
          </>
        )}

        {isPlaying && youtubeId ? (
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-sm"
            ></iframe>
          </div>
        ) : (
          <video
            preload="metadata"
            ref={videoRef}
            className={`w-full rounded-sm ${!isPlaying ? 'hidden' : ''}`}
            controls={isPlaying}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}