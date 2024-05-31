import type {
  TypedAbiArg,
  TypedAbiFunction,
  TypedAbiMap,
  TypedAbiVariable,
  Response,
} from "@clarigen/core";

export const contracts = {
  dummyCallerExt: {
    clarity_version: "Clarity2",
    constants: {},
    contractName: "dummy-caller-ext",
    epoch: "Epoch25",
    functions: {
      testSetExtension: {
        access: "public",
        args: [],
        name: "test-set-extension",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      testSip010: {
        access: "public",
        args: [],
        name: "test-sip-010",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
    },
    fungible_tokens: [],
    maps: {},
    non_fungible_tokens: [],
    variables: {},
  },
  scwSip010: {
    clarity_version: "Clarity2",
    constants: {
      CONTRACT: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.scwSip010-vars",
      eRRBADARG: {
        isOk: false,
        value: 400n,
      },
      eRRTOKENNOTALLOWED: {
        isOk: false,
        value: 402n,
      },
      eRRUNAUTHORIZED: {
        isOk: false,
        value: 401n,
      },
    },
    contractName: "scw-sip-010",
    epoch: "Epoch25",
    functions: {
      getTokenWl: {
        access: "read_only",
        args: [{ name: "token-id", type: "principal" }],
        name: "get-token-wl",
        outputs: { type: { response: { error: "none", ok: "bool" } } },
      } as TypedAbiFunction<
        [tokenId: TypedAbiArg<string, "tokenId">],
        Response<boolean, null>
      >,
      isEnabled: {
        access: "private",
        args: [],
        name: "is-enabled",
        outputs: { type: "bool" },
      } as TypedAbiFunction<[], boolean>,
      isOwner: {
        access: "private",
        args: [],
        name: "is-owner",
        outputs: { type: "bool" },
      } as TypedAbiFunction<[], boolean>,
      isOwnerOrExtension: {
        access: "public",
        args: [],
        name: "is-owner-or-extension",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      isTokenEnabled: {
        access: "private",
        args: [{ name: "token-id", type: "principal" }],
        name: "is-token-enabled",
        outputs: { type: "bool" },
      } as TypedAbiFunction<[tokenId: TypedAbiArg<string, "tokenId">], boolean>,
      setTokenWl: {
        access: "public",
        args: [
          { name: "token-id", type: "principal" },
          { name: "state", type: "bool" },
        ],
        name: "set-token-wl",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<
        [
          tokenId: TypedAbiArg<string, "tokenId">,
          state: TypedAbiArg<boolean, "state">,
        ],
        Response<boolean, bigint>
      >,
      transfer: {
        access: "public",
        args: [
          { name: "token-id", type: "trait_reference" },
          { name: "amount", type: "uint128" },
          { name: "sender", type: "principal" },
          { name: "recipient", type: "principal" },
          { name: "memo", type: { optional: { buffer: { length: 34 } } } },
        ],
        name: "transfer",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<
        [
          tokenId: TypedAbiArg<string, "tokenId">,
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
          memo: TypedAbiArg<Uint8Array | null, "memo">,
        ],
        Response<boolean, bigint>
      >,
    },
    fungible_tokens: [],
    maps: {
      tokenWl: {
        key: "principal",
        name: "token-wl",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
    },
    non_fungible_tokens: [],
    variables: {
      CONTRACT: {
        access: "constant",
        name: "CONTRACT",
        type: "principal",
      } as TypedAbiVariable<string>,
      ERR_BAD_ARG: {
        access: "constant",
        name: "ERR-BAD-ARG",
        type: {
          response: {
            error: "uint128",
            ok: "none",
          },
        },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TOKEN_NOT_ALLOWED: {
        access: "constant",
        name: "ERR-TOKEN-NOT-ALLOWED",
        type: {
          response: {
            error: "uint128",
            ok: "none",
          },
        },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        access: "constant",
        name: "ERR-UNAUTHORIZED",
        type: {
          response: {
            error: "uint128",
            ok: "none",
          },
        },
      } as TypedAbiVariable<Response<null, bigint>>,
    },
  },
  sip010TraitFtStandard: {
    clarity_version: "Clarity1",
    constants: {},
    contractName: "sip-010-trait-ft-standard",
    epoch: "Epoch21",
    functions: {},
    fungible_tokens: [],
    maps: {},
    non_fungible_tokens: [],
    variables: {},
  },
  wallyMain: {
    clarity_version: "Clarity2",
    constants: {
      eRRUNAUTHORIZED: {
        isOk: false,
        value: 401n,
      },
      owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    },
    contractName: "wally-main",
    epoch: "Epoch25",
    functions: {
      getOwner: {
        access: "read_only",
        args: [],
        name: "get-owner",
        outputs: { type: "principal" },
      } as TypedAbiFunction<[], string>,
      isExtension: {
        access: "read_only",
        args: [{ name: "extension", type: "principal" }],
        name: "is-extension",
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [extension: TypedAbiArg<string, "extension">],
        boolean
      >,
      isOwner: {
        access: "private",
        args: [],
        name: "is-owner",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setExtension: {
        access: "public",
        args: [
          { name: "extension", type: "principal" },
          { name: "enabled", type: "bool" },
        ],
        name: "set-extension",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<
        [
          extension: TypedAbiArg<string, "extension">,
          enabled: TypedAbiArg<boolean, "enabled">,
        ],
        Response<boolean, bigint>
      >,
      setExtensions: {
        access: "public",
        args: [
          {
            name: "extension-list",
            type: {
              list: {
                length: 200,
                type: {
                  tuple: [
                    { name: "enabled", type: "bool" },
                    { name: "extension", type: "principal" },
                  ],
                },
              },
            },
          },
        ],
        name: "set-extensions",
        outputs: {
          type: {
            response: {
              error: "uint128",
              ok: { list: { length: 200, type: "bool" } },
            },
          },
        },
      } as TypedAbiFunction<
        [
          extensionList: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            }[],
            "extensionList"
          >,
        ],
        Response<boolean[], bigint>
      >,
      setExtensionsIter: {
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "enabled", type: "bool" },
                { name: "extension", type: "principal" },
              ],
            },
          },
        ],
        name: "set-extensions-iter",
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            },
            "item"
          >,
        ],
        boolean
      >,
    },
    fungible_tokens: [],
    maps: {
      extensions: {
        key: "principal",
        name: "extensions",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
    },
    non_fungible_tokens: [],
    variables: {
      ERR_UNAUTHORIZED: {
        access: "constant",
        name: "ERR-UNAUTHORIZED",
        type: {
          response: {
            error: "uint128",
            ok: "none",
          },
        },
      } as TypedAbiVariable<Response<null, bigint>>,
      owner: {
        access: "variable",
        name: "owner",
        type: "principal",
      } as TypedAbiVariable<string>,
    },
  },
  wstx: {
    clarity_version: "Clarity1",
    constants: {},
    contractName: "wstx",
    epoch: "Epoch21",
    functions: {
      getBalance: {
        access: "read_only",
        args: [{ name: "owner", type: "principal" }],
        name: "get-balance",
        outputs: { type: { response: { error: "none", ok: "uint128" } } },
      } as TypedAbiFunction<
        [owner: TypedAbiArg<string, "owner">],
        Response<bigint, null>
      >,
      getDecimals: {
        access: "read_only",
        args: [],
        name: "get-decimals",
        outputs: { type: { response: { error: "none", ok: "uint128" } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        access: "read_only",
        args: [],
        name: "get-name",
        outputs: {
          type: {
            response: { error: "none", ok: { "string-ascii": { length: 11 } } },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        access: "read_only",
        args: [],
        name: "get-symbol",
        outputs: {
          type: {
            response: { error: "none", ok: { "string-ascii": { length: 4 } } },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        access: "read_only",
        args: [],
        name: "get-token-uri",
        outputs: {
          type: {
            response: {
              error: "none",
              ok: { optional: { "string-utf8": { length: 21 } } },
            },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        access: "read_only",
        args: [],
        name: "get-total-supply",
        outputs: { type: { response: { error: "none", ok: "uint128" } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      transfer: {
        access: "public",
        args: [
          { name: "amount", type: "uint128" },
          { name: "sender", type: "principal" },
          { name: "recipient", type: "principal" },
          { name: "memo", type: { optional: { buffer: { length: 34 } } } },
        ],
        name: "transfer",
        outputs: { type: { response: { error: "uint128", ok: "bool" } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
          memo: TypedAbiArg<Uint8Array | null, "memo">,
        ],
        Response<boolean, bigint>
      >,
    },
    fungible_tokens: [],
    maps: {},
    non_fungible_tokens: [],
    variables: {},
  },
} as const;

export const accounts = {
  deployer: {
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    balance: "100000000000000",
  },
  faucet: {
    address: "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6",
    balance: "100000000000000",
  },
  wallet_1: {
    address: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
    balance: "100000000000000",
  },
  wallet_2: {
    address: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    balance: "100000000000000",
  },
  wallet_3: {
    address: "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC",
    balance: "100000000000000",
  },
  wallet_4: {
    address: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
    balance: "100000000000000",
  },
  wallet_5: {
    address: "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
    balance: "100000000000000",
  },
  wallet_6: {
    address: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
    balance: "100000000000000",
  },
  wallet_7: {
    address: "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
    balance: "100000000000000",
  },
  wallet_8: {
    address: "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
    balance: "100000000000000",
  },
} as const;

export const identifiers = {
  dummyCallerExt: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dummy-caller-ext",
  scwSip010: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.scw-sip-010",
  sip010TraitFtStandard:
    "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard",
  wallyMain: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.wally-main",
  wstx: "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
} as const;

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;

export const deployments = {
  dummyCallerExt: {
    devnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dummy-caller-ext",
    mainnet: null,
    simnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dummy-caller-ext",
    testnet: null,
  },
  scwSip010: {
    devnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.scw-sip-010",
    mainnet: null,
    simnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.scw-sip-010",
    testnet: null,
  },
  sip010TraitFtStandard: {
    devnet:
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard",
    mainnet:
      "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard",
    simnet:
      "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard",
    testnet: null,
  },
  wallyMain: {
    devnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.wally-main",
    mainnet: null,
    simnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.wally-main",
    testnet: null,
  },
  wstx: {
    devnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.wstx",
    mainnet: "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
    simnet: "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx",
    testnet: null,
  },
} as const;

export const project = {
  contracts,
  deployments,
} as const;
