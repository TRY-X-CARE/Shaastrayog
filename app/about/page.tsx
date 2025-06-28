export default function AboutPage() {
  return (
    <>
      <section className="relative top-24">
        <div className="container mx-auto px-1 sm:px-6 bg-[#faf6f1] rounded-lg">
          <div className="flex flex-row gap-2 ">
            <div className="flex h-16 w-16 items-center justify-end">
              <p>Home /</p>
            </div>
            <div className="flex flex-col h-16 w-56 justify-center ">
              <p className="text-4xl ">About Us</p>
            </div>
          </div>
          <div className="flex flex-col gap-6  rounded-lg p-8">
            <h1 className="text-5xl">At ShaastraYog,</h1>
            <p className="text-lg">
              ShaastraYog is dedicated to providing authentic Ayurvedic products and promoting holistic well-being. We believe in the power of ancient Indian traditions to nourish the mind, body, and spirit. Our carefully curated selection of products is sourced with integrity and designed to support your journey towards a healthier, more balanced life.
            </p>
            <p className="text-lg">
              Our mission is to make the benefits of Ayurveda accessible to everyone. We are committed to quality, sustainability, and ethical practices. Whether you are seeking natural remedies, wellness supplements, or products for daily self-care, ShaastraYog is your trusted partner on the path to vitality and harmony.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
