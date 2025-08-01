import styles from "./spell-tooltip.module.css";
import upcastIcon from "src/assets/icons/other/upcast.png";
import infoIcon from "src/assets/icons/other/info.png"; // Asegúrate de que esta ruta sea correcta
import type { Spell } from "src/models/spell";

type Props = {
  spell: Spell;
  position?: "top" | "bottom";
};

export function SpellTooltip({ spell, position = "bottom" }: Props) {
  return (
    <div
      className={`${styles.tooltip} ${
        position === "top" ? styles.tooltipTop : ""
      }`}
    >
      <div className={styles.name}>{spell.name}</div>

      <div className={styles.icons}>
        {spell.upcast && (
          <img
            src={upcastIcon}
            alt="Upcast"
            className={styles.icon}
            title="Upcast"
          />
        )}

        {Array.isArray(spell.damage) && spell.damage.length > 0 &&
          Array.from(
            new Set(spell.damage.map((dmg) => dmg.damageType?.toLowerCase() || "default"))
          ).map((type, i) => (
            <img
              key={i}
              src={`src/assets/icons/damage/${type}.png`}
              alt={type}
              className={styles.icon}
              title={type}
            />
          ))}

        {spell.url && (
          <a
            href={spell.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoLink}
            title="Ver más información del hechizo"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open(spell.url, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <img
            src={infoIcon}
            alt="Abrir información del hechizo"
            className={styles.infoIcon}
          />
        </a>
        )}
      </div>
    </div>
  );
}
