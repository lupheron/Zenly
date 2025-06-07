"use client"

import AboutSection from "../components/About";
import Comments from "../components/Comments";
import PageHeader from "../components/PageHeader";
import PopularActivity from "../components/PopActivitiy";
import ReadySection from "../components/ReadySection";

export default function Home() {
  return (
    <div>
      <PageHeader />
      <AboutSection />
      <ReadySection />
      <PopularActivity />
      <Comments />
    </div>
  );
}
