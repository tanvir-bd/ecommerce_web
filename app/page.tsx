import BannerCarousel from "@/components/home/BannerCarousel";
import BlogImages from "@/components/home/BlogImages";
import CategorySection from "@/components/home/CategorySection";
import CrazyDeals from "@/components/home/CrazyDeals";
import NeedOfWebsite from "@/components/home/NeedOfWebsite";
import ProductCard from "@/components/home/ProductCard";
import ReviewSection from "@/components/home/ReviewSection";
import SpecialCombos from "@/components/home/SpecialCombos";
import { fetchBestsellers, fetchNewArrivals, fetchOffersByType, fetchAllSubcategories } from "@/lib/api";

const HomePage = async () => {
  let specialCombos = [];
  let bestsellers = [];
  let newArrivals = [];
  let subcategories = [];
  let crazyDeals = [];

  try {
    [specialCombos, bestsellers, newArrivals, subcategories, crazyDeals] = await Promise.all([
      fetchOffersByType('special-combo').catch(() => []),
      fetchBestsellers(8).catch(() => []),
      fetchNewArrivals(8).catch(() => []),
      fetchAllSubcategories().catch(() => []),
      fetchOffersByType('crazy-deal').catch(() => []),
    ]);
  } catch (error) {
    console.error('Error fetching home page data:', error);
  }

  return (
    <div>
      <BannerCarousel />
      {specialCombos.length > 0 && <SpecialCombos data={specialCombos} />}
      {bestsellers.length > 0 && <ProductCard heading="BEST SELLERS" products={bestsellers} />}
      {subcategories.length > 0 && <CategorySection subcategories={subcategories} />}
      {crazyDeals.length > 0 && <CrazyDeals data={crazyDeals} />}
      {newArrivals.length > 0 && <ProductCard heading="NEW ARRIVALS" products={newArrivals} />}
      <NeedOfWebsite />
      <ReviewSection />
      <BlogImages />
    </div>
  );
};

export default HomePage;
