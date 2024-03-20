import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";

import { v4 as uuidv4 } from "uuid";
export default class Wallet extends BaseModel {
  @beforeCreate()
  public static async addUidHook(user: Wallet) {
    user.id = uuidv4();
  }
  @column({ isPrimary: true })
  public id: string;

  @column()
  public walletName: string;

  @column()
  public walletAddress: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
