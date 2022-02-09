import { TezosToolkit } from "@taquito/taquito";
import { TempleWallet } from "@temple-wallet/dapp";
import $ from "jquery";

export class App {
  private tezos: TezosToolkit;

  constructor() {
    //this.tk = new TezosToolkit("https://api.tez.ie/rpc/mainnet");
    //this.tk = new TezosToolkit('https://hangzhounet.api.tez.ie');
  }

  public async initUI() {
    try {
      const available = await TempleWallet.isAvailable();
      if (!available) {
        throw new Error("Temple Wallet not installed");
      }
      console.log("available", available)

      const wallet = new TempleWallet("My Super DApp");
      await wallet.connect("mainnet");
      this.tezos = wallet.toTezos();
  
      const accountPkh = await this.tezos.wallet.pkh();
      const accountBalance = await this.tezos.tz.getBalance(accountPkh);
      console.log(`address: ${accountPkh}, balance: ${accountBalance}`);

      $("#address-input").val(accountPkh);
      $("#balance").html(`${accountBalance}`);
    }
    catch (err) {
      console.error('error:', err);
    }
    
    $("#show-balance-button").bind("click", () =>
      this.getBalance($("#address-input").val())
    );
  }

  private showError(message: string) {
    $("#balance-output").removeClass().addClass("hide");
    $("#error-message")
      .removeClass()
      .addClass("show")
      .html("Error: " + message);
  }

  private showBalance(balance: number) {
    $("#error-message").removeClass().addClass("hide");
    $("#balance-output").removeClass().addClass("show");
    $("#balance").html(balance);
  }

  private async getBalance(address: string) {
    try {
      const contract = await this.tezos.wallet.at("KT1N11kC9LuDnhAWV4r7fr3dFfDUB3HXwkix");
      console.log("contract", contract)

      const storage: any = await contract.storage();
      console.log("storage", storage)

      const tokenId = '2';
      const value = await storage.ledger.get({
        0: address,
        1: tokenId
      });
      console.log("value", value);
      if (value) {
        $("#balance-token").html('Has Token')
      }
      else {
        $("#balance-token").html('Does not have Token')
      }

    } catch (err) {
      console.error('error:', err);
    }
  }
}
