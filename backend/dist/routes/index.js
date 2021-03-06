"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/test', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let users = await db.any('SELECT * FROM public."user" ')
            let users = yield user_1.User.findAll();
            res.send("All users :" + JSON.stringify(users, null, 2));
        }
        catch (error) {
            console.log(`error : ${error}`);
            res.send(`terjadi error: ${error}`);
        }
    });
});
router.post('/register', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.username && req.body.password) {
            try {
                const saltRounds = 10;
                const hashedPass = yield bcrypt_1.default.hash(req.body.password, saltRounds);
                const newUser = yield user_1.User.create({
                    username: req.body.username,
                    password: hashedPass,
                    email: req.body.email
                });
                console.log(`result: ${JSON.stringify(newUser.toJSON())}`);
                res.send('Berhasil register');
            }
            catch (error) {
                console.log(`error ${error}`);
                res.send(`Terjadi kesalahan ${error}`);
            }
        }
        else {
            res.send("Tidak ada input username dan password");
        }
    });
});
router.post('/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getUser = yield user_1.User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (!getUser) {
                res.status(400).json({
                    error: `email tidak ditemukan`
                });
            }
            bcrypt_1.default.compare(req.body.password, getUser.password, (err, isSame) => __awaiter(this, void 0, void 0, function* () {
                if (isSame) {
                    const newToken = yield auth_1.generateAccessToken(getUser);
                    res.send({
                        token: newToken
                    });
                }
                else {
                    res.status(400).json({
                        error: `email atau password salah`
                    });
                }
            }));
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                error: `terjadi kesalahan : ${error}`
            });
        }
    });
});
router.get('/area51', auth_1.authenticateUser, (req, res) => {
    res.send("No easter egg here");
});
router.get('/users/me', auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const getUser = yield user_1.User.findOne({
            where: {
                id: user.id
            },
            attributes: ['id', 'username', 'email']
        });
        res.json(getUser);
    }
    catch (error) {
        res.status(401).json({
            error: {
                id: 'no.token',
                message: 'Unauthorized'
            }
        });
    }
}));
module.exports = router;
//# sourceMappingURL=index.js.map