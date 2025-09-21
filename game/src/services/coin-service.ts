import { Service } from "@keyslam/simple-node";

export class CoinService extends Service {
    public amount = 0;
    public backupAmount = 0;

    public backup() {
        this.backupAmount = this.amount
    }

    public restoreBackup() {
        this.amount = this.backupAmount
    }
}
