import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { coursesQueryOptions } from "@/queries";
import { Hero } from "@/components/pages/Home/Hero";
import About from "@/components/pages/Home/About";
import Process from "@/components/pages/Home/Process";
import Mastery from "@/components/pages/Home/mastery";
import Map from "@/components/pages/Home/Map";
import Partners from "@/components/pages/Home/partners";
import Projects from "@/app/[locale]/projects/page";
import BestSellers from "@/components/pages/projects/BestSellers";

// import ClosedProjectsSection from "@/components/pages/home/closed-projects-section";
// import HomeHeroSection from "@/components/pages/home/home-hero";
// import LatestProjectsSection from "@/components/pages/home/latest-projects-section";
// import MostSoldProjectsSection from "@/components/pages/home/most-sold-projects-section";
// import NewsSection from "@/components/pages/home/news-section";
// import FeaturedProjectsSection from "@/components/pages/home/featured-projects-section";
// import StatisticsSection from "@/components/pages/home/statistics-section";
// import SuccessPartnersSection from "@/components/pages/home/success-partners-section";

const HomePage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    // queryClient.prefetchQuery(projectsQueryOptions({ latest: true })),
    // queryClient.prefetchQuery(projectsQueryOptions({ featured: true })),
    // queryClient.prefetchQuery(projectsQueryOptions({ most_sold: true })),
    // queryClient.prefetchQuery(projectsQueryOptions({ status: "sold" })),
    // queryClient.prefetchQuery(newsQueryOptions({ limit: 4 })),
    queryClient.prefetchQuery(coursesQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <HomeHeroSection />
      <LatestProjectsSection />
      <FeaturedProjectsSection />
      <MostSoldProjectsSection />
      <StatisticsSection />
      <SuccessPartnersSection />
      <ClosedProjectsSection />
      <NewsSection /> */}

      <Hero />
      <About />

      <Projects />

      <Map />

      <Mastery />
            <BestSellers />

      <Partners />
    </HydrationBoundary>
  );
};

export default HomePage;
