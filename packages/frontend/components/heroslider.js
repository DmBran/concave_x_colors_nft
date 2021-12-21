import React,{useState, useEffect} from 'react'

function HeroSlider() {

    const [index, setIndex] = useState(0)
    const [index1, setIndex1] = useState(1)

    const [transL , setTransL] = useState(false)
    const [transR , setTransR] = useState(false)

    useEffect(() => {
        if(transR) {
            setTimeout(() => {
                setTransR(false)
            } , 800)
        }
        if(transL) {
            setTimeout(() => {
                setTransL(false)
                setIndex((index + 1) % images.length)
                setIndex1((index1 + 1) % images.length)
            }, 800 )
        }
    }, [transL , transR])

    const images = [
        '/static/urare_driftedge2.svg',
        '/static/urare_gold.svg',
        '/static/urare_gold1.svg',
        '/static/rare_silver4.svg',
        '/static/rare_silver2.svg',
        '/static/grey_c2.svg',
        '/static/grey_c8.svg',


    ]
    const handlePrev = () => {
        setTransR(true)
        setTransL(false)

        const nextIndex = index - 1 ;
        const nextIndex1 = index1 - 1 ;

        if(nextIndex < 0 ) {
            setIndex(images.length - 1)
        } else {
            setIndex(nextIndex)
        }
        if(nextIndex1 < 0) {
            setIndex1(images.length - 1)
        } else {
            setIndex1(nextIndex1)
        }


    }
    const handleNext = () => {
        setTransL(true)
        setTransR(false)

    }

    return (
        <>
            <div className='flex h-2/3 mx-auto my-0 space-x-4 items-center '>
                <button className='h-10 w-10 items-center bg-green-200 font-bold text-4xl rounded-full' onClick={handlePrev}>{"<"}</button>
                <div className="flex md:border-4 border-gray-900 overflow-hidden">

                    <img className={`flex object-contain z-20 w-full h-full p-4
                     ${transL ? 'transition duration-300 ease-in-out transform -translate-x-full' : transR ? 'animate-slideL' : '' } `} src={images[index]} alt="1234" label="asdasjh"
                    />

                    <img className={`flex object-contain z-20 w-full h-full p-4 
                    ${transL ? 'animate-slideR' : transR ? 'transition duration-300 ease-in-out transform translate-x-full' : '' } `} src={images[index]} alt="4567" label="lasdsd"
                    />

                </div>
                <button className='h-10 w-10 bg-green-200 font-bold text-4xl rounded-full' onClick={handleNext}>{">"}</button>

            </div>
        </>

    )
}

export default HeroSlider