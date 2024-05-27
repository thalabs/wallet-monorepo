# React + TypeScript + Vite

## Development

- Install clarinet through `brew install clarinet`
- clone the sc wallet contracts repo `git clone https://github.com/thalabs/sc-wally.git`
- update `deployments/default.devnet-plan.yaml` last instruction `stx-transfer` to instead of sending to my address `ST32AE...` change it to your address
- in the sc-wally repo dir run `clarinet devnet start -d` to start the dev env
- run the dev server for the react app with `pnpm dev`
  Enjoy
