import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import BracketPanel from "../features/bracket/bracket-panel/bracket-panel"
import BracketView from "@/features/bracket/bracket-view/bracket-view"
import BracketDialogManager from "@/features/bracket/components/bracket-dialog-manager"
import useBracketQuery from "@/features/bracket/hooks/useBracketQuery"
import { useIsMobile } from "@/hooks/use-mobile"
import * as Tabs from "@radix-ui/react-tabs"
import { Brackets, Settings } from "lucide-react"
import { useParams } from "react-router-dom"
import InformationPanel from "@/features/bracket/bracket-panel/components/info-panel/information-panel"
import { useState } from "react"
import ParticipantsPanel from "@/features/bracket/bracket-panel/components/participants-panel/participants-panel"
import PlayPanel from "@/features/bracket/bracket-panel/components/play-panel/play-panel"

const BracketPage = () => {
  // Extract the bracket id from the URL and check if it exists
  const params = useParams()
  if (params.bracketId === undefined) {
    console.error("Bracket ID not found in URL")
  }
  const bracketId = parseInt(params.bracketId!)

  const query = useBracketQuery(bracketId)

  // Move to BracketMobileLayout component
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [isPlayOpen, setIsPlayOpen] = useState(false)

  if (query?.isLoading) return <>Loading...</>

  return (
    <div className="flex-1 flex flex-col bg-figma_shade2">
      {/* Desktop Layout */}
      <div className="w-full flex-1 hidden md:flex gap-5">
        <BracketPanel />
        <div className="w-full overflow-auto">
          <BracketView />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full flex-1 flex flex-col  text-white">
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
            className="h-full flex-1 bg-figma_neutral8 p-4 space-y-4"
          >
            {/* Panel */}

            {/* Bracket Info */}
            <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
              <CollapsibleTrigger className="text-figma_grey text-label uppercase w-fit">
                Bracket Information
              </CollapsibleTrigger>
              <CollapsibleContent>
                <InformationPanel isTitleVisible={false} />
              </CollapsibleContent>
            </Collapsible>

            {/* Participant Info */}
            <Collapsible
              open={isParticipantsOpen}
              onOpenChange={setIsParticipantsOpen}
            >
              <CollapsibleTrigger className="text-figma_grey text-label uppercase w-fit">
                Participants List
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ParticipantsPanel isTitleVisible={false} />
              </CollapsibleContent>
            </Collapsible>

            {/* Participant Info */}
            <Collapsible open={isPlayOpen} onOpenChange={setIsPlayOpen}>
              <CollapsibleTrigger className="text-figma_grey text-label uppercase w-fit">
                Bracket Status
              </CollapsibleTrigger>
              <CollapsibleContent>
                <PlayPanel isTitleVisible={false} />
              </CollapsibleContent>
            </Collapsible>
          </Tabs.Content>
          <Tabs.Content
            value="bracket"
            className="h-full overflow-auto flex-1 mt-4"
          >
            {/* Bracket */}
            <BracketView />
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <BracketDialogManager />
    </div>
  )
}

export default BracketPage
