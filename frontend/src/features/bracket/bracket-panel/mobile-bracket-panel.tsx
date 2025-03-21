import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import * as Tabs from "@radix-ui/react-tabs"

import { Brackets, ChevronDown, Settings } from "lucide-react"

import InformationPanel from "@/features/bracket/bracket-panel/components/info-panel/information-panel"
import PlayProgress from "@/features/bracket/bracket-panel/components/play-panel/play-progress"
import SaveChangesPanel from "@/features/bracket/bracket-panel/components/play-panel/save-changes-panel"
import ParticipantsPanel from "@/features/bracket/bracket-panel/components/participants-panel/participants-panel"
import BracketView from "../bracket-view/bracket-view"

import { useState } from "react"
import { cn } from "@/lib/utils"

const MobileBracketPanel = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  return (
    <div className="md:hidden w-full flex-1 flex flex-col text-white">
      <Tabs.Root defaultValue="panel" className="h-full flex flex-col flex-1">
        <Tabs.List className="h-12 shadow-lg bg-figma_neutral7 grid grid-cols-2">
          <Tabs.Trigger
            value="panel"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-figma_neutral8 transition-colors"
          >
            <Settings />
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger
            value="bracket"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-figma_neutral8 transition-colors"
          >
            <Brackets />
            Bracket
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="panel"
          className="h-full flex-1 bg-figma_neutral8 px-4 py-8 space-y-12"
        >
          {/* Bracket Info */}
          <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
            <CollapsibleTrigger className="text-figma_grey hover:text-figma_grey/80 text-label text-lg uppercase flex items-center justify-between w-full">
              Bracket Information
              <ChevronDown
                className={cn(
                  "transition-transform duration-200",
                  isInfoOpen && "rotate-180 transform"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <InformationPanel isTitleVisible={false} />

              <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
                <PlayProgress />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Participant List */}
          <Collapsible
            open={isParticipantsOpen}
            onOpenChange={setIsParticipantsOpen}
          >
            <CollapsibleTrigger className="text-figma_grey hover:text-figma_grey/80 text-label text-lg uppercase flex items-center justify-between w-full">
              Participants List
              <ChevronDown
                className={cn(
                  "transition-transform duration-200",
                  isParticipantsOpen && "rotate-180 transform"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ParticipantsPanel isTitleVisible={false} />
            </CollapsibleContent>
          </Collapsible>

          {/* Save Changes */}
          <SaveChangesPanel />
        </Tabs.Content>
        <Tabs.Content
          value="bracket"
          className="h-full overflow-auto flex-1 mt-4 pl-4"
        >
          {/* Bracket */}
          <BracketView />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default MobileBracketPanel
