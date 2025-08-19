import React from 'react'
import GigListing from '@/components/gigs/GigList'
const page = () => {
  return (
    <>
      <section
        className="w-full bg-cover bg-center bg-no-repeat px-6 py-20 md:px-6 lg:px-6"
        style={{ backgroundImage: "url('https://demoapus1.com/freeio/wp-content/uploads/2022/09/about-bg.jpg')" }}
      // style="background-image: url('https://demoapus1.com/freeio/wp-content/uploads/2022/09/about-bg.jpg');"
      >
        <div className="mx-auto">
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Design & Creative
          </h2>

          <p className="mt-4 text-lg text-white md:text-xl">
            Give your visitor a smooth online experience with a solid UX design
          </p>
        </div>
      </section>
      <GigListing self />
    </>
  )
}

export default page