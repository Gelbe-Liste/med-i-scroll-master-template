import { useRef } from "react";
import ContentCard from "./ContentCard";
import { trackEvent, trackOnce } from "../tracking/piano";
export default function VideoContent({ page, moduleId }) {
  const ref=useRef(null); const name=page.videoName||page.title;
  return <ContentCard wide className="video-card"><div className="video-card__copy"><p className="page-kicker">{page.kicker}</p><h2>{page.title}</h2>{page.subtitle&&<p className="page-subtitle">{page.subtitle}</p>}{page.cta?.url&&<a className="primary-cta" href={page.cta.url} target="_blank" rel="noreferrer" onClick={()=>trackEvent("outbound_click",{link_label:page.cta.label,chapter_id:page.id,module_id:moduleId})}>{page.cta.label}</a>}</div><div className="phone-stage">{page.poster&&<img className="print-video-poster" src={page.poster} alt={name}/>}<video ref={ref} src={page.video} controls playsInline preload="metadata" poster={page.poster} onPlay={()=>trackOnce(`video-start-${page.id}`,"video_start",{video_name:name,chapter_id:page.id,module_id:moduleId})} onPause={()=>trackEvent("video_pause",{video_name:name,current_time:Math.round(ref.current?.currentTime||0),module_id:moduleId})} onEnded={()=>trackOnce(`video-complete-${page.id}`,"video_complete",{video_name:name,chapter_id:page.id,module_id:moduleId})}/></div></ContentCard>;
}
