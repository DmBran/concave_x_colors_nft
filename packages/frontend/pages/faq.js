import React from 'react'
import { Footer } from '../components/footer'
import { MetaHead } from '../components/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/meme.module.css'

export default function Display() {
  return (
    <div className={styles.mainContainer}>
      <MetaHead />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          <div
            className={
              'text-center justify-center container mx-auto flex px-5 py-24 md:flex-row flex-col bg-gray-300 bg-opacity-50 items-center border-gray-800 border-8'
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
                        All effects from Colors NFTs are purely visual. Greys
                        stand out on their own, with slick animations and enough
                        procedural variation to create unique effects. As a nod
                        to our roots, grey Syncs also have a high chance to come
                        with Concave Finance's official colors included. Both
                        grey and colored versions will have equal weight and
                        utility in the Concave Finance plan; you are not getting
                        something less valuable in that regard. Also, the chance
                        of minting a rare token are the same regardless of
                        whether Colors NFTs are used.
                      </span>
                    </div>
                    <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                      <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                        What utility will Sync NFTs have?
                      </p>

                      <span>
                        As publicized, our Syncs will grant eligibility to be
                        whitelisted for Concave Finance's token launch. Holding
                        Syncs through a snapshot will grant retroactive airdrops
                        of their token. It's also been teased that all NFTs
                        under their umbrella will have their place in Concave's
                        metaverse plan.
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                    <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                      <p className="font-bold text-black text-lg uppercase rounded-md py-2 px-4">
                        Can{' '}
                        <a
                          href="https://opensea.io/collection/the-colors-dot-art"
                          target="_blank"
                          className={'underline'}
                        >
                          The Colors
                        </a>{' '}
                        tokens be reused?
                      </p>

                      <span>
                        Yes! You can reuse your Colors NFTs as many times as you
                        want. If you have minted multiple Syncs, your Colors
                        NFTs can be synced multiple times to Color different
                        Syncs.
                      </span>
                    </div>
                    <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                      <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                        What are{' '}
                        <a
                          href="https://opensea.io/collection/the-colors-dot-art"
                          target="_blank"
                          className={'underline'}
                        >
                          The Colors
                        </a>{' '}
                        tokens for?
                      </p>

                      <span>
                        All Sync NFTs start as greyscale NFTs. The Colors tokens
                        can be used to colorize your Sync NFTs. Up to 3 Colors
                        can be synced during the minting process. This will
                        generate a uniquely colored Sync NFT, corresponding to
                        the Colors chosen.
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
                        No! Our algorithm will produce a background based upon a
                        random seed generated during mint. This random seed will
                        be used to generate the patterns.
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
                        palette combo, but will still yield a unique generative
                        result due to our algorithm.
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
                    <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                      <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                        How do I update my Sync X Color NFT color palette?
                      </p>

                      <span className="px-4 py-2">
                        You can go to our official website, and click on the
                        Sync NFT you want to update. There, you will be shown
                        the option to update your Sync's color palette.
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

                      <span>You can mint up to 10 Syncs at a time.</span>
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
                        Yes! Switching up the order of the colors passed to the
                        mint will yield different generative results.
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

                      <span>The mint price is 0.05 ETH, plus gas costs</span>
                    </div>
                    <div className="w-full lg:w-1/2 px-4 py-2 mb-4">
                      <p className="font-bold text-black text-lg  uppercase rounded-md py-2 px-4">
                        How much does it cost to update my Sync X Color NFT
                        color palette?
                      </p>

                      <span className="px-4 py-2">
                        It will cost 0.005 ETH for each update, plus gas costs.
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
