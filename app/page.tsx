import CatanCase from "@/components/CatanCase";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import DataCoCase from "@/components/DataCoCase";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MLLab from "@/components/MLLab";
import Nav from "@/components/Nav";
import RevealRoot from "@/components/RevealRoot";
import SectionHead from "@/components/SectionHead";
import Toolkit from "@/components/Toolkit";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />

        <section className="section section--work" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <SectionHead
              index="01"
              alias="experiments"
              title={
                <span id="work-title">
                  Things I&rsquo;ve <em>built</em>.
                </span>
              }
              lede="Three case studies: a reinforcement-learning agent, a Power BI build, and a lab of smaller models. Every number on this page comes from the project it describes."
            />
            <CatanCase />
            <DataCoCase />
            <MLLab />
          </div>
        </section>

        <Experience />
        <Education />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
      <RevealRoot />
    </>
  );
}
