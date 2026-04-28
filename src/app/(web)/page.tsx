import Gallery from '@/components/Gallery/Gallery';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import PageSearch from '@/components/PageSearch/PageSearch';
import { getFeaturedRoom } from '@/libs/apis';
import FeaturedRoom from "@/components/FeaturedRoom/FeaturedRoom";
import PromotionalPopup from '@/components/PromotionalPopup/PromotionalPopup';

const Home = async () => {
  const featuredRoom = await getFeaturedRoom();
  return (
    <>
      <PromotionalPopup />
      <HeroSection/>
      <PageSearch/>
      <FeaturedRoom featuredRoom={featuredRoom}/>
      <Gallery/>
      <NewsLetter/>
    </>
  );
};

export default Home;