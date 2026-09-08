import { useRef } from "react";
import ContentCard from "./ContentCard";
import { sanitizeDestinationPath, trackEvent, trackOnce } from "../tracking/piano";

export default function VideoContent({ page, project }) {
  const ref = useRef(null);
  const name = page.videoName || page.title;
  const videoId = page.videoId || page.id;
  const pageName = project.meta.analytics.page;

  const onTimeUpdate = () => {
    const video = ref.current;
    if (!video?.duration) return;
    const percent = Math.floor((video.currentTime / video.duration) * 100);
    for (const milestone of [25, 50, 75]) {
      if (percent >= milestone) {
        trackOnce(`video-progress-${page.id}-${milestone}`, "video.progress", {
          page: pageName,
          chapter_id: page.id,
          video_id: videoId,
          video_name: name,
          progress_percent: milestone
        });
      }
    }
  };

  return <ContentCard wide className="video-card">
    <div className="video-card__copy">
      <p className="page-kicker">{page.kicker}</p>
      <h2>{page.title}</h2>
      {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
      {page.cta?.url && <a
        className="primary-cta"
        href={page.cta.url}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent("click.action", {
          pop_in_type: "CTA",
          pop_in_name: page.cta.label,
          click: "Open external link",
          page: pageName,
          chapter_id: page.id,
          element_id: page.cta.analyticsId || `${page.id}-video-cta`,
          destination_path: sanitizeDestinationPath(page.cta.url),
          trigger_source: "video_chapter"
        })}
      >{page.cta.label}</a>}
    </div>
    <div className="phone-stage">
      {page.poster && <img className="print-video-poster" src={page.poster} alt={name} />}
      <video
        ref={ref}
        src={page.video}
        controls
        playsInline
        preload="metadata"
        poster={page.poster}
        onPlay={() => trackOnce(`video-start-${page.id}`, "video.start", {
          page: pageName,
          chapter_id: page.id,
          video_id: videoId,
          video_name: name
        })}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => trackOnce(`video-complete-${page.id}`, "video.complete", {
          page: pageName,
          chapter_id: page.id,
          video_id: videoId,
          video_name: name,
          progress_percent: 100
        })}
      />
    </div>
  </ContentCard>;
}
