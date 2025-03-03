import { useRef } from "react";
import BracketMatch from "./bracket-match";
import { useMatchesStore } from "@/stores/matches-store";
import { useShallow } from "zustand/react/shallow";

const BracketStructure = () => {
  const matches = useMatchesStore(useShallow((state) => state.rounds));
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for layout
  const MATCH_WIDTH = 220;
  const MATCH_HEIGHT = 56;
  const LEVEL_SPACING = 14;
  const PADDING = 0;
  const VERTICAL_SPACING = 60;
  const MIN_WIDTH = MATCH_WIDTH + PADDING * 2; // Minimum width to show one match
  const MIN_HEIGHT = MATCH_HEIGHT + PADDING * 2 + 115; // Minimum height to show one match

  const calculateRequiredDimensions = () => {
    const numRounds = matches.length;
    const maxMatchesInRound = Math.max(...matches.map((round) => round.length));

    const requiredWidth = Math.max(
      numRounds * (MATCH_WIDTH + LEVEL_SPACING) - LEVEL_SPACING + PADDING * 2,
      MIN_WIDTH
    );
    const requiredHeight = Math.max(
      maxMatchesInRound * (MATCH_HEIGHT + VERTICAL_SPACING) -
        VERTICAL_SPACING +
        PADDING * 2,
      MIN_HEIGHT
    );

    return { height: requiredHeight, width: requiredWidth };
  };

  const calculateNodePosition = (
    roundIndex: number,
    matchIndex: number,
    roundMatches: number
  ) => {
    const x = PADDING + roundIndex * (MATCH_WIDTH + LEVEL_SPACING);
    const totalHeight = calculateRequiredDimensions().height - PADDING * 2;
    const spacing = totalHeight / (roundMatches + 1);
    const y = PADDING + spacing * (matchIndex + 1) - MATCH_HEIGHT / 2;
    return { x, y };
  };

  const createConnectorPath = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number
  ) => {
    const midX = sourceX + (targetX - sourceX) / 2;
    return `M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`;
  };

  const { width: svgWidth, height: svgHeight } = calculateRequiredDimensions();

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-auto">
      {/* SVG layer for connectors */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMinYMin meet"
      >
        <g>
          {matches.map((round, roundIndex) =>
            round.map((match, matchIndex) => {
              if (roundIndex < matches.length - 1) {
                const nextRoundIndex = roundIndex + 1;
                const nextMatchIndex = Math.floor(matchIndex / 2);

                if (matches[nextRoundIndex]?.[nextMatchIndex]) {
                  const pos = calculateNodePosition(
                    roundIndex,
                    matchIndex,
                    round.length
                  );
                  const nextPos = calculateNodePosition(
                    nextRoundIndex,
                    nextMatchIndex,
                    matches[nextRoundIndex].length
                  );

                  return (
                    // If one of the players is null (a bye scenario) then don't render
                    !match.byeMatch && (
                      <path
                        key={`connector-R${roundIndex}-M${matchIndex}`}
                        d={createConnectorPath(
                          pos.x + MATCH_WIDTH,
                          pos.y + MATCH_HEIGHT / 2,
                          nextPos.x,
                          nextPos.y + MATCH_HEIGHT / 2
                        )}
                        stroke="#94a3b8"
                        strokeWidth={2}
                        fill="none"
                      />
                    )
                  );
                }
              }
              return null;
            })
          )}
        </g>
      </svg>

      {/* Match nodes layer */}
      <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
        {matches.map((round, roundIndex) =>
          round.map((match, matchIndex) => {
            const pos = calculateNodePosition(
              roundIndex,
              matchIndex,
              round.length
            );

            return (
              // If one of the players is null (a bye scenario) then don't render
              !match.byeMatch && (
                <BracketMatch
                  key={`R${roundIndex}-M${matchIndex}`}
                  match={match}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                  }}
                />
              )
            );
          })
        )}
      </div>
    </div>
  );
};

export default BracketStructure;
