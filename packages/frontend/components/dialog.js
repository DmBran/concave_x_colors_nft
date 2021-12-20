import { Dialog } from '@headlessui/react'
import styles from '../styles/meme.module.css'
import Link from 'next/link'
import { Loader } from './loader'

const ModalDialog = ({ isOpen, setIsOpen, svg }) => {
  return (
    <Dialog
      className="fixed inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative rounded lg:w-1/2 sm:w-full mx-auto p-8">
          <Dialog.Overlay />
          <button
            className="text-black text-3xl font-bold uppercase absolute"
            style={{
              top: '45px',
              right: '55px',
            }}
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          <div
            className={
              'w-full py-20 px-10 bg-white bg-opacity-90 items-center border-gray-800 border-8 flex'
            }
          >
            <div className={'flex w-full'}>
              {svg && svg?.tokenId && (
                <div className={'flex w-full'}>
                  <div>
                    <div
                      className={'border-gray-800 border-4 mr-6'}
                      key={svg.tokenId}
                    >
                      <div
                        className={styles.sync}
                        style={{
                          width: 200,
                          height: 200,
                          cursor: 'pointer',
                        }}
                        dangerouslySetInnerHTML={{ __html: svg.svg }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className={'mb-1 text-lg text-black'}>
                      <span
                        className={'font-bold uppercase text-lg title-font'}
                      >
                        Token ID:
                      </span>{' '}
                      {svg.tokenId}
                    </p>
                    <p className={'mb-1 text-lg text-black'}>
                      <span
                        className={'font-bold uppercase text-lg title-font'}
                      >
                        Colors:
                      </span>
                      <span
                        className={
                          'inline-block border-2 align-center border-gray-800 ml-3 mr-2 '
                        }
                        style={{
                          width: '15px',
                          height: '15px',
                          background: '#621f83',
                        }}
                      ></span>
                      #621f83,
                      <span
                        className={
                          'inline-block border-2 align-center border-gray-800 ml-3 mr-2 '
                        }
                        style={{
                          width: '15px',
                          height: '15px',
                          background: '#11dffa',
                        }}
                      ></span>
                      #11dffa
                    </p>
                    <p className={'mb-1 text-lg text-black'}>
                      <span
                        className={'font-bold uppercase text-lg title-font'}
                      >
                        Rarity:
                      </span>{' '}
                      Uncommon
                    </p>
                    <Link href={`/mint?tokenID=${svg.tokenId}`}>
                      <button
                        className={
                          'bg-blue-700 mt-10 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                        }
                      >
                        Re-Color ∞ Sync!
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              {(!svg || !svg?.tokenId) && (
                <div className={'w-full flex justify-center content-center'}>
                  <div className={'w-full flex content-center justify-center'}>
                    <Loader />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalDialog
