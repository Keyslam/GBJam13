import { Service } from "@keyslam/simple-node";

export class CoinService extends Service {
    public amount = 500;
    public backupAmount = 500;

    public backup() {
        this.backupAmount = this.amount
    }

    public restoreBackup() {
        this.amount = this.backupAmount
    }
}
