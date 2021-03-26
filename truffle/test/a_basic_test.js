var Credential = artifacts.require("Credential");

contract("Credential testing", (accounts) => {
    let cred;
    before(async () => {
        cred = await Credential.deployed();
    });

    it("Should do this", async () => {
        let o = await cred.viewOwner.call();
        //console.log(o); // account[0]
        let mint1;
        try {
            mint1 = await cred.mintAcad(accounts[1], "IS4302", "B", {from: accounts[1]});
        } catch(e) {}
        //console.log(mint1); // undefined
        let mint2 = await cred.mintAcad(accounts[1], "IS4302", "B", {from: accounts[0]});
        //console.log(mint2); // succes mint
        let mint3 = await cred.mintAcad(accounts[1], "BT3102", "X", {from: accounts[0]});
        let mint4 = await cred.mintAcad(accounts[1], "BT3103", "Y", {from: accounts[0]});
        let mint5 = await cred.mintAcad(accounts[1], "BT3104", "Z", {from: accounts[0]});
        let g1 = await cred.viewGrade.call(accounts[1],"IS4302");
        let g2 = await cred.viewGrade.call(accounts[1],"BT3102");
        let g3 = await cred.viewGrade.call(accounts[1],"Bt3103");
        let g4 = await cred.viewGrade.call(accounts[1],"BT3104");
        let g5 = await cred.viewGrade.call(accounts[1],"CS1010x");
        let g6 = await cred.viewGrade.call(accounts[0],"X");
        //console.log(g1); //B
        //console.log(g2); //X
        //console.log(g3); //NA
        //console.log(g4); //Z
        //console.log(g5); //NA
        //console.log(g6); //NA
        let mint6 = await cred.mintAcad(accounts[2], "CS1010", "A", {from: accounts[0]});
        let mint7 = await cred.mintAcad(accounts[2], "CS1010S", "B+", {from: accounts[0]});
        let g7 = await cred.viewGrade.call(accounts[2],"CS1010");
        let g8 = await cred.viewGrade.call(accounts[2],"CS1010S");
        //console.log(g7); //A
        //console.log(g8); //B+
        let c1 = await cred.studentAcadCount.call(accounts[1], {from: accounts[0]});
        let c2 = await cred.studentAcadCount.call(accounts[2], {from: accounts[0]});
        //console.log(c1.toNumber()); //4
        //console.log(c2.toNumber()); //2
        assert(g1=="B","1");
        assert(g2=="X","2");
        assert(g3=="NA","3");
        assert(g4=="Z","4");
        assert(g5=="NA","5");
        assert(g6=="NA","6");
        assert(g7=="A","7");
        assert(g8=="B+","8");
        assert(c1.toNumber()==4,"9");
        assert(c2.toNumber()==2,"10");
        let t1 = await cred.totalToken.call();
        //console.log(t1.toNumber()); //6
        assert(t1.toNumber()==6,"11");
        

    });
})

