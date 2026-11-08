import React, { useState } from "react";
import { Search, ChevronRight, Bookmark } from "lucide-react";
import { useApp } from "../context/AppContext";
import { INITIAL_FACULTIES } from "../data/mockData";
import { Program } from "../types";

export const ProgramsListView: React.FC = () => {
  const { language, programs, navigateTo, isItemSaved, saveItem, removeItem } =
    useApp();

  const isFr = language === "fr";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<
    "undergraduate" | "postgraduate"
  >("undergraduate");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = p.level === selectedLevel;
    const matchesFaculty =
      selectedFaculty === "all" || p.facultyName === selectedFaculty;

    return matchesSearch && matchesLevel && matchesFaculty;
  });

  const handleToggleSave = (e: React.MouseEvent, program: Program) => {
    e.stopPropagation();
    if (isItemSaved("program", program.id)) {
      removeItem(program.id);
    } else {
      saveItem({
        type: "program",
        title: program.name,
        subtitle: `${program.degreeType} · ${program.facultyName}`,
        data: program,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1164px] programme-page px-5 pb-28 pt-6 sm:px-8 md:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="page-title text-ink">Programmes</h1>
          <p className="page-lede mt-1">
            {isFr
              ? "Trouvez votre programme : diplômes, durée et frais annuels."
              : "Find your field of study. Explore degrees, duration and annual fees."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo("/program-comparison")}
          className="min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
        >
          {isFr ? "Comparer les programmes" : "Compare programmes"}
        </button>
      </div>

      <div className="programme-tools">
        <div className="flex flex-wrap gap-2">
          {(["undergraduate", "postgraduate"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level)}
              aria-pressed={selectedLevel === level}
              className="chip"
            >
              {level === "undergraduate"
                ? isFr
                  ? "Premier cycle"
                  : "Undergraduate"
                : isFr
                  ? "Cycles supérieurs"
                  : "Postgraduate"}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFr
                  ? "Rechercher un programme ou une faculté"
                  : "Search programmes, faculties or departments"
              }
              aria-label={
                isFr ? "Rechercher un programme" : "Search programmes"
              }
              className="field pl-10"
            />
          </div>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            aria-label={isFr ? "Filtrer par faculté" : "Filter by faculty"}
            className="field w-auto min-w-[200px]"
          >
            <option value="all">
              {isFr ? "Toutes les facultés" : "All faculties"}
            </option>
            {INITIAL_FACULTIES.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-5 mb-3 text-[14px] text-muted">
        {filteredPrograms.length}{" "}
        {filteredPrograms.length === 1 ? "programme" : "programmes"}
      </p>

      {filteredPrograms.length === 0 ? (
        <div className="mt-4">
          <p className="text-[16px] text-ink">
            {isFr
              ? "Aucun programme ne correspond à ces filtres."
              : "No programmes match these filters."}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            {isFr
              ? "Essayez un autre terme ou une autre faculté."
              : "Try a different search term or faculty."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedFaculty("all");
            }}
            className="mt-3 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
          >
            {isFr ? "Effacer les filtres" : "Clear filters"}
          </button>
        </div>
      ) : (
        <div className="programme-results">
          {filteredPrograms.map((program) => {
            const isSaved = isItemSaved("program", program.id);

            return (
              <div key={program.id} className="row-link">
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(`/programs/${program.id}`, {
                      programId: program.id,
                    })
                  }
                  className="min-w-0 flex-1 py-1 text-left"
                >
                  <span className="block text-[14px] text-muted">
                    {program.facultyName} · {program.duration}
                  </span>
                  <span className="mt-0.5 block text-[16px] font-medium text-ink">
                    {program.name}
                  </span>
                  <span className="mt-0.5 block text-[14px] text-muted">
                    {program.degreeType}
                    <span className="sm:hidden">
                      {" "}
                      · {program.annualFee.toLocaleString()} {program.currency}{" "}
                      / {isFr ? "an" : "year"}
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <span className="tnum hidden text-right text-[16px] font-medium text-ink sm:block">
                    {program.annualFee.toLocaleString()} {program.currency}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(e, program)}
                    className={`flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors hover:bg-raised ${
                      isSaved ? "text-accent" : "text-muted hover:text-ink"
                    }`}
                    aria-label={
                      isSaved
                        ? isFr
                          ? `Retirer ${program.name} des favoris`
                          : `Remove ${program.name} from saved`
                        : isFr
                          ? `Enregistrer ${program.name}`
                          : `Save ${program.name}`
                    }
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                    />
                  </button>
                  <ChevronRight
                    className="h-4 w-4 text-muted"
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
