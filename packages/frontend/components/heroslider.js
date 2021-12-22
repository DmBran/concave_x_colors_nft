import React from 'react'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'


function HeroSlider() {
  const images = [
    '/static/urare_driftedge2.svg',
    '/static/urare_gold.svg',
    '/static/urare_gold1.svg',
    '/static/rare_silver4.svg',
    '/static/rare_silver2.svg',
    '/static/grey_c2.svg',
    '/static/grey_c8.svg',
    '/static/Olympus_574_Colors2.svg',
    '/static/Mosaic_457_Colors1.svg',
    '/static/Common_886_Colors3.svg'
  ]

  return (
    <>
      <div className="w-full mx-auto my-0 space-x-4 items-center ">
        <div className="md:border-4 mx-auto border-gray-900">
          <Slide transitionDuration={250} autoplay={false}>
            {images.map((image, index) => (
              <div className="each-slide" key={index}>
                <img className="w-3/4 h-3/4 p-4 mx-auto" src={image} />
              </div>
            ))}
          </Slide>
        </div>
      </div>
    </>
  )
}

export default HeroSlider
