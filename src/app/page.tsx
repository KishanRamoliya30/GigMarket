import Header from "@/components/user/header/Header";
import Footer from "@/components/user/footer/Footer";


import HomeBanner from "@/components/landing/HeroBanner";
import Companies from "@/components/landing/Compines";
import PopularServices from "@/components/landing/PopulerServices";
import Everything from "@/components/landing/Everything";
import JoinFiverr from "@/components/landing/JoinFiveer";
import FiverrBusiness from "@/components/landing/FiverrBusiness";
import FreelancerBenefits from "@/components/landing/FreelancerBenefits";
import MadeOnFiverr from "@/components/landing/MadeOnFiverr";
import TrustedServices from "@/components/landing/TrustedService";

export default function Home() {
  return (
    <>
      <Header />
      <HomeBanner/>
      <Companies/>
      <PopularServices/>
      <Everything/>
      <FiverrBusiness/>
      <TrustedServices/>
      <FreelancerBenefits/>
      <MadeOnFiverr/>
      <JoinFiverr/>
      <Footer />
    </>
  );
}
