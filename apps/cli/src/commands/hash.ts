import { Command } from "@oclif/core";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export default class HashCommand extends Command {
    static summary = "Prints out image hash generated by the build command";

    static description =
        "Converts the binary generated by the build command to hexadecimal and prints out the result to console";

    public static enableJsonFlag = true;

    private async getHash(hashPath: string) {
        const hash = fs.readFileSync(hashPath).toString("hex");

        if (!this.jsonEnabled()) {
            process.stdout.write(
                `${chalk.green("?")} Cartesi machine templateHash ${chalk.cyan(hash)}\n`,
            );
            return;
        }

        return { hash };
    }

    public async run() {
        // read hash of the cartesi machine snapshot, if one exists
        const hashPath = path.join(".sunodo", "image", "hash");

        if (fs.existsSync(hashPath)) {
            return this.getHash(hashPath);
        }

        this.error("Cartesi machine snapshot not found, run 'sunodo build'");
    }
}
