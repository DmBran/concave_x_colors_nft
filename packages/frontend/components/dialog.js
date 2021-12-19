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
                    <Dialog.Title className="text-xl">
                      Your Sync NFT
                    </Dialog.Title>
                    <div
                      className={'border-gray-800 border-4 m-4'}
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
                    <p>Traits:</p>
                    <p>1</p>
                    <p>2</p>
                    <Link href={`/mint?tokenID=${svg.tokenId}`}>
                      <button
                        className={
                          'bg-blue-700 mx-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                        }
                      >
                        Color ∞ Sync!
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
