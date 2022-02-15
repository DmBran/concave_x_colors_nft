import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'
import React, { useEffect, useState } from 'react'

export default function FAQ() {
  const [activeFAQ, setFAQ] = useState('general')

  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <main className={'relative container mx-auto  '}>
            <div className="text-left align-left ">
              <nav className="border-gray-800 border-b-0 justify-start flex flex-row">
                <button
                  onClick={() => setFAQ('general')}
                  onClick={() => setFAQ('general')}
                  className={`${styles.menuItem} ${
                    activeFAQ === 'general' ? styles.menuActive : ''
                  }`}
                >
                  Minting
                </button>

                <button
                  onClick={() => setFAQ('minting')}
                  className={`${styles.menuItem} ${
                    activeFAQ === 'minting' ? styles.menuActive : ''
                  }`}
                >
                  Renting
                </button>

                <button
                  onClick={() => setFAQ('resync')}
                  className={`${styles.menuItem} ${
                    activeFAQ === 'resync' ? styles.menuActive : ''
                  }`}
                >
                  Recoloring
                </button>

                <button
                  onClick={() => setFAQ('staking')}
                  className={`${styles.menuItem} ${
                    activeFAQ === 'staking' ? styles.menuActive : ''
                  }`}
                >
                  Staking
                </button>
              </nav>
            </div>
            <div>
              {activeFAQ === 'general' && (
                <div
                  className={
                    'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-white items-center border-gray-800 border-8'
                  }
                >
                  <div>
                    <section className="text-gray-700">
                      <div className="container px-5 py-0 mx-auto">
                        <div className="mb-10">
                          <h1 className="text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 text-black text-gray-900 pt-0 mt-0 uppercase">
                            Frequently Asked Questions
                          </h1>
                          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                            The most common questions about Sync X Colors
                          </p>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              What utility will Sync NFTs have?
                            </p>

                            <span>
                              As publicized, our Syncs will grant eligibility to
                              be whitelisted for Concave Finance's token launch.
                              Holding Syncs through a snapshot will grant
                              retroactive airdrops of their token. It's also
                              been teased that all NFTs under their umbrella
                              will have their place in Concave's metaverse plan.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              What is the maximum number of{' '}
                              <a
                                href="https://opensea.io/collection/the-colors-dot-art"
                                target="_blank"
                                className={'underline'}
                              >
                                The Colors
                              </a>{' '}
                              tokens per mint?
                            </p>

                            <span>
                              You can use up the 3 The Colors in a mint.
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              Will the same{' '}
                              <a
                                href="https://opensea.io/collection/the-colors-dot-art"
                                target="_blank"
                                className={'underline'}
                              >
                                The Colors
                              </a>{' '}
                              always generate the same mint?
                            </p>

                            <span className="px-4 py-2">
                              No! Our algorithm will produce a background based
                              upon a random seed generated during mint. This
                              random seed will be used to generate the patterns.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p
                              id="multimint"
                              className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4"
                            >
                              What happens when I multi-mint with{' '}
                              <a
                                href="https://opensea.io/collection/the-colors-dot-art"
                                target="_blank"
                                className={'underline'}
                              >
                                The Colors
                              </a>{' '}
                              tokens?
                            </p>

                            <span>
                              When performing a multimint with a specific color
                              palette, each mint will be supplied the same color
                              palette combo, but will still yield a unique
                              generative result due to our algorithm.
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              Does the order of{' '}
                              <a
                                href="https://opensea.io/collection/the-colors-dot-art"
                                target="_blank"
                                className={'underline'}
                              >
                                The Colors
                              </a>{' '}
                              tokens matter?
                            </p>

                            <span>
                              Yes! Switching up the order of the colors passed
                              to the mint will yield different generative
                              results.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              Is there a way to see the outcome of{' '}
                              <a
                                href="https://opensea.io/collection/the-colors-dot-art"
                                target="_blank"
                                className={'underline'}
                              >
                                The Colors
                              </a>{' '}
                              rendering before mint?
                            </p>

                            <span>No, because where is the fun in that?</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How much does it cost to mint a Sync?
                            </p>

                            <span>
                              The mint price is{' '}
                              {process.env.NEXT_PUBLIC_MINT_COST} ETH, plus gas
                              costs
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How much does it cost to update my Sync X Color
                              NFT color palette?
                            </p>

                            <span className="px-4 py-2">
                              It will cost {process.env.NEXT_PUBLIC_COLOR_COST}{' '}
                              ETH for each update, plus gas costs.
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {activeFAQ === 'minting' && (
                <div
                  className={
                    'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-white items-center border-gray-800 border-8'
                  }
                >
                  <div>
                    <section className="text-gray-700">
                      <div className="container px-5 py-0 mx-auto">
                        <div className="mb-10">
                          <h1 className="text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 text-black text-gray-900 pt-0 mt-0 uppercase">
                            Frequently Asked Questions
                          </h1>
                          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                            The most common questions about Sync X Colors
                          </p>
                        </div>

                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          {/* <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                          <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                            I don't own any{' '}
                            <a
                              href="https://opensea.io/collection/the-colors-dot-art"
                              target="_blank"
                              className={'underline'}
                            >
                              The Colors
                            </a>
                            . Why should I mint a greyscale Sync?
                          </p>

                          <span>
                            All effects from Colors NFTs are purely visual.
                            Greys stand out on their own, with slick animations
                            and enough procedural variation to create unique
                            effects. As a nod to our roots, grey Syncs also have
                            a high chance to come with Concave Finance's
                            official colors included. Both grey and colored
                            versions will have equal weight and utility in the
                            Concave Finance plan; you are not getting something
                            less valuable in that regard. Also, the chance of
                            minting a rare token are the same regardless of
                            whether Colors NFTs are used.
                          </span>
                        </div> */}
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How do I rent Colors?
                            </p>

                            <span>
                              From the MINT page, navigate to the RENT COLORS
                              tab. From the interface, you will be shown a
                              selection of Colors tokens currently staked on our
                              platform. You can then choose up to 3 Colors and
                              mint directly from that page itself.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How do I choose colors for Rental?
                            </p>

                            <span>
                              We have deployed color picking tools on the
                              interface. Use the Hue Slider to sort Colors by
                              the closest approximate hue. While the exact color
                              shade picked may not be available, our site will
                              display the closest approximation based on what
                              you have picked.
                              <br />
                              <br />
                              You can also sort these by rental price, using the
                              Rental Price slider.
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2"></div>
                    </section>
                  </div>
                </div>
              )}
              {activeFAQ === 'resync' && (
                <div
                  className={
                    'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-white items-center border-gray-800 border-8'
                  }
                >
                  <div>
                    <section className="text-gray-700">
                      <div className="container px-5 py-0 mx-auto">
                        <div className="mb-10">
                          <h1 className="text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 text-black text-gray-900 pt-0 mt-0 uppercase">
                            Frequently Asked Questions
                          </h1>
                          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                            The most common questions about Sync X Colors
                          </p>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How do I update my Sync X Color NFT color palette?
                            </p>

                            <span className="px-4 py-2">
                              You can go to our official website, and click on
                              the Sync NFT you want to update. There, you will
                              be shown the option to update your Sync's color
                              palette.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              RENTING COLORS FOR RESYNCS ASKS ME TO APPROVE
                              TOKEN. WHAT DOES THIS MEAN?
                            </p>

                            <span className="px-4 py-2">
                              Recoloring with rentals requires your Sync to be
                              first transferred to our smart contract, which
                              naturally requires approval. Of course, the
                              recolored Sync will be transferred back to you
                              upon completion of the operation.
                              {/* <br /><br />
Single approval will only approve that particular Sync NFT to interact with our contract ONCE. Each subsequent recolor will need approvals as well.
<br /><br />
Approving all tokens is a one time approval that will allow you to skip single approvals in the future. If you wish to recolor multiple Syncs, or continue playing with the options, this would be recommended. */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {activeFAQ === 'staking' && (
                <div
                  className={
                    'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-white items-center border-gray-800 border-8'
                  }
                >
                  <div>
                    <section className="text-gray-700">
                      <div className="container px-5 py-0 mx-auto">
                        <div className="mb-10">
                          <h1 className="text-center mb-1 text-xl font-bold title-font sm:text-4xl text-3xl mb-4 text-black text-gray-900 pt-0 mt-0 uppercase">
                            Frequently Asked Questions
                          </h1>
                          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                            The most common questions about Sync X Colors
                          </p>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              How do I stake my Colors?
                            </p>

                            <span>
                              On our official website, go to the STAKING page.
                              Under the STAKE COLORS tab, select the Colors
                              tokens you wish to stake by clicking on them.
                              <br />
                              <br />
                              Enter your desired rental fee for these tokens.
                              You can either do this individually, or set the
                              same price for all at one go.
                              <br />
                              <br />
                              Then, you will first need to approve the contract
                              to interact with your Colors tokens. Finally,
                              click stake. Your Colors are now available to be
                              rented!
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              WHAT HAPPENS WHEN I STAKE MY COLORS?
                            </p>

                            <span>
                              Your Colors tokens will be staked in our smart
                              contract, and can be rented by anyone who wishes
                              to mint or recolor Syncs. You will accrue rental
                              fees each time your token is rented.
                              <br />
                              <br />
                              Your staked tokens will no longer be displayed as
                              'owned' by you. However, we issue ERC-721 receipts
                              in return, which can be used as proof of ownership
                              as required.
                              <br />
                              <br />
                              If your Colors are currently listed on Opensea,
                              they will be delisted automatically. However, upon
                              unstaking, this listing will automatically show up
                              on OS again, at the previously listed price. This
                              bug on OS has been well publicized by now. If you
                              do intend to stake your Colors, please be mindful
                              of this.
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg uppercase rounded-md py-2 px-4">
                              HOW DO I UNSTAKE MY COLORS, OR CLAIM MY ROYALTIES?
                            </p>

                            <span>
                              You can manage unstaking and claiming royalties in
                              the same page. Go to Staking, and select the
                              Unstake & Claim Royalties tab.
                              <br />
                              <br />
                              There are various options here, allowing you to
                              claim your royalties for individual rentals, claim
                              royalties for all your rentals, and unstake your
                              Colors tokens plus claim any royalties accrued.
                              Note that unstaking automatically claims any
                              royalties accrued.
                            </span>
                          </div>
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              I WANT TO CHANGE THE RENTAL FEE I CHARGE. HOW DO I
                              DO THIS?
                            </p>

                            <span>
                              In the Staking page, go to the Unstake & Claim
                              Royalties tab. Under your staked Colors, the field
                              that displays your current royalty fee is
                              editable. Edit the value to whatever you want, and
                              approve the update. Do note that this does cost
                              gas as well, so do set your royalty fees with
                              care.
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                          <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                            <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                              IS THERE A MINIMUM RENTAL FEE?
                            </p>

                            <span className="px-4 py-2">
                              Yes, the minimum threshold is 0.003 ETH. We
                              implemented this floor as we felt there should be
                              a floor value to the service that stakers provide.
                              Also, as a staker, why would you not want to
                              receive more fees?
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
