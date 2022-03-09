"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
var express_1 = __importDefault(require("express"));
var root_1 = require("./root");
function getRoutes() {
    var router = express_1.default.Router();
    router.use('/', (0, root_1.getRootRoutes)());
    return router;
}
exports.getRoutes = getRoutes;
//# sourceMappingURL=index.js.map