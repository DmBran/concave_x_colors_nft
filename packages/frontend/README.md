## Getting Started

First, run a local hardhat node

```
cd $REPO_ROOT
npx hardhat node
```

Then, deploy the Renter contract locally

```bash
cd $REPO_ROOT
npx hardhat run scripts/preliminary_tests.js --network localhost
```

Update `.env.local.test` to point to the newly deployed contract

```bash
NEXT_PUBLIC_RENTAL_CONTRACT=<ADDRESS-FROM-PREVIOUS-STEP>
```

Run the development server

```bash
yarn dev
```
