"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post("/", auth_1.loggedIn, upload_1.upload.single("image"), (req, res) => {
    var _a;
    res.json((_a = req.file) === null || _a === void 0 ? void 0 : _a.location);
});
exports.default = router;
