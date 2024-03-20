import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
// @ts-ignore
import oldUsers from "../../seederData/user.json";
// @ts-ignore
import oldTransactions from "../../seederData/stats.json";
import User from "../../app/Models/User";
import Transaction from "../../app/Models/Transaction";
import {
  TransactionClientContract,
  QueryClientContract,
  InsertQueryBuilderContract,
  OneOrMany,
} from "@ioc:Adonis/Lucid/Database";
import {
  ModelAdapterOptions,
  LucidRow,
  ModelObject,
  ExtractModelRelations,
  ModelRelations,
  LazyLoadAggregatesContract,
  CherryPickFields,
  CherryPick,
} from "@ioc:Adonis/Lucid/Orm";

export default class extends BaseSeeder {
  public async run() {
    // users
    let names = this.getDataFromKeys("name", oldUsers);
    let emails = this.getDataFromKeys("email", oldUsers);
    let passwords = this.getDataFromKeys("password", oldUsers);
    let phoneNumbers = this.getDataFromKeys("phoneNumber", oldUsers);
    let isAdmins = this.getDataFromKeys("isAdmin", oldUsers);
    let createdAts = this.getDataFromKeys("createdAt", oldUsers);

    // Transactions Stats

    let transactionUserIds = this.getDataFromKeys("userId", oldTransactions);
    let transactionDeposits = this.getDataFromKeys("deposit", oldTransactions);
    let transactionEarnings = this.getDataFromKeys("earning", oldTransactions);
    let transactionBalances = this.getDataFromKeys("balance", oldTransactions);
    let transactionWithdraws = this.getDataFromKeys(
      "withdraws",
      oldTransactions
    );
    let transactionCreatedAts = this.getDataFromKeys(
      "createdAt",
      oldTransactions
    );
    let transactionUpdatedAt = this.getDataFromKeys(
      "updatedAt",
      oldTransactions
    );

    let stats: any = [];

    transactionUserIds.values.forEach((sv, i) => {
      stats.push({
        userId: sv,
        profit: this.fixTransactionValue(transactionEarnings.values[i]),
        balance: this.fixTransactionValue(transactionBalances.values[i]),
        deposit: this.fixTransactionValue(transactionDeposits.values[i]),
        withdraws: this.fixTransactionValue(transactionWithdraws.values[i]),
        createdAt: this.fixTransactionValue(transactionCreatedAts.values[i]),
        updatedAt: this.fixTransactionValue(transactionUpdatedAt.values[i]),
      });
    });

    let users: any = [];

    names.ids.forEach(async (ni, i) => {
      users.push({
        id: ni,
        email: emails.values[i],
        fullName: names.values[i],
        userName: names.values[i].split(" ").join("-") + i,
        password: passwords.values[i],
        phoneNumber: phoneNumbers.values[i],
        // isAdmin: isAdmins.values[i],
        createdAt: createdAts.values[i],
        country: "",
        isVerified: true,
        rememberMeToken: null,
        profit: stats.find((v) => v.userId == ni).profit,
        balance: stats.find((v) => v.userId == ni).balance,
        totalDeposit: stats.find((v) => v.userId == ni).deposit,
        totalWithdraws: stats.find((v) => v.userId == ni).withdraws,
        updatedAt: createdAts.values[i],
      });
    });

    // Write your database queries inside the run method
    // await Promise.all(
    //   users.map(async (u) => {
    //     await User.create({ ...u });
    //   })
    // );
    // console.log(
    //   (await User.all()).find(
    //     (v) => v.id == "b6cd74f7-411c-40d6-a9a9-bf880abfb391"
    //   )?.password
    // );
  }
  getDataFromKeys(id: string, old: Array<Record<string, any>>) {
    let subject = old.find((value) => value["id"] == id)!;
    let values = Object.values(subject).splice(1);
    let ids = Object.keys(subject).splice(1);
    return { ids, values };
  }
  fixTransactionValue(v: string) {
    return parseInt(
      v
        .toString()
        .split("£")
        .join("")
        .split("%")
        .join("")
        .split("€")
        .join("")
        .split("$")
        .join("")
        .split(",")
        .join("")
    );
  }
}
