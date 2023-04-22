"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const fs = require("fs");
const path = require("path");
let lang = {
    language: "EN_us",
};
const langPath = path.join(__dirname, "..", "..", "language.json");
try {
    lang = require(langPath);
}
catch (err) { }
class Language {
    constructor(langFile) {
        this.path = path.join(__dirname, "..", "..", "texts", `${langFile.replace(".lang", "")}.lang`);
    }
    static getLanguage() {
        var _a;
        return (_a = lang.language) !== null && _a !== void 0 ? _a : "EN_us";
    }
    translate(lang) {
        var _a;
        return (_a = this.convert().get(lang)) !== null && _a !== void 0 ? _a : lang;
    }
    convert() {
        const langs = fs.readFileSync(this.path, "utf8").split("\n").map((lang) => lang.split("="));
        const langObject = new Map();
        for (let i = 0; i < langs.length; i++) {
            for (let j = 0; j < langs[i].length; j += 2) {
                if (langs[i][j] !== "") {
                    langObject.set(langs[i][j], langs[i][j + 1]);
                }
            }
        }
        return langObject;
    }
}
exports.Language = Language;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QixJQUFJLElBQUksR0FFSjtJQUNBLFFBQVEsRUFBRSxPQUFPO0NBQ3BCLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRW5FLElBQUk7SUFDQSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQzVCO0FBQUMsT0FBTSxHQUFHLEVBQUUsR0FBRTtBQUVmLE1BQWEsUUFBUTtJQUdqQixZQUFZLFFBQWdCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXOztRQUNkLE9BQU8sTUFBQSxJQUFJLENBQUMsUUFBUSxtQ0FBSSxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFZOztRQUNsQixPQUFPLE1BQUEsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUNBQUksSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFTyxPQUFPO1FBQ1gsTUFBTSxLQUFLLEdBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoSCxNQUFNLFVBQVUsR0FBd0IsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFFbEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNwQixVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2hEO2FBQ0o7U0FDQTtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7Q0FDSjtBQTVCRCw0QkE0QkMifQ==