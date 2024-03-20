import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  beforeSave,
  beforeCreate,
} from "@ioc:Adonis/Lucid/Orm";
import Transaction from "./Transaction";

export default class User extends BaseModel {
  @beforeCreate()
  public static async addUidHook(user: User) {
    user.id = uuidv4();
  }
  @column({ isPrimary: true })
  public id: string;

  @column({
    serialize(value) {
      return Boolean(value);
    },
  })
  public isVerified: boolean;

  @column()
  public fullName: string;

  @column()
  public email: string;

  @column()
  public forgotPasswordToken: number | null;

  @column()
  public userName: string;

  @column()
  public country: string;

  @column()
  public phoneNumber: string;

  // @column({ serializeAs: null })
  @column()
  public password: string;
  // new Intl.NumberFormat('en-us').format(value)
  @column()
  public rememberMeToken: string | null;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public profit: number;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public balance: number;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public totalDeposit: number;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public totalWithdraws: number;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public totalBonus: number;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public totalReferralBonus: number;

  @column()
  public tradeDuration: number;

  @column()
  public profitPositivity: number;

  @column()
  public profitPercentage: number;

  @column()
  public validThruDay: string;

  @column()
  public validThruMonth: string;

  @column.dateTime({
    autoCreate: true,
    serialize(value) {
      return new Date(value).toLocaleString();
    },
  })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Transaction)
  public transactions: HasMany<typeof Transaction>;

  //   @beforeSave()
  //   public static async doStuff(user: User) {
  //     if (user.$dirty.pr) {
  //       console.log(parseInt(user.profit.toString().replace(/,/g, "")));
  //       user.profit = parseInt(user.profit.toString().replace(/,/g, ""));
  //       user.balance = parseInt(user.balance.toString().replace(/,/g, ""));
  //       user.totalBonus = parseInt(user.totalBonus.toString().replace(/,/g, ""));
  //       user.totalDeposit = parseInt(
  //         user.totalDeposit.toString().replace(/,/g, "")
  //       );
  //       user.totalReferralBonus = parseInt(
  //         user.totalReferralBonus.toString().replace(/,/g, "")
  //       );
  //       user.totalWithdraws = parseInt(
  //         user.totalWithdraws.toString().replace(/,/g, "")
  //       );
  //     }
  //   }
}
