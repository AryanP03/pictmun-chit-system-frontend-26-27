import * as React from "react"

import { cn } from "@/lib/utils"


function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card w-full h-140 justify-center text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

// Helper component: places the Card fixed to the right on large screens
// and displays it inline on small screens (responsive). Use this when you
// want the login card to "stick" to the right.
export function RightAlignedCard({
  children,
  wrapperClassName,
  cardClassName,
}: {
  children?: React.ReactNode
  wrapperClassName?: string
  cardClassName?: string
}) {
  return (
    <>
      {/* Fixed right on large screens */}
      <div className={cn("hidden lg:flex fixed right-0 top-0 h-full items-center pr-8", wrapperClassName)}>
        <div className="w-full max-w-md">
          <Card className={cn("h-auto shadow-lg", cardClassName)}>{children}</Card>
        </div>
      </div>

      {/* Fallback inline flow on small screens */}
      <div className={cn("lg:hidden w-full px-6", wrapperClassName)}>
        <div className="w-full max-w-md mx-auto">
          <Card className={cn("h-auto", cardClassName)}>{children}</Card>
        </div>
      </div>
    </>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
