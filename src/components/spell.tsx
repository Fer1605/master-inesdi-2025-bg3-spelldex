import c from "classnames";
import { useEffect, useMemo, useState } from "react";
import upcastIcon from "src/assets/icons/other/upcast.png";

import type { Spell } from "src/models/spell";

import styles from "./spell.module.css";
import { SpellTooltip } from "./spell-tooltip";

export function Spell({
  spell,
  highlighted,
  detailed,
}: {
  spell: Spell;
  highlighted: boolean | undefined;
  detailed: boolean | undefined;
}) {
  const [selected, setSelected] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const onClick = () => {
    if (!detailed) return;
    setSelected(!selected);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onClick();
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
      className={c(
        styles.spell,
        highlighted && !detailed && styles.highlighted,
        detailed && styles.detailed,
        detailed && selected && styles.selected
      )}
      data-spell-id={spell.id}
      style={animatedSpellStyles}
      aria-label={spell.name}
      aria-detailed={detailed ? "true" : "false"}
      onClick={detailed ? onClick : undefined}
      tabIndex={detailed ? 0 : -1}
      onKeyDown={detailed ? onKeyDown : undefined}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {detailed && showTooltip && <SpellTooltip spell={spell} />}

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