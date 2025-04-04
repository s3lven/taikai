import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="w-screen flex-1 flex flex-col items-center justify-center bg-figma_dark">
      <div className="w-full container mx-auto px-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="lg:text-headline text-center text-base tracking-[0.5px] text-white">
              Never miss your next match
            </p>
            <p className="lg:text-header text-center font-bold text-[32px] tracking-[0.5px] leading-10 text-white ">
              Welcome to Taikai
            </p>
          </div>
          <p className="lg:text-xl lg:leading-8 text-center text-base tracking-[0.5px] text-white text-balance lg:w-1/2 mx-auto">
            Taikai provides intuitive bracket creation, real-time match updates,
            and easy navigation to ensure your taikai runs smoothly.
          </p>
        </div>
        <div className="md:flex gap-4 items-center justify-center">
          <Link to={"/dashboard"} className="w-full lg:w-fit">
            <Button
              className="bg-figma_secondary hover:bg-figma_secondary/80 text-white hover:text-white font-poppins w-full"
              variant="outline"
              size="lg"
            >
              Get Started
            </Button>
          </Link>
          {/* <Link to={"/dashboard"} className="w-full lg:w-fit">
            <Button
              className="mt-4 md:mt-0 bg-background hover:bg-background/90 text-figma_secondary hover:text-figma_secondary font-poppins w-full"
              variant="outline"
              size="lg"
            >
              Explore
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default HomePage
