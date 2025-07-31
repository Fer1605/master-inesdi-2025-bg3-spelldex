import styles from "./spell-tooltip.module.css";
import upcastIcon from "src/assets/icons/other/upcast.png";
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

        {Array.isArray(spell.damage) &&
          spell.damage.length > 0 &&
          spell.damage.map((dmg, i) => (
            <img
              key={i}
              src={`src/assets/icons/damage/${dmg.damageType?.toLowerCase() || "default"}.png`}
              alt={dmg.damageType || "Damage"}
              className={styles.icon}
              title={dmg.damageType || "Damage"}
            />
          ))}
      </div>
    </div>
  );
}

