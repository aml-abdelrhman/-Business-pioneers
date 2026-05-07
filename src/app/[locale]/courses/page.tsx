// src/app/[locale]/courses/page.tsx
import React from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { coursesQueryOptions } from "@/queries";
import Courses from "@/components/pages/courses/courses"; // Client component

interface PageProps {
  params: { locale: string };
}

const CoursesPage = async ({ params }: PageProps) => {
  const queryClient = new QueryClient();

  // Prefetch all courses
  try {
    await queryClient.prefetchQuery(coursesQueryOptions());
  } catch (error) {
    console.error("Failed to prefetch courses:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Courses />
    </HydrationBoundary>
  );
};

export default CoursesPage;