"use client"

import AboutSection from "../components/About";
import PageHeader from "../components/PageHeader";
import ReadySection from "../components/ReadySection";

export default function Home() {
  return (
    <div>
      <PageHeader />
      <AboutSection />
      <ReadySection />
    </div>
  );
}
