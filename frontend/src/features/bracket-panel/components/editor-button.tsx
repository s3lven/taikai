import { Button } from "@headlessui/react";
import { MouseEventHandler } from "react";

interface EditorButtonProps {
  text: string | JSX.Element;
  onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  variant?: string
  className?: string
  disabled?: boolean
}

const buttonVariants: Record<string, string> = {
    "DEFAULT": "bg-figma_secondary hover:bg-figma_secondary/80",
    "no-outline": "hover:bg-figma_neutral7"
}

const EditorButton = ({ text, onClickHandler, variant="DEFAULT", className, disabled=false }: EditorButtonProps) => {
  return (
    <Button
      className={`flex justify-center items-center px-5 py-1.5 text-white text-label uppercase rounded
        transtion-colors ease-in-out duration-150 ${className} outline-none disabled:opacity-50
        ${buttonVariants[variant]}`}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default EditorButton;
