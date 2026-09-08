import { useCallback, useEffect, useState } from "react";
import { project, pages } from "./project";
import TopBar from "./components/TopBar";
import MenuOverlay from "./components/MenuOverlay";
import ProgressRail from "./components/ProgressRail";
import PageShell from "./components/PageShell";
import HeroContent from "./components/HeroContent";
import StatsContent from "./components/StatsContent";
import StandardContent from "./components/StandardContent";
import StepsContent from "./components/StepsContent";
import SourcesContent from "./components/SourcesContent";
import VideoContent from "./components/VideoContent";
import ImprintContent from "./components/ImprintContent";
import ImageLightbox from "./components/ImageLightbox";
import { generateProjectPdf } from "./pdf/generatePdf";
import {
  getEntryPoint,
  initPianoTracking,
  sanitizePageUrl,
  trackEvent,
  trackOnce
} from "./tracking/piano";

function PageContent({ page, onOpenGraphic, onPdf, pdfGenerating }) {
  const graphicHandler = page.inlineImage || page.zoomable ? onOpenGraphic : undefined;
  switch (page.kind) {
    case "hero": return <HeroContent page={page} />;
    case "stats": return <StatsContent page={page} onOpenGraphic={graphicHandler} />;
    case "steps": return <StepsContent page={page} onOpenGraphic={graphicHandler} />;
    case "sources": return <SourcesContent page={page} project={project} onPdf={onPdf} pdfGenerating={pdfGenerating} />;
    case "video": return <VideoContent page={page} project={project} />;
    case "imprint": return <ImprintContent page={page} imprint={project.imprint} />;
    default: return <StandardContent page={page} onOpenGraphic={graphicHandler} />;
  }
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGraphic, setOpenGraphic] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const pageName = project.meta.analytics.page;

  const handleActive = useCallback((index) => {
    setActiveIndex(index);
    const page = pages[index];
    if (history.replaceState && page) {
      history.replaceState(null, "", index === 0 ? window.location.pathname + window.location.search : `${window.location.pathname}${window.location.search}#${page.id}`);
    }
  }, []);

  const handleOpenGraphic = useCallback((page) => {
    setOpenGraphic(page);
    trackEvent("click.action", {
      pop_in_type: "Graphic",
      pop_in_name: page.kicker || page.nav || page.title,
      click: "Open graphic",
      page: pageName,
      chapter_id: page.id,
      image_id: page.imageId || page.id,
      trigger_source: "chapter"
    });
  }, [pageName]);

  const handleCloseGraphic = useCallback(() => {
    if (openGraphic) {
      trackEvent("click.action", {
        pop_in_type: "Graphic",
        pop_in_name: openGraphic.kicker || openGraphic.nav || openGraphic.title,
        click: "Close graphic",
        page: pageName,
        chapter_id: openGraphic.id,
        image_id: openGraphic.imageId || openGraphic.id,
        trigger_source: "graphic_viewer"
      });
    }
    setOpenGraphic(null);
  }, [openGraphic, pageName]);

  const handlePdf = useCallback(async (triggerSource = "unknown") => {
    if (pdfGenerating) return;
    setPdfGenerating(true);
    setPdfProgress(1);

    trackEvent("click.action", {
      pop_in_type: "PDF",
      pop_in_name: project.meta.pdfFileName,
      click: "Generate PDF",
      page: pageName,
      chapter_id: pages[activeIndex]?.id,
      document_id: `${project.meta.projectId}-pdf`,
      trigger_source: triggerSource
    });

    try {
      const result = await generateProjectPdf({ project, onProgress: setPdfProgress });
      trackEvent("click.action", {
        pop_in_type: "PDF",
        pop_in_name: project.meta.pdfFileName,
        click: "Download PDF",
        page: pageName,
        chapter_id: pages[activeIndex]?.id,
        document_id: `${project.meta.projectId}-pdf`,
        trigger_source: triggerSource
      });
      if (import.meta.env.DEV) console.info("[PDF]", result);
    } catch (error) {
      console.error("PDF generation failed", error);
      window.alert("Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.");
    } finally {
      window.setTimeout(() => {
        setPdfGenerating(false);
        setPdfProgress(0);
      }, 500);
    }
  }, [pdfGenerating, activeIndex, pageName]);

  useEffect(() => {
    initPianoTracking({
      project_id: project.meta.projectId,
      entry_point: getEntryPoint()
    });

    document.title = project.meta.title;
    trackOnce("page-display", "page.display", {
      page: pageName,
      page_url: sanitizePageUrl(),
      de_page_category: [
        "med.i.scroll",
        project.meta.analytics.medicalField,
        project.meta.analytics.indication
      ],
      de_page_tags: project.meta.analytics.tags,
      page_type: project.meta.analytics.pageType,
      visitor_type: project.meta.analytics.visitorType,
      article_category: project.meta.analytics.articleCategory,
      product_name: project.meta.analytics.product?.name || undefined,
      product_mol: project.meta.analytics.product?.molecules?.length ? project.meta.analytics.product.molecules : undefined,
      product_titulaire: project.meta.analytics.product?.titulaire || undefined,
      product_ATC_class_code: project.meta.analytics.product?.atcClassCodes?.length ? project.meta.analytics.product.atcClassCodes : undefined,
      product_ATC_class_name: project.meta.analytics.product?.atcClassNames?.length ? project.meta.analytics.product.atcClassNames : undefined,
      product_UCD10_codes: project.meta.analytics.product?.ucd10Codes?.length ? project.meta.analytics.product.ucd10Codes : undefined
    });

    const onScroll = () => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const atDocumentEnd = Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2;
      for (const percent of [25, 50, 75, 100]) {
        const reached = percent === 100 ? atDocumentEnd : depth >= percent / 100;
        if (reached) {
          trackOnce(`scroll-${percent}`, "page.scroll", {
            page: pageName,
            scroll_rate: percent
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const hash = window.location.hash.replace("#", "");
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }), 100);

    return () => window.removeEventListener("scroll", onScroll);
  }, [pageName]);

  return (
    <>
      <TopBar
        activeIndex={activeIndex}
        pages={pages}
        project={project}
        onMenu={() => setMenuOpen(true)}
        onPdf={handlePdf}
        pdfGenerating={pdfGenerating}
        pdfProgress={pdfProgress}
      />
      <ProgressRail pages={pages} activeIndex={activeIndex} />
      <MenuOverlay
        open={menuOpen}
        pages={pages}
        activeIndex={activeIndex}
        title={project.meta.title}
        pageName={pageName}
        onClose={() => setMenuOpen(false)}
      />
      <main className="story">
        {pages.map((page, index) => (
          <PageShell
            key={page.id}
            page={page}
            index={index}
            total={pages.length}
            nextId={pages[index + 1]?.id}
            previousId={pages[index - 1]?.id}
            startId={pages[0]?.id}
            onActive={handleActive}
            long={Boolean(page.long)}
            projectId={project.meta.projectId}
            pageName={pageName}
          >
            <PageContent
              page={page}
              onOpenGraphic={() => handleOpenGraphic(page)}
              onPdf={handlePdf}
              pdfGenerating={pdfGenerating}
            />
          </PageShell>
        ))}
      </main>
      <ImageLightbox
        open={Boolean(openGraphic)}
        image={openGraphic?.inlineImage || openGraphic?.background}
        imageId={openGraphic?.imageId || openGraphic?.id}
        title={openGraphic?.kicker || openGraphic?.nav || "Grafik"}
        chapterId={openGraphic?.id}
        pageName={pageName}
        onClose={handleCloseGraphic}
      />
    </>
  );
}
