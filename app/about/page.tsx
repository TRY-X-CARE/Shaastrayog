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
              ShaastraYog is a wellness brand dedicated to providing a range of authentic Ayurvedic products, including pure Himalayan Shilajit. We focus on offering high-quality, natural wellness solutions rooted in the ancient traditions of Ayurveda.
            </p>
            <p className="text-lg">
              Our mission is to make the benefits of genuine Ayurvedic products accessible to everyone. We are committed to quality, authenticity, and ethical sourcing. If you are seeking the purest Ayurvedic products for your daily wellness, ShaastraYog is your trusted partner.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
