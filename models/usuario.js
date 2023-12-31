const mongoose = require("mongoose"),
    Schema= mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto =require("crypto");
const jwt = require("jsonwebtoken");
const secret= require("../config").secret;

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: [true,"Não pode ficar vazio."]
    },
    email:{
        type: String,
        lowercase: true,
        uniqui: true,
        require: [true,"Não pode ficar vazio."],
        index: true,
        math: [/\S+@\S+\.\S+/,"É invalido."]
    },
    loja:{
        type: Schema.Types.ObjectId,
        ref: "Loja",
        require:[true,"Não pode ficar vazio."]
    },
    premissao:{
        type: Array,
        default: ["cliente"]
    },
    hash: String,
    salt: String,
    recovery:{
        type:{
            token: String,
            data: Date
        },
        default:{ }   
    }      
},{timestamps:true});

UsuarioSchema.plugin(uniqueValidator,{message: "ja esta sendo utilizado"});
UsuarioSchema.methods.setSenha = function(password){
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash= crypto.pbkdf2Sync(password, this.salt, 10000,513,"sha512").toString("hex");
};
UsuarioSchema.methods.validarSenha= function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000,512,"sha512").toString("hex");
    return hash === this.hash;
};

UsuarioSchema.methods.gerarToken = function(){
    const hoje = new Data();
    const exp = new Data(today);
    exp.setData(today.getData()+ 15);
    return jwt.sign({
        id: this._id,
        email: this.email,
        nome: this.nome,
        exp: parseFloat(exp.getTime()/1000, 10)
    },secret);
};
UsuarioSchema.methods.enviarAuthJSON=function(){
    return{
        nome:this.nome,
        email: this.email,
        loja: this.loja,
        role: this.premissao,
        token: this.gerarToken()
    };
};

UsuarioSchema.methods.criarTokeRecuperacaoSenha=function(){
    this.recovery={},
    this.recovery.token= crypto.randomBytes(16).toString("hex");
    this.recovery.data= new Data(new Data().getTime()+ 24*60*60*1000);
    return this.recovery;
};

UsuarioSchema.methods.finalizarTokenRecuperacaoSenha=function(){
    this.recovery ={ token: null, data: null };
    return this.recovery;
};
module.exports = mongoose.model("Usuario",UsuarioSchema);

