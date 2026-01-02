'use client';

export const Banner = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Desktop Banner */}
        <div className="hidden md:block">
          <img
            src="/5.png"
            alt="Fashion Banner"
            className="w-full h-64 lg:h-80 object-cover rounded-2xl"
          />
        </div>
        
        {/* Mobile Banner */}
        <div className="md:hidden">
          <img
            src="/12.png"
            alt="Fashion Banner Mobile"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};