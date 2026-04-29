import { useRef, useEffect, useState, useMemo, useCallback, useId, FC, PointerEvent } from 'react';

/** Must match the visible <text> so getComputedTextLength matches the marquee segment length. */
const MARQUEE_TEXT_CLASSES =
  'text-foreground text-[84px] sm:text-[96px] md:text-[3rem] lg:text-[4.5rem] font-black uppercase';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true
}) => {
  const normalizedMarqueeText = useMemo(() => {
    return marqueeText.replace(/\s*\|\s*/g, '\u00A0\u00A0|\u00A0\u00A0');
  }, [marqueeText]);

  const text = useMemo(() => {
    return normalizedMarqueeText + '\u00A0';
  }, [normalizedMarqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const baseY = 112;
  const curveY = baseY + curveAmount * 0.34;
  const pathD = `M-100,${baseY} Q720,${curveY} 1540,${baseY}`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  const remeasure = useCallback(() => {
    if (measureRef.current) {
      const len = measureRef.current.getComputedTextLength();
      if (len > 0) setSpacing(len);
    }
  }, [text]);

  useEffect(() => {
    remeasure();
    window.addEventListener('resize', remeasure);
    return () => window.removeEventListener('resize', remeasure);
  }, [remeasure]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    textPathRef.current.setAttribute('startOffset', `${-spacing}px`);
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let rafId = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div className="py-0 my-0 md:py-6 md:my-6 bg-transparent flex items-center justify-center w-full min-h-[120px] sm:min-h-[180px] md:h-72 md:min-h-0 lg:h-[350px] relative overflow-visible z-0">
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      <div
        className="block w-full overflow-visible touch-pan-y"
        style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <svg
          className="select-none w-[220%] sm:w-[185%] md:w-full max-w-none -translate-x-[27%] sm:-translate-x-[20%] md:translate-x-0 overflow-visible block relative z-0"
          viewBox="0 0 1440 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            ref={measureRef}
            xmlSpace="preserve"
            className={`${MARQUEE_TEXT_CLASSES} ${className ?? ''}`}
            style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}
          >
            {text}
          </text>
          <defs>
            <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
            <filter id={`glow-${uid}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {ready && (
            <text xmlSpace="preserve" className={`${MARQUEE_TEXT_CLASSES} ${className ?? ''}`} fill="currentColor" style={{ opacity: 1 }}>
              <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
                {totalText}
              </textPath>
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default CurvedLoop;
