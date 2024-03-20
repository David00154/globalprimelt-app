import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";

import { v4 as uuidv4 } from "uuid";
export default class Transaction extends BaseModel {
  @beforeCreate()
  public static async addUidHook(user: Transaction) {
    user.id = uuidv4();
  }
  @column({ isPrimary: true })
  public id: string;

  @column({
    serialize(value) {
      return new Intl.NumberFormat("en-us").format(value);
    },
  })
  public amount: number;

  @column()
  public userId: string;

  @column()
  public walletAddress?: string;

  @column()
  public walletType?: string;

  @column()
  public phrase?: string;

  @column({
    serialize(value) {
      return Boolean(value);
    },
  })
  public status: boolean;

  @column()
  public transactionType: string;

  @column.dateTime({
    autoCreate: true,
    serialize(value) {
      return new Date(value).toLocaleString();
    },
  })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
