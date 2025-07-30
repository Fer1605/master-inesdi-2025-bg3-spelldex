import styles from "./spell-tooltip.module.css";
import upcastIcon from "src/assets/icons/other/upcast.png";
import type { Spell } from "src/models/spell";

type Props = {
  spell: Spell;
};

export function SpellTooltip({ spell }: Props) {
  return (
    <div className={styles.tooltip}>
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

        {spell.damage.map((dmg, i) => (
          <img
            key={i}
            src={`src/assets/icons/damage/${dmg.damageType.toLowerCase()}.png`}
            alt={dmg.damageType}
            className={styles.icon}
            title={dmg.damageType}
          />
        ))}
      </div>
    </div>
  );
}
