import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClassGrid } from "src/components/class-grid";
import { SpellDiagram } from "src/components/spell-diagram";
import type { ClassId } from "src/models/character-class";
import styles from "./app.module.css";

// Componente wrapper para la vista con clase seleccionada
function ClassView() {
  const { className } = useParams();
  const navigate = useNavigate();

  const [highlightedClass, setHighlightedClass] = useState<ClassId>();

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      navigate("/");
    }
  };

  useEffect(() => {
    setHighlightedClass(className as ClassId);
  }, [className]);

  return (
    <main className={styles.main} onKeyDown={onKeyDown} tabIndex={0}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={className as ClassId}
        background={false}
      />
      <ClassGrid
        selectedClass={className as ClassId}
        background={true}
        highlight={setHighlightedClass}
        onClick={(cls) => navigate(`/${cls}`)}
      />
    </main>
  );
}

// Componente para la vista inicial sin clase seleccionada
function HomeView() {
  const [highlightedClass, setHighlightedClass] = useState<ClassId>();
  const navigate = useNavigate();

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <main className={styles.main} onKeyDown={onKeyDown} tabIndex={0}>
      <SpellDiagram
        highlightedClass={highlightedClass}
        selectedClass={undefined}
        background={true}
      />
      <ClassGrid
        selectedClass={undefined}
        background={false}
        highlight={setHighlightedClass}
        onClick={(cls) => navigate(`/${cls}`)}
      />
    </main>
  );
}

// El componente App ahora usa rutas
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/:className" element={<ClassView />} />
    </Routes>
  );
}