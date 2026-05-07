"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import ReactPlayer from "react-player";

interface VideoViewerProps {
  src: string;
  children: React.ReactNode;
  className?: string;
}

export default function VideoViewer({
  src = "",
  children,
  className,
}: VideoViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        className={cn(
          "cursor-pointer rounded-lg hover:opacity-90 transition-opacity",
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[90vw] sm:max-w-[70vw] max-h-[90vh] w-full h-auto p-0 bg-transparent border-0 z-51">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute start-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline-none"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <div className="relative w-full h-full min-h-[80svh] rounded-4xl overflow-hidden">
              <ReactPlayer
                src={src}
                className="w-full h-full! min-h-[80svh]"
                width="100%"
                height="100%"
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
