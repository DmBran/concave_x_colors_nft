import Image from "next/image";

function Gallery() {

    return (
        <>
            <ul className="grid md:grid-cols-6 gap-4">
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>GREYSCALE COMMON <br/>&#9679;</h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/grey_c2.svg"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>COLOR COMMON <br/>&#9679;</h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>UNCOMMON <br/> Drift<br/>&#10023; </h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>UNCOMMON <br/>Drift Mosaic <br/>&#10022; </h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>RARE <br/>Silver <br/>&#9734; </h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/rare_silver1.svg"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <div className='flex bg-green-200 justify-center opacity-75 h-full w-full'>
                        <h1 className=' flex title-font sm:text-2xl text-xl font-black text-center items-center'>ULTRA RARE? <br/>&#9733; </h1>
                    </div>
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
                <li>
                    <Image className='w-full bg-gray-100 object-cover object-center flex-shrink-0'
                           alt='team icon'
                           src="/static/500x500.png"
                           width='500'
                           height='500'
                    />
                </li>
            </ul>
        </>

    )
=======
import Image from 'next/image'
import styles from '../styles/meme.module.css'

function Gallery() {
  return (
    <>
      <div className={styles.playpause}>
        <ul className="grid md:grid-cols-6 gap-4">
          <li>
            <Image
              className={styles.playpause}
              alt="team icon"
              src="/static/grey_c2.svg"
              width="500"
              height="500"
            />
          </li>
          <li>
            <div className="flex bg-green-200 justify-center opacity-75 h-full w-full">
              <h1 className=" flex title-font sm:text-2xl text-xl font-black text-center items-center">
                GREYSCALE COMMON <br />
                &#9679;
              </h1>
            </div>
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <div className="flex bg-green-200 justify-center opacity-75 h-full w-full">
              <h1 className=" flex title-font sm:text-2xl text-xl font-black text-center items-center">
                UNCOMMON? <br />
                &#10023;{' '}
              </h1>
            </div>
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <div className="flex bg-green-200 justify-center opacity-75 h-full w-full">
              <h1 className=" flex title-font sm:text-2xl text-xl font-black text-center items-center">
                SUPER <br />
                UNCOMMON? <br />
                &#10022;{' '}
              </h1>
            </div>
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <div className="flex bg-green-200 justify-center opacity-75 h-full w-full">
              <h1 className=" flex title-font sm:text-2xl text-xl font-black text-center items-center">
                RARE? <br />
                &#9734;{' '}
              </h1>
            </div>
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/rare_silver1.svg"
              width="500"
              height="500"
            />
          </li>
          <li>
            <div className="flex bg-green-200 justify-center opacity-75 h-full w-full">
              <h1 className=" flex title-font sm:text-2xl text-xl font-black text-center items-center">
                ULTRA RARE? <br />
                &#9733;{' '}
              </h1>
            </div>
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
          <li>
            <Image
              className="w-full bg-gray-100 object-cover object-center flex-shrink-0"
              alt="team icon"
              src="/static/500x500.png"
              width="500"
              height="500"
            />
          </li>
        </ul>
      </div>
    </>
  )
}

export default Gallery
