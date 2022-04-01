/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface MiddlewareInterface extends utils.Interface {
  contractName: "Middleware";
  functions: {
    "getArrayLength(address)": FunctionFragment;
    "getSellFeeAmount(address,uint256,uint64)": FunctionFragment;
    "getTotalAmount(address)": FunctionFragment;
    "refreshArray(address)": FunctionFragment;
    "setBuytimeToAmount(address,uint256,uint64)": FunctionFragment;
    "vestingSaleSchedule(uint64,uint64)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getArrayLength",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSellFeeAmount",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalAmount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "refreshArray",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setBuytimeToAmount",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "vestingSaleSchedule",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getArrayLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSellFeeAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "refreshArray",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBuytimeToAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vestingSaleSchedule",
    data: BytesLike
  ): Result;

  events: {};
}

export interface Middleware extends BaseContract {
  contractName: "Middleware";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MiddlewareInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getArrayLength(
      _sender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getSellFeeAmount(
      sender: string,
      amount: BigNumberish,
      sellTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getTotalAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    refreshArray(
      _sender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setBuytimeToAmount(
      receiver: string,
      amount: BigNumberish,
      buytime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    vestingSaleSchedule(
      sellTime: BigNumberish,
      buyTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { discountRate: BigNumber }>;
  };

  getArrayLength(
    _sender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getSellFeeAmount(
    sender: string,
    amount: BigNumberish,
    sellTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getTotalAmount(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  refreshArray(
    _sender: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setBuytimeToAmount(
    receiver: string,
    amount: BigNumberish,
    buytime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  vestingSaleSchedule(
    sellTime: BigNumberish,
    buyTime: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getArrayLength(
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSellFeeAmount(
      sender: string,
      amount: BigNumberish,
      sellTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    refreshArray(_sender: string, overrides?: CallOverrides): Promise<void>;

    setBuytimeToAmount(
      receiver: string,
      amount: BigNumberish,
      buytime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    vestingSaleSchedule(
      sellTime: BigNumberish,
      buyTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getArrayLength(
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSellFeeAmount(
      sender: string,
      amount: BigNumberish,
      sellTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getTotalAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    refreshArray(
      _sender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setBuytimeToAmount(
      receiver: string,
      amount: BigNumberish,
      buytime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    vestingSaleSchedule(
      sellTime: BigNumberish,
      buyTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getArrayLength(
      _sender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSellFeeAmount(
      sender: string,
      amount: BigNumberish,
      sellTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getTotalAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    refreshArray(
      _sender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setBuytimeToAmount(
      receiver: string,
      amount: BigNumberish,
      buytime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    vestingSaleSchedule(
      sellTime: BigNumberish,
      buyTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
