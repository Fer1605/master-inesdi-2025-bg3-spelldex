import c from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";

import type { Spell as SpellType } from "src/models/spell";

import styles from "./spell.module.css";
import { SpellTooltip } from "./spell-tooltip";

type Props = {
  spell: SpellType;
  highlighted: boolean | undefined;
  detailed: boolean | undefined;
  selected: boolean;
  onSelect: () => void;
};

export function Spell({
  spell,
  highlighted,
  detailed,
  selected,
  onSelect,
}: Props) {
  const [showImage, setShowImage] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">("bottom");

  const ref = useRef<HTMLDivElement>(null);

  const randomDuration = useMemo(() => (Math.random() + 0.5).toFixed(2), []);
  const randomDelay = useMemo(() => (Math.random() * 2 + 1).toFixed(2), []);

  const animatedSpellStyles = {
    "--randomDelay": randomDelay + "s",
    "--randomDuration": randomDuration + "s",
  } as React.CSSProperties;

  useEffect(() => {
    if (detailed) {
      const transitionTime =
        (parseFloat(randomDuration) + parseFloat(randomDelay)) * 1000;

      const timer = setTimeout(() => {
        setShowImage(true);
      }, transitionTime);

      return () => {
        clearTimeout(timer);
        setShowImage(false);
      };
    } else {
      setShowImage(false);
    }
  }, [detailed, randomDuration, randomDelay]);

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setTooltipPosition(spaceBelow < 180 ? "top" : "bottom");
  }, [selected]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSelect();
    }

    if (
      ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)
    ) {
      e.preventDefault();
      moveFocus(e.key);
    }
  };

  return (
    <article
      ref={ref}
      className={c(
        styles.spell,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
        detailed && selected && styles.selected
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      aria-label={spell.name}
      onClick={detailed ? onSelect : undefined}
      tabIndex={detailed ? 0 : -1}
      onKeyDown={detailed ? onKeyDown : undefined}
    >
      {detailed && selected && (
        <div
          className={c(
            styles.tooltipWrapper,
            tooltipPosition === "top" ? styles.top : styles.bottom
          )}
        >
          <SpellTooltip spell={spell} position={tooltipPosition} />
        </div>
      )}

      {detailed && showImage && (
        <div className={styles.image}>
          <img src={spell.icon} alt={spell.name} className={styles.icon} />
          {spell.upcast && (
            <img src={upcastIcon} alt="upcast" className={styles.upcast} />
          )}
        </div>
      )}
    </article>
  );
}

// Navegación con flechas entre hechizos
function moveFocus(direction: string) {
  const focusable = Array.from(
    document.querySelectorAll('[tabindex="0"]')
  ) as HTMLElement[];

  const index = focusable.findIndex((el) => el === document.activeElement);
  if (index === -1) return;

  let nextIndex = index;
  if (direction === "ArrowRight" || direction === "ArrowDown") {
    nextIndex = (index + 1) % focusable.length;
  } else if (direction === "ArrowLeft" || direction === "ArrowUp") {
    nextIndex = (index - 1 + focusable.length) % focusable.length;
  }

  focusable[nextIndex].focus();
}
