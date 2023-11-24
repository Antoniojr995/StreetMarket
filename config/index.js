module.exports={
    secret:process.env.NODE_ENV === "prodution" ? process.env.SECRET : "YG7TYFY6R6YRF8FY6RF5E4RWSEDSTEDRERFRDY5HDGFUEJDUGE7474",
    api: process.env.NODE_ENV === "prodution" ? "https://api.loja-teste.ampliee.com" : "http://localhost:3000",
    loja: process.env.NODE_ENV === "prodution" ? "https://loja-teste.ampliee.com" : "http://localhost:8000"
};
