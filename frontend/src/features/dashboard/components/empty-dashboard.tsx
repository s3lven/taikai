import { Button } from '@/components/ui/button'


const EmptyDashboard = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full flex-1">
        <h1 className="text-figma_dark text-title">There&apos;s nothing here!</h1>
        <h1 className="text-figma_dark text-title">Let&apos;s fix that.</h1>
        <Button
          className="rounded-lg px-5 py-3 text-button-lg text-white bg-figma_primary
                  data-[hover]:bg-figma_primary-hover"
        >
          Create New Taikai
        </Button>
      </div>
    )
  }

export default EmptyDashboard